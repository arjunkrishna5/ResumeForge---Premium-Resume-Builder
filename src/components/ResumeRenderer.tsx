import { ResumeData } from "../lib/resumeService";

export function ResumeRenderer({ data, template }: { data: ResumeData, template: string }) {
  if (template === "minimal") {
    return (
      <div className="p-[12mm] font-sans text-slate-900 bg-white min-h-full">
        <header className="mb-8 border-b border-slate-300 pb-6">
          <h1 className="text-4xl font-light tracking-tight">{data.name || 'YOUR NAME'}</h1>
          <h2 className="text-xl font-medium text-slate-500 mt-1">{data.role || 'YOUR ROLE'}</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-3">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>| {data.phone}</span>}
            {data.location && <span>| {data.location}</span>}
            {data.linkedin && <span>| {data.linkedin}</span>}
            {data.portfolio && <span>| {data.portfolio}</span>}
          </div>
        </header>

        {data.summary && (
          <section className="mb-6">
            <p className="text-[13px] leading-relaxed text-left text-slate-700">{data.summary}</p>
          </section>
        )}

        <div className="flex flex-col gap-6">
          {data.experience.length > 0 && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Experience</h3>
              <div className="space-y-4">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-medium">{exp.title}</h4>
                      <span className="text-xs text-slate-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="text-sm text-slate-600 mb-2">{exp.company}</div>
                    <div className="text-[13px] leading-relaxed text-slate-600 whitespace-pre-wrap">{exp.description}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Education</h3>
              <div className="space-y-3">
                {data.education.map(edu => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-medium">{edu.institution}</h4>
                      <div className="text-sm text-slate-600">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                    </div>
                    <span className="text-xs text-slate-500">{edu.startYear} - {edu.endYear}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {(data.technicalSkills.length > 0 || data.softSkills.length > 0) && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Skills</h3>
              <p className="text-[13px] leading-relaxed text-slate-700">
                {[...data.technicalSkills, ...data.softSkills].join(" • ")}
              </p>
            </section>
          )}

           {data.projects.length > 0 && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Projects</h3>
              <div className="space-y-4">
                {data.projects.map(proj => (
                  <div key={proj.id}>
                    <h4 className="font-medium mb-1">{proj.name}</h4>
                    <div className="text-[13px] leading-relaxed text-slate-600 whitespace-pre-wrap">{proj.description}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  if (template === "classic") {
    return (
      <div className="p-[20mm] font-serif text-black bg-white min-h-full">
        <header className="mb-6 text-center border-b-[3px] border-double border-black pb-4">
          <h1 className="text-3xl font-bold uppercase tracking-wide">{data.name || 'YOUR NAME'}</h1>
          <h2 className="text-lg italic mt-1">{data.role || 'Your Role'}</h2>
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs mt-2">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>| {data.phone}</span>}
            {data.location && <span>| {data.location}</span>}
            {data.linkedin && <span>| {data.linkedin}</span>}
            {data.portfolio && <span>| {data.portfolio}</span>}
          </div>
        </header>

        {data.summary && (
          <section className="mb-5">
            <h3 className="text-[13px] font-bold uppercase border-b border-black mb-2 uppercase">Professional Summary</h3>
            <p className="text-[13px] leading-relaxed text-justify">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-5">
            <h3 className="text-[13px] font-bold uppercase border-b border-black mb-2 uppercase">Experience</h3>
            <div className="space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold">{exp.title}</h4>
                    <span className="text-[11px] italic">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-[13px] italic mb-1">{exp.company}</div>
                  <div className="text-[13px] leading-relaxed whitespace-pre-wrap relative pl-4 before:content-['•'] before:absolute before:left-0">{exp.description.replace(/\n\s*- /g, '\n• ')}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="mb-5">
             <h3 className="text-[13px] font-bold uppercase border-b border-black mb-2 uppercase">Education</h3>
             <div className="space-y-2">
                {data.education.map(edu => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold">{edu.degree} in {edu.field}</span>, {edu.institution}
                    </div>
                    <span className="text-[11px] italic">{edu.startYear} – {edu.endYear}</span>
                  </div>
                ))}
             </div>
          </section>
        )}

        {(data.technicalSkills.length > 0 || data.softSkills.length > 0) && (
          <section className="mb-5">
             <h3 className="text-[13px] font-bold uppercase border-b border-black mb-2 uppercase">Skills</h3>
             <p className="text-[13px] leading-relaxed">
               <strong>Technical:</strong> {data.technicalSkills.join(', ')}<br/>
               <strong>Soft Skills:</strong> {data.softSkills.join(', ')}
             </p>
          </section>
        )}
        
        {data.projects.length > 0 && (
          <section className="mb-5">
             <h3 className="text-[13px] font-bold uppercase border-b border-black mb-2 uppercase">Projects</h3>
             <div className="space-y-3">
                {data.projects.map(p => (
                   <div key={p.id}>
                      <span className="font-bold">{p.name}</span>
                      <p className="text-[13px] leading-relaxed mt-1">{p.description}</p>
                   </div>
                ))}
             </div>
          </section>
        )}
      </div>
    );
  }

  if (template === "creative") {
    return (
      <div style={{
        width: '210mm',
        minHeight: '297mm', 
        transformOrigin: 'top center',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',  // prevent overflow
      }}>
         <aside style={{ 
          width: '30%', 
          backgroundColor: '#4338CA',
          minHeight: '297mm',
          padding: '24px 16px',
          flexShrink: 0  // prevent shrinking
        }} className="text-white h-full">
            <h1 className="text-3xl font-display font-bold mb-2 break-words leading-tight">{data.name || 'YOUR NAME'}</h1>
            <h2 className="text-sm font-medium text-indigo-300 uppercase tracking-widest mb-8">{data.role || 'ROLE'}</h2>
            
            <div className="space-y-4 text-xs font-medium text-indigo-100 mb-10">
               {data.email && <div>{data.email}</div>}
               {data.phone && <div>{data.phone}</div>}
               {data.location && <div>{data.location}</div>}
               {data.linkedin && <div className="break-words">{data.linkedin}</div>}
               {data.portfolio && <div className="break-words">{data.portfolio}</div>}
            </div>

            {(data.technicalSkills.length > 0 || data.softSkills.length > 0) && (
               <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest border-b border-indigo-700 pb-2 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                     {[...data.technicalSkills, ...data.softSkills].map(s => (
                        <span key={s} className="px-2 py-1 bg-indigo-800 text-[10px] rounded break-words max-w-full leading-tight">{s}</span>
                     ))}
                  </div>
               </div>
            )}
         </aside>
         <main style={{ 
          flex: 1, 
          backgroundColor: 'white',
          padding: '24px',
          overflow: 'hidden'
        }} className="w-[70%]">
            {data.summary && (
               <section className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900 border-b-2 border-indigo-500 w-fit pb-1 mb-4">Profile</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{data.summary}</p>
               </section>
            )}

            {data.experience.length > 0 && (
               <section className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900 border-b-2 border-indigo-500 w-fit pb-1 mb-4">Experience</h3>
                  <div className="space-y-6">
                     {data.experience.map(exp => (
                        <div key={exp.id} className="relative pl-4 border-l-2 border-indigo-100">
                           <div className="absolute w-2.5 h-2.5 bg-indigo-500 rounded-full -left-[6px] top-1"></div>
                           <h4 className="font-bold text-slate-900">{exp.title}</h4>
                           <div className="text-xs font-bold text-indigo-600 mb-2">{exp.company} <span className="text-slate-400 font-medium ml-2">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span></div>
                           <div className="text-[13px] leading-relaxed text-slate-600 whitespace-pre-wrap">{exp.description}</div>
                        </div>
                     ))}
                  </div>
               </section>
            )}

            {data.education.length > 0 && (
               <section className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900 border-b-2 border-indigo-500 w-fit pb-1 mb-4">Education</h3>
                  <div className="space-y-4">
                     {data.education.map(edu => (
                        <div key={edu.id} className="relative pl-4 border-l-2 border-indigo-100">
                           <div className="absolute w-2.5 h-2.5 bg-indigo-500 rounded-full -left-[6px] top-1"></div>
                           <h4 className="font-bold text-slate-900 text-sm">{edu.degree}</h4>
                           <div className="text-xs font-bold text-indigo-600 mb-1">{edu.institution}</div>
                           <div className="text-[10px] text-slate-400 font-medium">{edu.startYear} - {edu.endYear}</div>
                        </div>
                     ))}
                  </div>
               </section>
            )}

            {data.projects.length > 0 && (
               <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-900 border-b-2 border-indigo-500 w-fit pb-1 mb-4">Projects</h3>
                  <div className="space-y-6">
                     {data.projects.map(proj => (
                        <div key={proj.id}>
                           <h4 className="font-bold text-slate-900 mb-1">{proj.name}</h4>
                           <div className="text-[13px] leading-relaxed text-slate-600 mb-2">{proj.description}</div>
                           <div className="flex flex-wrap gap-1">
                              {proj.techStack.map(t => <span key={t} className="text-[10px] bg-indigo-50 text-indigo-700 px-2 rounded-full">{t}</span>)}
                           </div>
                        </div>
                     ))}
                  </div>
               </section>
            )}
         </main>
      </div>
    );
  }

  if (template === "zenith") {
    return (
      <div className="p-[15mm] font-sans text-slate-900 bg-white min-h-full">
        <header className="mb-6 pb-4 border-b-2 border-slate-900">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">{data.name || 'YOUR NAME'}</h1>
          <h2 className="text-lg font-medium text-slate-500 mt-1 uppercase tracking-widest">{data.role || 'YOUR ROLE'}</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium mt-3">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>| {data.phone}</span>}
            {data.location && <span>| {data.location}</span>}
            {data.linkedin && <span>| {data.linkedin}</span>}
            {data.portfolio && <span>| {data.portfolio}</span>}
          </div>
        </header>

        {(data.technicalSkills.length > 0 || data.softSkills.length > 0) && (
          <section className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Core Competencies</h3>
            <div className="flex flex-wrap gap-2">
              {[...data.technicalSkills, ...data.softSkills].map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-md">{s}</span>
              ))}
            </div>
          </section>
        )}

        {data.summary && (
          <section className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-200 pb-2">Professional Summary</h3>
            <p className="text-sm leading-relaxed text-slate-700 font-medium">{data.summary}</p>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {data.experience.length > 0 && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Experience</h3>
                <div className="space-y-6">
                  {data.experience.map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-base">{exp.title}</h4>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                      </div>
                      <div className="text-sm font-bold text-primary mb-3">{exp.company}</div>
                      <div className="text-[13px] leading-relaxed text-slate-600 whitespace-pre-wrap">{exp.description}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div className="space-y-8">
            {data.education.length > 0 && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Education</h3>
                <div className="space-y-5">
                  {data.education.map(edu => (
                    <div key={edu.id}>
                      <h4 className="font-bold text-sm leading-snug">{edu.degree}</h4>
                      <div className="text-xs text-slate-600 font-medium mt-1">{edu.institution}</div>
                      <div className="text-xs text-slate-400 mt-1">{edu.startYear} - {edu.endYear}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {data.projects.length > 0 && (
              <section>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-200 pb-2">Projects</h3>
                <div className="space-y-5">
                  {data.projects.map(proj => (
                    <div key={proj.id}>
                      <h4 className="font-bold text-sm mb-1">{proj.name}</h4>
                      <div className="text-[13px] leading-relaxed text-slate-600 mb-2">{proj.description}</div>
                      <div className="flex flex-wrap gap-1">
                        {proj.techStack.map(t => <span key={t} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{t}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (template === "monogram") {
    return (
      <div className="p-[12mm] font-serif text-slate-900 bg-white min-h-full border-l-[12px] border-indigo-700">
        <header className="mb-6 pl-4 border-l-2 border-indigo-200">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{data.name || 'YOUR NAME'}</h1>
          <h2 className="text-lg font-medium text-slate-600 mt-1">{data.role || 'YOUR ROLE'}</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-sans mt-3">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>| {data.phone}</span>}
            {data.location && <span>| {data.location}</span>}
            {data.linkedin && <span>| {data.linkedin}</span>}
            {data.portfolio && <span>| {data.portfolio}</span>}
          </div>
        </header>

        <div className="h-px bg-slate-200 mb-6 mx-4"></div>

        <div className="pl-4">
          {data.summary && (
            <section className="mb-6">
              <p className="text-[14px] leading-relaxed text-slate-700">{data.summary}</p>
            </section>
          )}

          {data.experience.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-700 mb-4 font-sans">Experience</h3>
              <div className="space-y-5">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-[15px]"><span className="text-slate-900">{exp.title}</span> <span className="text-slate-400 font-normal">— {exp.company}</span></h4>
                      <span className="text-[13px] font-sans text-slate-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="text-[14px] leading-relaxed text-slate-700 whitespace-pre-wrap font-sans">{exp.description}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.education.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-700 mb-4 font-sans">Education</h3>
              <div className="space-y-3">
                {data.education.map(edu => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-[15px]">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                      <div className="text-[14px] text-slate-600 font-sans">{edu.institution}</div>
                    </div>
                    <span className="text-[13px] font-sans text-slate-500">{edu.startYear} - {edu.endYear}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(data.technicalSkills.length > 0 || data.softSkills.length > 0) && (
            <section className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-700 mb-4 font-sans">Skills</h3>
              <p className="text-[14px] leading-relaxed text-slate-700 font-sans">
                {[...data.technicalSkills, ...data.softSkills].join(", ")}
              </p>
            </section>
          )}
        </div>
      </div>
    );
  }

  if (template === "compact") {
    return (
      <div className="p-[10mm] font-sans text-slate-900 bg-white min-h-full leading-[1.35]">
        <header className="flex justify-between items-baseline mb-3 pb-2 border-b border-slate-300">
          <div>
            <h1 className="text-2xl font-bold inline-block mr-3">{data.name || 'YOUR NAME'}</h1>
            <h2 className="text-[13px] text-slate-600 inline-block font-medium border-l border-slate-300 pl-3">{data.role || 'YOUR ROLE'}</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>| {data.phone}</span>}
            {data.location && <span>| {data.location}</span>}
            {data.linkedin && <span>| {data.linkedin}</span>}
            {data.portfolio && <span>| {data.portfolio}</span>}
          </div>
        </header>

        {data.summary && (
          <section className="mb-3 text-[12px] text-slate-800 text-justify">
            {data.summary}
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-3">
            <h3 className="text-[11px] font-bold uppercase border-b border-slate-300 mb-2 pb-0.5 text-slate-800">Experience</h3>
            <div className="space-y-2">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-[13px]">{exp.company} <span className="font-normal mx-1">—</span> {exp.title}</h4>
                    <span className="text-[11px] text-slate-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-[12px] text-slate-700 whitespace-pre-wrap ml-2 border-l border-slate-200 pl-2">{exp.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col gap-4">
          {data.education.length > 0 && (
            <section>
              <h3 className="text-[11px] font-bold uppercase border-b border-slate-300 mb-2 pb-0.5 text-slate-800">Education</h3>
              <div className="space-y-2">
                {data.education.map(edu => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-[12px]">{edu.institution}</h4>
                      <div className="text-[11px] text-slate-600">{edu.degree}</div>
                    </div>
                    <span className="text-[11px] text-slate-500">{edu.startYear}-{edu.endYear}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(data.technicalSkills.length > 0 || data.softSkills.length > 0) && (
            <section>
              <h3 className="text-[11px] font-bold uppercase border-b border-slate-300 mb-2 pb-0.5 text-slate-800">Skills</h3>
              <p className="text-[12px] text-slate-700">
                {[...data.technicalSkills, ...data.softSkills].join(", ")}
              </p>
            </section>
          )}
        </div>
      </div>
    );
  }

  if (template === "gradient") {
    return (
      <div className="font-sans text-slate-800 bg-white min-h-[297mm] flex flex-col">
        <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-[15mm] text-center shadow-md">
          <h1 className="text-4xl font-bold tracking-tight mb-2">{data.name || 'YOUR NAME'}</h1>
          <h2 className="text-lg font-medium text-indigo-100 mb-4">{data.role || 'YOUR ROLE'}</h2>
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs font-medium text-white/90">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>| {data.phone}</span>}
            {data.location && <span>| {data.location}</span>}
            {data.linkedin && <span>| {data.linkedin}</span>}
            {data.portfolio && <span>| {data.portfolio}</span>}
          </div>
        </header>

        <main className="p-[15mm] flex-1">
          {data.summary && (
            <section className="mb-8 text-center px-8">
              <p className="text-sm leading-relaxed text-slate-600 font-medium">{data.summary}</p>
            </section>
          )}

          <div className="grid grid-cols-[1fr_2fr] gap-10">
            <div>
              {(data.technicalSkills.length > 0 || data.softSkills.length > 0) && (
                <section className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {[...data.technicalSkills, ...data.softSkills].map(s => (
                      <span key={s} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-full shadow-sm">{s}</span>
                    ))}
                  </div>
                </section>
              )}

              {data.education.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-4">Education</h3>
                  <div className="space-y-4">
                    {data.education.map(edu => (
                      <div key={edu.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{edu.degree}</h4>
                        <div className="text-xs text-slate-600">{edu.institution}</div>
                        <div className="text-[10px] text-slate-400 mt-2 font-bold uppercase">{edu.startYear} - {edu.endYear}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div>
              {data.experience.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-600 mb-4">Experience</h3>
                  <div className="space-y-6">
                    {data.experience.map(exp => (
                      <div key={exp.id} className="relative">
                        <h4 className="font-bold text-slate-900 text-lg">{exp.title}</h4>
                        <div className="text-sm font-semibold text-purple-600 mb-2">{exp.company} <span className="text-slate-400 font-medium text-xs ml-2 uppercase tracking-wider">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span></div>
                        <div className="text-[13px] leading-relaxed text-slate-600 whitespace-pre-wrap bg-white">{exp.description}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (template === "scholar") {
    return (
      <div className="p-[15mm] font-serif text-slate-900 bg-white min-h-full">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{data.name || 'YOUR NAME'}</h1>
          <h2 className="text-lg text-slate-700 italic mb-4">{data.role || 'Your Role'}</h2>
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs font-sans text-slate-600">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>| {data.phone}</span>}
            {data.location && <span>| {data.location}</span>}
            {data.linkedin && <span>| {data.linkedin}</span>}
            {data.portfolio && <span>| {data.portfolio}</span>}
          </div>
        </header>

        {data.summary && (
          <section className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-slate-300 pb-1 mb-3 text-center">Profile</h3>
            <p className="text-[14px] leading-relaxed text-justify">{data.summary}</p>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-slate-300 pb-1 mb-3 text-center">Education</h3>
            <div className="space-y-4">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-[15px]">{edu.institution}</h4>
                    <span className="text-[13px] italic text-slate-600">{edu.startYear} - {edu.endYear}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div className="text-[14px]">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-slate-300 pb-1 mb-3 text-center">Academic & Professional Experience</h3>
            <div className="space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-[15px]">{exp.title}</h4>
                    <span className="text-[13px] italic text-slate-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-[14px] italic mb-2">{exp.company}</div>
                  <div className="text-[14px] leading-relaxed whitespace-pre-wrap">{exp.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects.length > 0 && (
          <section className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-slate-300 pb-1 mb-3 text-center">Research & Projects</h3>
            <div className="space-y-4">
              {data.projects.map(p => (
                <div key={p.id}>
                  <h4 className="font-bold text-[15px] mb-1">{p.name}</h4>
                  <p className="text-[14px] leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(data.technicalSkills.length > 0 || data.softSkills.length > 0) && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-slate-300 pb-1 mb-3 text-center">Skills & Competencies</h3>
            <div className="grid grid-cols-2 gap-4 text-[14px] font-sans">
              {data.technicalSkills.length > 0 && (
                <div>
                  <h4 className="font-bold font-serif mb-1">Technical Skills</h4>
                  <p className="text-slate-700">{data.technicalSkills.join(', ')}</p>
                </div>
              )}
              {data.softSkills.length > 0 && (
                <div>
                  <h4 className="font-bold font-serif mb-1">Soft Skills</h4>
                  <p className="text-slate-700">{data.softSkills.join(', ')}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    );
  }

  if (template === "claude") {
    return (
      <div className="p-[15mm] font-sans text-slate-900 bg-white min-h-full leading-[1.65]">
        <header className="mb-6">
          <h1 className="text-[2rem] font-[800] tracking-tight text-[#0F172A] mb-1">{data.name || 'Your Name'}</h1>
          <h2 className="text-[0.7rem] font-[600] text-[#6366F1] uppercase tracking-[0.18em] mb-2">{data.role || 'Professional Title'}</h2>
          <div className="h-[2px] w-full bg-[#0F172A] my-[8px]"></div>
          <div className="flex flex-wrap items-center gap-2 text-[0.65rem] text-[#475569] font-[500]">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>| {data.phone}</span>}
            {data.location && <span>| {data.location}</span>}
            {data.linkedin && <span>| {data.linkedin}</span>}
            {data.portfolio && <span>| {data.portfolio}</span>}
          </div>
        </header>

        {data.summary && (
          <section className="mb-4">
            <p className="text-[0.7rem] italic text-[#374151]">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section className="mb-6">
            <h3 className="text-[0.6rem] font-[700] uppercase tracking-[0.15em] text-[#0F172A] border-b border-[#CBD5E1] pb-[3px] mb-4">Experience</h3>
            <div className="space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-[600] text-[#0F172A] text-[0.75rem]">{exp.title}</h4>
                    <span className="text-[0.65rem] text-[#64748B] float-right flex-end">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="text-[0.7rem] font-[500] text-[#6366F1] mb-1.5">{exp.company}</div>
                  <div className="text-[0.65rem] text-[#374151] whitespace-pre-wrap ml-2">{exp.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8 mb-6">
          {data.education.length > 0 && (
            <section>
              <h3 className="text-[0.6rem] font-[700] uppercase tracking-[0.15em] text-[#0F172A] border-b border-[#CBD5E1] pb-[3px] mb-4">Education</h3>
              <div className="space-y-4">
                {data.education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="font-[600] text-[0.75rem] text-[#0F172A] mb-0.5">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                    <div className="text-[0.7rem] font-[500] text-[#6366F1]">{edu.institution}</div>
                    <div className="text-[0.65rem] text-[#64748B] float-right flex-end mt-1">{edu.startYear} - {edu.endYear}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(data.technicalSkills.length > 0 || data.softSkills.length > 0) && (
            <section>
              <h3 className="text-[0.6rem] font-[700] uppercase tracking-[0.15em] text-[#0F172A] border-b border-[#CBD5E1] pb-[3px] mb-4">Skills</h3>
              <div className="text-[0.65rem] text-[#374151] space-y-2">
                {data.technicalSkills.length > 0 && (
                  <div>Technical: {data.technicalSkills.join(', ')}</div>
                )}
                {data.softSkills.length > 0 && (
                  <div>Professional: {data.softSkills.join(', ')}</div>
                )}
              </div>
            </section>
          )}
        </div>

        {data.projects.length > 0 && (
          <section>
            <h3 className="text-[0.6rem] font-[700] uppercase tracking-[0.15em] text-[#0F172A] border-b border-[#CBD5E1] pb-[3px] mb-4">Projects</h3>
            <div className="space-y-4">
              {data.projects.map(proj => (
                <div key={proj.id}>
                  <div className="text-[0.75rem]">
                    <span className="font-[600] text-[#0F172A]">{proj.name}</span>
                    <span className="text-[#374151]"> - {proj.description}</span>
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="text-[0.65rem] text-[#64748B] mt-1">{proj.techStack.join(', ')}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // default / modern
  return (
    <div className="p-[12mm] font-sans bg-white min-h-full flex flex-col items-center">
      <div className="pb-4 mb-4 border-b-2 border-slate-900 text-center w-full">
         <h1 className="text-4xl font-display font-bold uppercase text-slate-900 tracking-tight leading-none mb-1">
           {data.name || <span className="opacity-20">YOUR NAME</span>}
         </h1>
         <h2 className="text-sm font-bold uppercase text-primary tracking-[0.2em] mb-3">
           {data.role || <span className="opacity-20">YOUR ROLE</span>}
         </h2>
         <div className="flex flex-wrap justify-center items-center gap-2 text-xs font-semibold text-slate-600">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>| {data.phone}</span>}
            {data.location && <span>| {data.location}</span>}
            {data.linkedin && <span>| {data.linkedin}</span>}
            {data.portfolio && <span>| {data.portfolio}</span>}
         </div>
      </div>

      {data.summary && (
        <div className="mb-6 w-full">
           <p className="text-[13px] text-slate-700 leading-relaxed text-justify font-medium">{data.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-6 w-full">
           <div className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">Experience</div>
           <div className="space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id}>
                   <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className="font-bold text-slate-900 text-sm">{exp.title}</h3>
                      <span className="text-xs font-bold text-slate-500 uppercase">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                   </div>
                   <div className="text-[11px] font-bold text-primary uppercase tracking-wide mb-2">{exp.company}</div>
                   <div className="text-[13px] leading-relaxed text-slate-700 whitespace-pre-wrap pl-2 border-l-2 border-slate-100">{exp.description}</div>
                </div>
              ))}
           </div>
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-6 w-full">
           <div className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">Education</div>
           <div className="space-y-3">
              {data.education.map(edu => (
                 <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-0.5">
                       <h3 className="font-bold text-slate-900 text-[13px]">{edu.institution}</h3>
                       <span className="text-xs font-bold text-slate-500 uppercase">{edu.startYear} - {edu.endYear}</span>
                    </div>
                    <div className="text-[11px] font-bold text-primary uppercase tracking-wide">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                 </div>
              ))}
           </div>
        </div>
      )}

      <div className="flex flex-col gap-6 w-full">
        {(data.technicalSkills.length > 0 || data.softSkills.length > 0) && (
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">Skills</div>
            <div className="flex flex-wrap gap-1.5">
               {[...data.technicalSkills, ...data.softSkills].map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">{s}</span>
               ))}
            </div>
          </div>
        )}

        {data.projects.length > 0 && (
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">Projects</div>
            <div className="space-y-4">
              {data.projects.map(p => (
                 <div key={p.id}>
                    <h4 className="font-bold text-slate-900 text-[12px] leading-tight mb-1">{p.name}</h4>
                    <p className="text-[11px] leading-relaxed text-slate-600">{p.description}</p>
                 </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
