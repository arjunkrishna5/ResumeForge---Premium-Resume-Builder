import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { motion } from "motion/react";
import { ArrowLeft, Download, Share2, Printer, FileText } from "lucide-react";

export function ResumePreviewPage() {
  const { id } = useParams();

  // Dummy data for preview
  const resumeData = {
    name: "Alex Johnson",
    title: "Senior Software Engineer",
    email: "alex.johnson@email.com",
    phone: "+1 (234) 567-8900",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexj",
    github: "github.com/alexj",
    summary: "Senior Software Engineer with 8+ years of experience building scalable backend systems and responsive web applications. Proven track record of leading cross-functional teams to deliver high-impact products, reducing system latency by 40% and increasing user engagement.",
    experience: [
      {
        company: "TechNova Inc.",
        role: "Senior Software Engineer",
        date: "Jan 2021 – Present",
        description: [
          "Architected and deployed a microservices-based backend using Node.js and Docker, reducing API response time by 35%.",
          "Mentored a team of 4 junior engineers, establishing code review practices and CI/CD pipelines.",
          "Partnered with product managers to define technical roadmaps for new features."
        ]
      },
      {
        company: "WebSolutions Group",
        role: "Full Stack Developer",
        date: "Mar 2017 – Dec 2020",
        description: [
          "Developed rich user interfaces using React and Redux, improving accessibility and lighthouse scores to 95+.",
          "Integrated third-party payment gateways (Stripe, PayPal) resulting in a 20% increase in conversion rates.",
          "Optimized SQL queries and database indexes, cutting down report generation time from minutes to seconds."
        ]
      }
    ],
    education: [
      {
        institution: "University of California, Berkeley",
        degree: "B.S. in Computer Science",
        date: "2013 – 2017",
        details: "GPA: 3.8/4.0 | Dean's List (all semesters) | President of the CS Club"
      }
    ],
    skills: ["TypeScript", "React", "Node.js", "Python", "GraphQL", "Docker", "AWS", "PostgreSQL", "System Architecture", "Agile/Scrum"],
    projects: [
      {
        name: "E-Commerce Micro-platform",
        description: "Built a headless commerce solution using Next.js and Stripe, serving 10k+ MAU."
      },
      {
        name: "DevTool CLI",
        description: "Open-source CLI tool for scaffolding React projects, with 5k+ weekly downloads on npm."
      }
    ]
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 font-sans">
      {/* Toolbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" className="text-slate-300 hover:bg-slate-800 hover:text-white border-transparent bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="h-6 w-px bg-slate-700" />
          <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Resume Preview
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
            <Download className="mr-2 h-4 w-4" />
            DOCX
          </Button>
          <Button className="bg-primary text-white hover:bg-[#4F46E5] hover:-translate-y-[1px]">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </header>

      {/* Canvas Area */}
      <main className="flex-1 overflow-y-auto p-8 sm:p-12 lg:p-16 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto w-[210mm] min-h-[297mm] bg-white p-[20mm] text-slate-900 shadow-2xl shadow-black/50 print:m-0 print:w-full print:border-none print:shadow-none print:p-[15mm]"
        >
          {/* Resume Content - Modern Template */}
          <div className="flex flex-col gap-8">
            
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-6 text-center">
              <h1 className="mb-2 text-4xl font-bold uppercase tracking-tight text-slate-900">
                {resumeData.name}
              </h1>
              <h2 className="mb-4 text-lg font-medium uppercase tracking-[0.2em] text-primary">
                {resumeData.title}
              </h2>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-medium text-slate-600">
                <span>{resumeData.email}</span>
                <span className="text-slate-300">•</span>
                <span>{resumeData.phone}</span>
                <span className="text-slate-300">•</span>
                <span>{resumeData.location}</span>
                <span className="text-slate-300">•</span>
                <span>{resumeData.linkedin}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="text-justify text-sm leading-relaxed text-slate-700">
              {resumeData.summary}
            </div>

            {/* Experience */}
            <div>
              <h3 className="mb-4 border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                Experience
              </h3>
              <div className="flex flex-col gap-6">
                {resumeData.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="mb-1 flex items-baseline justify-between">
                      <h4 className="font-bold text-slate-900">{exp.role}</h4>
                      <span className="text-xs font-semibold text-slate-500">{exp.date}</span>
                    </div>
                    <div className="mb-2 text-sm font-medium text-primary">
                      {exp.company}
                    </div>
                    <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                      {exp.description.map((desc, j) => (
                        <li key={j} className="leading-relaxed pl-2 -indent-4 mb-1">
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="mb-4 border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                Education
              </h3>
              <div className="flex flex-col gap-4">
                {resumeData.education.map((edu, i) => (
                  <div key={i}>
                    <div className="mb-1 flex items-baseline justify-between">
                      <h4 className="font-bold text-slate-900">{edu.institution}</h4>
                      <span className="text-xs font-semibold text-slate-500">{edu.date}</span>
                    </div>
                    <div className="mb-1 text-sm font-medium text-primary">
                      {edu.degree}
                    </div>
                    <div className="text-sm text-slate-700">{edu.details}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Grid for Skills and Projects */}
            <div className="grid grid-cols-2 gap-8">
              {/* Skills */}
              <div>
                <h3 className="mb-4 border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, i) => (
                    <span key={i} className="rounded bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                 <h3 className="mb-4 border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                  Projects
                </h3>
                <div className="flex flex-col gap-4">
                  {resumeData.projects.map((proj, i) => (
                    <div key={i}>
                      <h4 className="mb-1 text-sm font-bold text-slate-900">{proj.name}</h4>
                      <p className="text-sm leading-relaxed text-slate-700">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </main>
    </div>
  );
}
