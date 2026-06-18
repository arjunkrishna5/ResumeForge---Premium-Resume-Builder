export async function parseResumeFile(file: File): Promise<any> {
  let text = '';
  const fileType = file.name.split('.').pop()?.toLowerCase();

  if (fileType !== 'docx' && fileType !== 'pdf') {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }

  // Extract text using backend
  const formData = new FormData();
  formData.append('file', file);
  
  const extractRes = await fetch('/api/extractText', {
    method: 'POST',
    body: formData
  });

  if (!extractRes.ok) {
     const error = await extractRes.json();
     throw new Error(error.error || 'Failed to extract text from file');
  }

  const extractedData = await extractRes.json();
  text = extractedData.text;

  if (!text || text.trim() === '') {
    throw new Error('Could not extract any text from the file.');
  }

  let parsedData: any = null;
  let isRuleBased = false;

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'parseResume', text })
    });
    
    if (response.ok) {
      const jsonResponse = await response.json();
      parsedData = jsonResponse.data;
    } else {
      console.warn("AI parsing failed with status", response.status, ". Falling back to rule-based parser.");
      parsedData = extractRuleBasedData(text);
      isRuleBased = true;
    }
  } catch (err) {
    console.warn("AI parsing threw exception. Falling back to rule-based parser.", err);
    parsedData = extractRuleBasedData(text);
    isRuleBased = true;
  }

  if (!parsedData) {
    parsedData = extractRuleBasedData(text);
    isRuleBased = true;
  }
  
  // Ensure lists and required fields are somewhat initialized
  return {
    name: parsedData.name || '',
    role: parsedData.role || '',
    email: parsedData.email || '',
    phone: parsedData.phone || '',
    location: parsedData.location || '',
    linkedin: parsedData.linkedin || '',
    portfolio: parsedData.portfolio || '',
    summary: parsedData.summary || '',
    isRuleBased,
    experience: Array.isArray(parsedData.experience) ? parsedData.experience.map((e: any) => ({
       id: Math.random().toString(36).substring(7),
       title: e.title || '',
       company: e.company || '',
       startDate: e.startDate || '',
       endDate: e.endDate || '',
       current: !!e.current,
       description: e.description || ''
    })) : [],
    education: Array.isArray(parsedData.education) ? parsedData.education.map((e: any) => ({
       id: Math.random().toString(36).substring(7),
       institution: e.institution || '',
       degree: e.degree || '',
       field: e.field || '',
       startYear: e.startYear || '',
       endYear: e.endYear || '',
       grade: e.grade || ''
    })) : [],
    technicalSkills: Array.isArray(parsedData.technicalSkills) ? parsedData.technicalSkills : [],
    softSkills: Array.isArray(parsedData.softSkills) ? parsedData.softSkills : [],
    projects: Array.isArray(parsedData.projects) ? parsedData.projects.map((p: any) => ({
       id: Math.random().toString(36).substring(7),
       name: p.name || '',
       description: p.description || '',
       techStack: Array.isArray(p.techStack) ? p.techStack : [],
       liveUrl: p.liveUrl || '',
       githubUrl: p.githubUrl || ''
    })) : []
  };
}

