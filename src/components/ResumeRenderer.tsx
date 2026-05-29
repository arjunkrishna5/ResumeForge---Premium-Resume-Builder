import { ResumeData } from "../lib/resumeService";

export function ResumeRenderer({ data, template }: { data: ResumeData, template: string }) {
  if (template === "minimal") {
    return (
      <div className="p-[12mm] font-sans text-slate-900 bg-white min-h-full">
        <header className="mb-8 border-b border-slate-300 pb-6">
          <h1 className="text-4xl font-light tracking-tight">{data.name || 'YOUR NAME'}</h1>
          <h2 className="text-xl font-medium text-slate-500 mt-1">{data.role || 'YOUR ROLE'}</h2>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && <span>{data.location}</span>}
            {data.linkedin && <span>{data.linkedin}</span>}
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
          <div className="flex flex-wrap justify-center gap-3 mt-2 text-[11px]">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>| {data.phone}</span>}
            {data.location && <span>| {data.location}</span>}
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
      <div className="flex font-sans text-slate-800 bg-white min-h-[297mm]">
         <aside className="w-[30%] bg-indigo-900 text-white p-8 h-full">
            <h1 className="text-3xl font-display font-bold mb-2 break-words leading-tight">{data.name || 'YOUR NAME'}</h1>
            <h2 className="text-sm font-medium text-indigo-300 uppercase tracking-widest mb-8">{data.role || 'ROLE'}</h2>
            
            <div className="space-y-4 text-xs font-medium text-indigo-100 mb-10">
               {data.email && <div>{data.email}</div>}
               {data.phone && <div>{data.phone}</div>}
               {data.location && <div>{data.location}</div>}
               {data.linkedin && <div className="break-words">{data.linkedin}</div>}
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
         <main className="w-[70%] p-10 bg-white">
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
         <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-semibold uppercase text-slate-600 tracking-wider">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>• {data.phone}</span>}
            {data.location && <span>• {data.location}</span>}
         </div>
         {(data.linkedin || data.portfolio) && (
           <div className="flex justify-center gap-3 text-xs font-semibold text-slate-500 mt-1">
              {data.linkedin && <span>{data.linkedin}</span>}
              {data.portfolio && <span>• {data.portfolio}</span>}
           </div>
         )}
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

      <div className="grid grid-cols-2 gap-6 w-full">
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
