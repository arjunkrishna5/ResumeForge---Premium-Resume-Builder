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

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'parseResume', text })
  });
  
  if (!response.ok) {
     let errMessage = 'Failed to parse resume via AI';
     if (response.status === 401 || response.status === 403) {
       errMessage = 'AI service configuration error. Please try again later.';
     } else if (response.status === 429) {
       const error = await response.json().catch(() => ({}));
       errMessage = error.error || 'AI rate limit exceeded. Please wait and try again.';
     } else if (response.status === 500) {
       errMessage = 'AI service temporarily unavailable.';
     } else {
       const error = await response.json().catch(() => ({}));
       if (error.error) errMessage = error.error;
     }
     throw new Error(errMessage);
  }

  const jsonResponse = await response.json();
  const parsedData = jsonResponse.data;
  
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
