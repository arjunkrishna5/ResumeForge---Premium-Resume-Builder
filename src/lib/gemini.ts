export async function improveJobDescription(
  description: string
): Promise<string> {
  const response = await fetch('/api/improveJobDescription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description })
  });
  if (!response.ok) throw new Error('API failed');
  const data = await response.json();
  return data.text;
}

export async function suggestSkills(
  jobTitle: string
): Promise<string[]> {
  const response = await fetch('/api/suggestSkills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobTitle })
  });
  if (!response.ok) throw new Error('API failed');
  const data = await response.json();
  return data.skills;
}

export async function generateSummary(data: {
  name: string;
  role: string;
  experience: Array<{ title: string; company: string }>;
  skills: string[];
}): Promise<string> {
  const response = await fetch('/api/generateSummary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('API failed');
  const result = await response.json();
  return result.text;
}
