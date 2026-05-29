const BASE = '/api/gemini';

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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed. Please try again.');
  }
  const data = await res.json();
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed. Please try again.');
  }
  const data = await res.json();
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed. Please try again.');
  }
  const result = await res.json();
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed. Please try again.');
  }
  const result = await res.json();
  return result.text;
}
