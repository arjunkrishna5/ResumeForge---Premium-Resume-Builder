const BASE = '/api/gemini';

async function handleResponse(res: Response) {
  if (!res.ok) {
    let errMessage = 'Failed. Please try again.';
    if (res.status === 401 || res.status === 403) {
      errMessage = 'AI service configuration error. Please try again later.';
    } else if (res.status === 429) {
      const err = await res.json().catch(() => ({}));
      errMessage = err.error || 'AI rate limit exceeded. Please wait and try again.';
    } else if (res.status === 500) {
      errMessage = 'AI service temporarily unavailable.';
    } else {
      const err = await res.json().catch(() => ({}));
      if (err.error) errMessage = err.error;
    }
    throw new Error(errMessage);
  }
  return res.json();
}

export async function improveJobDescription(
  description: string
): Promise<string> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      action: 'improveJobDescription', 
      description 
    })
  });
  const data = await handleResponse(res);
  return data.text;
}

export async function suggestSkills(
  jobTitle: string
): Promise<string[]> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      action: 'suggestSkills', 
      jobTitle 
    })
  });
  const data = await handleResponse(res);
  return data.skills;
}

export async function generateSummary(data: {
  name: string;
  role: string;
  experience: Array<{ title: string; company: string }>;
  skills: string[];
}): Promise<string> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      action: 'generateSummary',
      ...data
    })
  });
  const result = await handleResponse(res);
  return result.text;
}

export async function generateCoverLetter(params: {
  name: string;
  jobTitle: string;
  company: string;
  tone: string;
  summary: string;
  skills: string[];
}): Promise<string> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      action: 'generateCoverLetter',
      ...params
    })
  });
  const result = await handleResponse(res);
  return result.text;
}
