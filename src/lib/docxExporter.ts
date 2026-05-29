import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData } from './resumeService';

export async function generateDocx(data: ResumeData, fileName: string): Promise<void> {
  const doc = new Document({
    sections: [{
      children: [
        // Name as large heading
        new Paragraph({
          text: data.name,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER
        }),
        // Role
        new Paragraph({
          text: data.role,
          alignment: AlignmentType.CENTER
        }),
        // Contact line
        new Paragraph({
          children: [
            new TextRun({
              text: [data.email, data.phone, data.location].filter(Boolean).join(' • ')
            })
          ],
          alignment: AlignmentType.CENTER
        }),
        // Summary
        ...(data.summary ? [
          new Paragraph({ text: 'Summary', heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: data.summary })
        ] : []),
        // Experience section
        ...(data.experience && data.experience.length > 0 ? [
          new Paragraph({ text: 'Experience', heading: HeadingLevel.HEADING_2 }),
          ...data.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.title, bold: true }),
                new TextRun({ text: ` — ${exp.company}` })
              ]
            }),
            new Paragraph({
              text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`
            }),
            new Paragraph({ text: exp.description })
          ])
        ] : []),
        // Skills
        ...((data.technicalSkills && data.technicalSkills.length > 0) || (data.softSkills && data.softSkills.length > 0) ? [
          new Paragraph({ text: 'Skills', heading: HeadingLevel.HEADING_2 }),
          new Paragraph({
            text: [...(data.technicalSkills || []), ...(data.softSkills || [])].join(', ')
          })
        ] : []),
        // Education
        ...(data.education && data.education.length > 0 ? [
          new Paragraph({ text: 'Education', heading: HeadingLevel.HEADING_2 }),
          ...data.education.map(edu =>
            new Paragraph({
              children: [
                new TextRun({ text: edu.institution, bold: true }),
                new TextRun({ text: ` — ${edu.degree} in ${edu.field}` })
              ]
            })
          )
        ] : []),
        // Projects
        ...(data.projects && data.projects.length > 0 ? [
          new Paragraph({ text: 'Projects', heading: HeadingLevel.HEADING_2 }),
          ...data.projects.flatMap(proj => [
            new Paragraph({
              children: [new TextRun({ text: proj.name, bold: true })]
            }),
            new Paragraph({ text: proj.description })
          ])
        ] : [])
      ]
    }]
  });
  
  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName);
}