function extractRuleBasedData(text: string): any {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  const result: any = {
    name: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    summary: '',
    experience: [],
    education: [],
    technicalSkills: [],
    softSkills: [],
    projects: []
  };

  if (lines.length === 0) return result;

  // 1. Find Email, Phone, and Links (LinkedIn, GitHub/Portfolio) via Regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9-_]+/i;
  const githubRegex = /github\.com\/[a-zA-Z0-9-_]+/i;
  const urlRegex = /https?:\/\/(?!www\.linkedin\.com|github\.com)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+/i;

  const contactLines: number[] = [];
  
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    const line = lines[i];
    
    const emailMatch = line.match(emailRegex);
    if (emailMatch && !result.email) {
      result.email = emailMatch[0];
      contactLines.push(i);
    }
    
    const phoneMatch = line.match(phoneRegex);
    if (phoneMatch && !result.phone) {
      result.phone = phoneMatch[0];
      contactLines.push(i);
    }
    
    const linkedinMatch = line.match(linkedinRegex);
    if (linkedinMatch && !result.linkedin) {
      result.linkedin = linkedinMatch[0];
      contactLines.push(i);
    }
    
    const githubMatch = line.match(githubRegex);
    if (githubMatch && !result.portfolio) {
      result.portfolio = githubMatch[0];
      contactLines.push(i);
    } else {
      const urlMatch = line.match(urlRegex);
      if (urlMatch && !result.portfolio) {
        result.portfolio = urlMatch[0];
        contactLines.push(i);
      }
    }
  }

  // 2. Determine Candidate Name and Role
  let candidateName = '';
  let candidateRole = '';
  
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    if (contactLines.includes(i)) continue;
    const cleanLine = lines[i];
    if (/resume|cv|curriculum vitae|biodata|contact/i.test(cleanLine)) continue;
    
    if (!candidateName) {
      candidateName = cleanLine;
    } else if (!candidateRole && cleanLine.split(' ').length <= 4) {
      candidateRole = cleanLine;
    }
  }
  result.name = candidateName;
  result.role = candidateRole;

  // 3. Section Parsing
  const sectionKeywords = {
    summary: /^(summary|profile|professional summary|about me|objective)/i,
    experience: /^(experience|work history|employment history|professional experience|work experience)/i,
    education: /^(education|academic background|studies|credentials|academic profile)/i,
    skills: /^(skills|technical skills|soft skills|technologies|expertise|skills & expertise)/i,
    projects: /^(projects|personal projects|key projects|selected projects|academic projects)/i
  };

  interface SectionBounds {
    type: string;
    startIndex: number;
  }
  const sectionsFound: SectionBounds[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (const [sectionType, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(line) && line.length < 40) {
        sectionsFound.push({ type: sectionType, startIndex: i });
        break;
      }
    }
  }

  sectionsFound.sort((a, b) => a.startIndex - b.startIndex);

  const getSectionLines = (sectionType: string): string[] => {
    const sectionIndex = sectionsFound.findIndex(s => s.type === sectionType);
    if (sectionIndex === -1) return [];
    
    const start = sectionsFound[sectionIndex].startIndex + 1;
    const end = (sectionIndex + 1 < sectionsFound.length) 
      ? sectionsFound[sectionIndex + 1].startIndex 
      : lines.length;
      
    return lines.slice(start, end);
  };

  // Summary
  const summaryLines = getSectionLines('summary');
  if (summaryLines.length > 0) {
    result.summary = summaryLines.join(' ');
  } else {
    const firstSectionStart = sectionsFound.length > 0 ? sectionsFound[0].startIndex : lines.length;
    const earlyTextLines = [];
    for (let i = 0; i < firstSectionStart; i++) {
      if (contactLines.includes(i) || lines[i] === result.name || lines[i] === result.role) continue;
      if (lines[i].length > 30) {
        earlyTextLines.push(lines[i]);
      }
    }
    if (earlyTextLines.length > 0) {
      result.summary = earlyTextLines.join(' ');
    }
  }

  // Skills
  const skillsLines = getSectionLines('skills');
  const extractedSkills: string[] = [];
  skillsLines.forEach(line => {
    const parts = line.split(/[,;|•\t]|\s{3,}/).map(p => p.trim()).filter(p => p.length > 1 && p.length < 30);
    extractedSkills.push(...parts);
  });
  result.technicalSkills = Array.from(new Set(extractedSkills));

  // Experience
  const expLines = getSectionLines('experience');
  let currentExp: any = null;
  
  for (let i = 0; i < expLines.length; i++) {
    const line = expLines[i];
    
    const dateMatch = line.match(/(\d{4}|present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
    const hasYear = line.match(/\b\d{4}\b/);
    const isHeaderLine = line.length < 100 && (hasYear || dateMatch) && (line.includes('-') || line.includes('–') || line.includes('to'));

    if (isHeaderLine || (!currentExp && line.length < 60)) {
      if (currentExp) {
        result.experience.push(currentExp);
      }
      
      let title = line;
      let company = '';
      let startDate = '';
      let endDate = '';
      let current = false;

      const dateParts = line.match(/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\s*\d{4}\s*[-–to]+\s*(?:present|current|today|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\s*\d{4})/gi);
      if (dateParts && dateParts.length > 0) {
        const fullDateRange = dateParts[0];
        title = line.replace(fullDateRange, '').trim();
        const splitDate = fullDateRange.split(/[-–]|to/i).map(d => d.trim());
        startDate = splitDate[0] || '';
        const endStr = splitDate[1] || '';
        if (/present|current|today/i.test(endStr)) {
          current = true;
          endDate = '';
        } else {
          endDate = endStr;
        }
      }

      const separatorMatch = title.match(/\s+at\s+|\s+@\s+|\s*\|\s*|\s*[-–,]\s*/i);
      if (separatorMatch) {
        const parts = title.split(separatorMatch[0]);
        title = parts[0].trim();
        company = parts[1]?.trim() || '';
      }

      currentExp = {
        title: title.replace(/^[^a-zA-Z0-9]+/, '').trim(),
        company: company.trim(),
        startDate,
        endDate,
        current,
        description: ''
      };
    } else if (currentExp) {
      currentExp.description += (currentExp.description ? '\n' : '') + line;
    }
  }
  if (currentExp) {
    result.experience.push(currentExp);
  }

  // Education
  const eduLines = getSectionLines('education');
  let currentEdu: any = null;

  for (let i = 0; i < eduLines.length; i++) {
    const line = eduLines[i];
    
    const hasDegree = /(bachelor|master|degree|associate|diploma|phd|doctorate|b\.s|b\.a|m\.s|m\.b\.a|b\.tech|m\.tech|secondary)/i.test(line);
    const hasYear = /\b\d{4}\b/.test(line);

    if (hasDegree || hasYear || (!currentEdu && line.length < 80)) {
      if (currentEdu) {
        result.education.push(currentEdu);
      }

      let institution = line;
      let degree = '';
      let field = '';
      let startYear = '';
      let endYear = '';

      const years = line.match(/\b\d{4}\b/g);
      if (years && years.length > 0) {
        if (years.length >= 2) {
          startYear = years[0];
          endYear = years[1];
        } else {
          endYear = years[0];
        }
        institution = institution.replace(/\b\d{4}\b/g, '').replace(/[-–to\s()]/g, ' ').trim();
      }

      const degreeRegex = /(?:bachelor|master|b\.s|b\.a|m\.s|m\.b\.a|b\.tech|m\.tech|degree|diploma)\s+(?:of|in)?\s*([a-zA-Z\s]+)/i;
      const degreeMatch = line.match(degreeRegex);
      if (degreeMatch) {
        degree = degreeMatch[0].trim();
        institution = institution.replace(degreeMatch[0], '').trim();
      }

      currentEdu = {
        institution: institution.replace(/^[^a-zA-Z0-9]+/, '').trim(),
        degree: degree || 'Degree',
        field: field || 'Field of Study',
        startYear,
        endYear,
        grade: ''
      };
    } else if (currentEdu) {
      if (line.length < 50 && !currentEdu.grade) {
        if (line.includes('GPA') || line.includes('Grade') || line.includes('%')) {
          currentEdu.grade = line;
        }
      }
    }
  }
  if (currentEdu) {
    result.education.push(currentEdu);
  }

  // Projects
  const projLines = getSectionLines('projects');
  let currentProj: any = null;

  for (let i = 0; i < projLines.length; i++) {
    const line = projLines[i];
    
    const isBullet = /^[•\-\*]/.test(line);
    const isNewProject = !isBullet && line.length < 60 && !line.includes('  ');

    if (isNewProject) {
      if (currentProj) {
        result.projects.push(currentProj);
      }

      let name = line;
      let techStack: string[] = [];
      let githubUrl = '';
      let liveUrl = '';

      const gitMatch = line.match(githubRegex);
      if (gitMatch) {
        githubUrl = gitMatch[0];
        name = name.replace(gitMatch[0], '').trim();
      }

      const techMatch = line.match(/[\(\[](.*?)[\)\]]/);
      if (techMatch) {
        techStack = techMatch[1].split(/[,|]/).map(t => t.trim()).filter(Boolean);
        name = name.replace(techMatch[0], '').trim();
      }

      currentProj = {
        name: name.replace(/^[^a-zA-Z0-9]+/, '').trim(),
        description: '',
        techStack,
        liveUrl,
        githubUrl
      };
    } else if (currentProj) {
      const gitMatch = line.match(githubRegex);
      if (gitMatch && !currentProj.githubUrl) {
        currentProj.githubUrl = gitMatch[0];
      }
      const urlMatch = line.match(urlRegex);
      if (urlMatch && !currentProj.liveUrl) {
        currentProj.liveUrl = urlMatch[0];
      }
      currentProj.description += (currentProj.description ? '\n' : '') + line;
    }
  }
  if (currentProj) {
    result.projects.push(currentProj);
  }

  return result;
}
