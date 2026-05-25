import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, ChevronRight, User, Briefcase, GraduationCap, 
  Wrench, FolderGit2, FileText, Sparkles, Plus, Edit2, Trash2, X, Loader2
} from "lucide-react";
import { improveJobDescription, suggestSkills, generateSummary } from "../lib/gemini";

interface ResumeData {
  name: string; role: string; email: string; phone: string; location: string; linkedin: string; portfolio: string; summary: string;
  experience: Array<{ id: string; title: string; company: string; startDate: string; endDate: string; current: boolean; description: string; }>;
  education: Array<{ id: string; institution: string; degree: string; field: string; startYear: string; endYear: string; grade: string; }>;
  technicalSkills: string[]; softSkills: string[];
  projects: Array<{ id: string; name: string; description: string; techStack: string[]; liveUrl: string; githubUrl: string; }>;
}

const defaultData: ResumeData = { name: "", role: "", email: "", phone: "", location: "", linkedin: "", portfolio: "", summary: "", experience: [], education: [], technicalSkills: [], softSkills: [], projects: [] };

const steps = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'skills', title: 'Skills', icon: Wrench },
  { id: 'projects', title: 'Projects', icon: FolderGit2 },
  { id: 'summary', title: 'Summary', icon: FileText }
];

function genId() { return Date.now().toString(36) + Math.random().toString(36).substr(2); }

export function BuilderPage() {
  const [formData, setFormData] = useState<ResumeData>(defaultData);
  const [currentStep, setCurrentStep] = useState(0);

  // UI States
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [expForm, setExpForm] = useState({ id: "", title: "", company: "", startDate: "", endDate: "", current: false, description: "" });
  const [isImprovingExp, setIsImprovingExp] = useState(false);

  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [eduForm, setEduForm] = useState({ id: "", institution: "", degree: "", field: "", startYear: "", endYear: "", grade: "" });

  const [techInput, setTechInput] = useState("");
  const [softInput, setSoftInput] = useState("");
  const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);

  const [isAddingProj, setIsAddingProj] = useState(false);
  const [projForm, setProjForm] = useState({ id: "", name: "", description: "", techStackInput: "", techStack: [] as string[], liveUrl: "", githubUrl: "" });

  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleInputChange = (field: keyof ResumeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImproveExp = async () => {
    if (!expForm.description) return;
    setIsImprovingExp(true);
    try {
      const improved = await improveJobDescription(expForm.description);
      setExpForm(prev => ({ ...prev, description: improved }));
    } catch(e) { console.error(e); } finally { setIsImprovingExp(false); }
  };

  const handleSuggestSkills = async () => {
    if (!formData.role) return;
    setIsSuggestingSkills(true);
    try {
      const suggestions = await suggestSkills(formData.role);
      const newTech = suggestions.filter(s => !formData.technicalSkills.includes(s));
      setFormData(prev => ({ ...prev, technicalSkills: [...prev.technicalSkills, ...newTech] }));
    } catch(e) { console.error(e); } finally { setIsSuggestingSkills(false); }
  };

  const handleAutoSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const g = await generateSummary(formData);
      setFormData(prev => ({ ...prev, summary: g }));
    } catch(e) { console.error(e); } finally { setIsGeneratingSummary(false); }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* LEFT PANEL */}
      <div className="w-full md:w-[45%] flex flex-col h-full border-r border-slate-200 bg-white z-10 shadow-xl relative">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <Link to="/dashboard" className="text-slate-500 hover:text-navy transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-navy">Step {currentStep + 1} of {steps.length}</span>
            <div className="flex gap-1.5 ml-4">
              {steps.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all ${i === currentStep ? 'w-6 bg-primary' : i < currentStep ? 'w-2 bg-primary/40' : 'w-2 bg-slate-200'}`} />
              ))}
            </div>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex border-slate-200 text-xs font-bold text-slate-700 h-9">Save Progress</Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              
              <div className="mb-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {(() => { const Icon = steps[currentStep].icon; return <Icon className="h-6 w-6" />; })()}
                </div>
                <h2 className="text-2xl font-display font-bold text-navy mb-2 tracking-tight">{steps[currentStep].title}</h2>
                <p className="text-sm text-slate-500 font-medium">Fill in the details below to build your resume.</p>
              </div>

              {/* STEP 1: PERSONAL */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                      <input type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Jane Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm font-medium transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Target Role</label>
                      <input type="text" value={formData.role} onChange={e => handleInputChange('role', e.target.value)} placeholder="e.g. Software Engineer" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm font-medium transition-all" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
                      <input type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="jane@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm font-medium transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Phone</label>
                      <input type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="(555) 123-4567" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm font-medium transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Location</label>
                    <input type="text" value={formData.location} onChange={e => handleInputChange('location', e.target.value)} placeholder="City, State" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm font-medium transition-all" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">LinkedIn (Optional)</label>
                      <input type="text" value={formData.linkedin} onChange={e => handleInputChange('linkedin', e.target.value)} placeholder="linkedin.com/in/jane" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm font-medium transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Portfolio/Website (Optional)</label>
                      <input type="text" value={formData.portfolio} onChange={e => handleInputChange('portfolio', e.target.value)} placeholder="janedoe.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm font-medium transition-all" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: EXPERIENCE */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {formData.experience.map((exp, idx) => (
                    <div key={exp.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-navy">{exp.title}</h4>
                        <p className="text-sm text-slate-600 font-medium">{exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setFormData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== exp.id) })) }} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                  
                  {isAddingExp ? (
                    <div className="p-5 border border-primary/30 bg-indigo-50/30 rounded-xl space-y-4 animate-in slide-in-from-top-2">
                       <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Job Title</label>
                            <input type="text" value={expForm.title} onChange={e => setExpForm(p => ({...p, title: e.target.value}))} className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Company</label>
                            <input type="text" value={expForm.company} onChange={e => setExpForm(p => ({...p, company: e.target.value}))} className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4 items-end">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Start Date</label>
                            <input type="text" value={expForm.startDate} onChange={e => setExpForm(p => ({...p, startDate: e.target.value}))} placeholder="MM/YYYY" className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">End Date</label>
                            <input type="text" value={expForm.endDate} disabled={expForm.current} onChange={e => setExpForm(p => ({...p, endDate: e.target.value}))} placeholder="MM/YYYY" className={`w-full p-2.5 rounded-lg border border-slate-200 text-sm ${expForm.current ? 'bg-slate-100 text-slate-400' : ''}`} />
                          </div>
                       </div>
                       <label className="flex items-center gap-2 mt-2">
                          <input type="checkbox" checked={expForm.current} onChange={e => setExpForm(p => ({...p, current: e.target.checked}))} className="rounded text-primary focus:ring-primary border-slate-300" />
                          <span className="text-sm font-medium text-slate-600">I currently work here</span>
                       </label>
                       <div>
                          <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                            <button onClick={handleImproveExp} disabled={isImprovingExp || !expForm.description} className="text-[10px] uppercase font-bold tracking-wider text-primary flex items-center gap-1 hover:bg-primary/10 px-2 py-1 rounded disabled:opacity-50 transition-colors">
                              {isImprovingExp ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />} AI Improve
                            </button>
                          </div>
                          <textarea value={expForm.description} onChange={e => setExpForm(p => ({...p, description: e.target.value}))} rows={4} className="w-full p-3 rounded-lg border border-slate-200 text-sm leading-relaxed" placeholder="Describe your achievements..." />
                       </div>
                       <div className="flex justify-end gap-3 pt-2">
                          <Button variant="outline" size="sm" className="bg-white" onClick={() => setIsAddingExp(false)}>Cancel</Button>
                          <Button size="sm" onClick={() => {
                             if(expForm.title && expForm.company) {
                               setFormData(prev => ({ ...prev, experience: [...prev.experience, { ...expForm, id: genId() }] }));
                               setIsAddingExp(false);
                               setExpForm({ id: "", title: "", company: "", startDate: "", endDate: "", current: false, description: "" });
                             }
                          }}>Save Experience</Button>
                       </div>
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full border-dashed border-2 border-slate-200 text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 h-16" onClick={() => setIsAddingExp(true)}>
                       <Plus className="h-5 w-5 mr-2" /> Add Professional Experience
                    </Button>
                  )}
                </div>
              )}

              {/* STEP 3: EDUCATION */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {formData.education.map((edu) => (
                    <div key={edu.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-navy">{edu.institution}</h4>
                        <p className="text-sm text-slate-600 font-medium">{edu.degree} in {edu.field} • {edu.startYear} - {edu.endYear}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setFormData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) })) }} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                  
                  {isAddingEdu ? (
                    <div className="p-5 border border-primary/30 bg-indigo-50/30 rounded-xl space-y-4 animate-in slide-in-from-top-2">
                       <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Institution Name</label>
                            <input type="text" value={eduForm.institution} onChange={e => setEduForm(p => ({...p, institution: e.target.value}))} className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Degree</label>
                              <input type="text" value={eduForm.degree} onChange={e => setEduForm(p => ({...p, degree: e.target.value}))} placeholder="e.g. B.S." className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Field of Study</label>
                              <input type="text" value={eduForm.field} onChange={e => setEduForm(p => ({...p, field: e.target.value}))} className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Start Year</label>
                              <input type="text" value={eduForm.startYear} onChange={e => setEduForm(p => ({...p, startYear: e.target.value}))} className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">End Year</label>
                              <input type="text" value={eduForm.endYear} onChange={e => setEduForm(p => ({...p, endYear: e.target.value}))} className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">GPA (Optional)</label>
                              <input type="text" value={eduForm.grade} onChange={e => setEduForm(p => ({...p, grade: e.target.value}))} className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" />
                            </div>
                          </div>
                       </div>
                       <div className="flex justify-end gap-3 pt-2">
                          <Button variant="outline" size="sm" className="bg-white" onClick={() => setIsAddingEdu(false)}>Cancel</Button>
                          <Button size="sm" onClick={() => {
                             if(eduForm.institution) {
                               setFormData(prev => ({ ...prev, education: [...prev.education, { ...eduForm, id: genId() }] }));
                               setIsAddingEdu(false);
                               setEduForm({ id: "", institution: "", degree: "", field: "", startYear: "", endYear: "", grade: "" });
                             }
                          }}>Save Education</Button>
                       </div>
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full border-dashed border-2 border-slate-200 text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 h-16" onClick={() => setIsAddingEdu(true)}>
                       <Plus className="h-5 w-5 mr-2" /> Add Education
                    </Button>
                  )}
                </div>
              )}

              {/* STEP 4: SKILLS */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="p-5 border border-primary/20 bg-primary/5 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left justify-between">
                     <div>
                       <h3 className="font-bold text-navy text-sm mb-1">Let AI suggest skills</h3>
                       <p className="text-xs text-slate-600 font-medium">Based on your target role: <span className="font-bold text-primary">{formData.role || 'Not set'}</span></p>
                     </div>
                     <Button size="sm" onClick={handleSuggestSkills} disabled={!formData.role || isSuggestingSkills} className="shrink-0 flex items-center gap-2">
                       {isSuggestingSkills ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} {isSuggestingSkills ? 'Thinking...' : 'AI Suggest'}
                     </Button>
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Technical Skills</label>
                     <div className="flex flex-wrap gap-2 mb-3">
                       {formData.technicalSkills.map((skill, i) => (
                         <div key={i} className="bg-indigo-50 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">
                           {skill} <button onClick={() => setFormData(p => ({...p, technicalSkills: p.technicalSkills.filter(s => s !== skill)}))}><X className="h-3 w-3 hover:text-red-500 transition-colors" /></button>
                         </div>
                       ))}
                     </div>
                     <input 
                       type="text" 
                       value={techInput}
                       onChange={e => setTechInput(e.target.value)}
                       placeholder="Type skill & press Enter..."
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm transition-all"
                       onKeyDown={e => {
                         if(e.key === 'Enter' || e.key === ',') {
                           e.preventDefault();
                           const val = techInput.trim();
                           if(val && !formData.technicalSkills.includes(val)) setFormData(p => ({...p, technicalSkills: [...p.technicalSkills, val]}));
                           setTechInput("");
                         }
                       }}
                     />
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Soft Skills</label>
                     <div className="flex flex-wrap gap-2 mb-3">
                       {formData.softSkills.map((skill, i) => (
                         <div key={i} className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">
                           {skill} <button onClick={() => setFormData(p => ({...p, softSkills: p.softSkills.filter(s => s !== skill)}))}><X className="h-3 w-3 hover:text-red-500 transition-colors" /></button>
                         </div>
                       ))}
                     </div>
                     <input 
                       type="text" 
                       value={softInput}
                       onChange={e => setSoftInput(e.target.value)}
                       placeholder="Type skill & press Enter..."
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm transition-all"
                       onKeyDown={e => {
                         if(e.key === 'Enter' || e.key === ',') {
                           e.preventDefault();
                           const val = softInput.trim();
                           if(val && !formData.softSkills.includes(val)) setFormData(p => ({...p, softSkills: [...p.softSkills, val]}));
                           setSoftInput("");
                         }
                       }}
                     />
                  </div>
                </div>
              )}

              {/* STEP 5: PROJECTS */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  {formData.projects.map((proj) => (
                    <div key={proj.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col gap-2 relative">
                      <button onClick={() => { setFormData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== proj.id) })) }} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50"><Trash2 className="h-4 w-4" /></button>
                      <h4 className="font-bold text-navy pr-8">{proj.name}</h4>
                      <p className="text-sm text-slate-600 font-medium">{proj.description}</p>
                      <div className="flex gap-2 flex-wrap mt-1">
                        {proj.techStack.map(t => <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{t}</span>)}
                      </div>
                    </div>
                  ))}
                  
                  {isAddingProj ? (
                    <div className="p-5 border border-primary/30 bg-indigo-50/30 rounded-xl space-y-4 animate-in slide-in-from-top-2">
                       <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Project Name</label>
                            <input type="text" value={projForm.name} onChange={e => setProjForm(p => ({...p, name: e.target.value}))} className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
                            <textarea value={projForm.description} onChange={e => setProjForm(p => ({...p, description: e.target.value}))} rows={3} className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" />
                          </div>
                          <div>
                             <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Tech Stack (comma separated)</label>
                             <input type="text" value={projForm.techStackInput} onChange={e => setProjForm(p => ({...p, techStackInput: e.target.value}))} className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" placeholder="React, Node.js, Tailwind" />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Live URL</label>
                              <input type="text" value={projForm.liveUrl} onChange={e => setProjForm(p => ({...p, liveUrl: e.target.value}))} className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">GitHub URL</label>
                              <input type="text" value={projForm.githubUrl} onChange={e => setProjForm(p => ({...p, githubUrl: e.target.value}))} className="w-full p-2.5 rounded-lg border border-slate-200 text-sm" />
                            </div>
                          </div>
                       </div>
                       <div className="flex justify-end gap-3 pt-2">
                          <Button variant="outline" size="sm" className="bg-white" onClick={() => setIsAddingProj(false)}>Cancel</Button>
                          <Button size="sm" onClick={() => {
                             if(projForm.name) {
                               const tags = projForm.techStackInput.split(',').map(s=>s.trim()).filter(Boolean);
                               setFormData(prev => ({ ...prev, projects: [...prev.projects, { ...projForm, id: genId(), techStack: tags }] }));
                               setIsAddingProj(false);
                               setProjForm({ id: "", name: "", description: "", techStackInput: "", techStack: [], liveUrl: "", githubUrl: "" });
                             }
                          }}>Save Project</Button>
                       </div>
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full border-dashed border-2 border-slate-200 text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 h-16" onClick={() => setIsAddingProj(true)}>
                       <Plus className="h-5 w-5 mr-2" /> Add Project
                    </Button>
                  )}
                </div>
              )}

              {/* STEP 6: SUMMARY */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="p-5 border border-primary/20 bg-primary/5 rounded-2xl flex flex-col items-start gap-4">
                     <div>
                       <h3 className="font-bold text-navy text-sm mb-1">Writer's block?</h3>
                       <p className="text-xs text-slate-600 font-medium">We can write a tailored summary using all the data you just provided.</p>
                     </div>
                     <Button size="sm" onClick={handleAutoSummary} disabled={isGeneratingSummary} className="w-full shrink-0 flex items-center justify-center gap-2">
                       {isGeneratingSummary ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} {isGeneratingSummary ? 'Writing Magic...' : 'AI Auto-Write Summary'}
                     </Button>
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Professional Summary</label>
                     <textarea 
                       value={formData.summary}
                       onChange={e => handleInputChange('summary', e.target.value)}
                       className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm leading-relaxed" 
                       rows={7} 
                       placeholder="Senior software engineer with 5+ years of experience..."
                     />
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Nav */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <Button variant="outline" onClick={() => setCurrentStep(p => p - 1)} disabled={currentStep === 0} className="border-slate-200 px-6 font-bold text-slate-600"><ChevronLeft className="h-4 w-4 mr-2" /> Back</Button>
          {currentStep === steps.length - 1 ? (
             <Link to="/templates"><Button className="px-6 font-bold shadow-[0_4px_12px_rgba(99,102,241,0.2)]"><Sparkles className="h-4 w-4 mr-2" /> Finish</Button></Link>
          ) : (
             <Button onClick={() => setCurrentStep(p => p + 1)} className="px-6 font-bold shadow-[0_4px_12px_rgba(99,102,241,0.2)]">Next Step <ChevronRight className="h-4 w-4 ml-2" /></Button>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Live Preview */}
      <div className="hidden md:flex flex-1 relative items-center justify-center overflow-hidden bg-slate-200/50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
         <div className="mx-auto bg-white shadow-2xl shadow-slate-300 w-[210mm] min-h-[297mm] h-[297mm] transform-gpu transition-all origin-top scale-[0.6] lg:scale-[0.75] xl:scale-[0.85] p-12 overflow-hidden pointer-events-none mt-16 md:mt-0 relative flex flex-col">
            
            {/* Template Rendering Area */}
            {!formData.name && !formData.role && formData.experience.length === 0 ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                  <FileText className="h-24 w-24 mb-4 text-slate-300" />
                  <p className="font-bold text-xl uppercase tracking-widest text-slate-400">Start filling the form</p>
               </div>
            ) : (
               <>
                 {/* Header */}
                 <div className="pb-4 mb-4 border-b-2 border-slate-900 text-center flex flex-col items-center">
                    <h1 className="text-4xl font-display font-bold uppercase text-slate-900 tracking-tight leading-none mb-1">
                      {formData.name || <span className="opacity-20">Full Name</span>}
                    </h1>
                    <h2 className="text-sm font-bold uppercase text-primary tracking-[0.2em] mb-3">
                      {formData.role || <span className="opacity-20">Target Role</span>}
                    </h2>
                    <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-semibold uppercase text-slate-600 tracking-wider">
                       {formData.email && <span>{formData.email}</span>}
                       {formData.phone && <span>• {formData.phone}</span>}
                       {formData.location && <span>• {formData.location}</span>}
                    </div>
                    {(formData.linkedin || formData.portfolio) && (
                      <div className="flex justify-center gap-3 text-xs font-semibold text-slate-500 mt-1">
                         {formData.linkedin && <span>{formData.linkedin}</span>}
                         {formData.portfolio && <span>• {formData.portfolio}</span>}
                      </div>
                    )}
                 </div>

                 {/* Summary */}
                 {formData.summary && (
                   <div className="mb-6">
                      <p className="text-sm text-slate-700 leading-relaxed text-justify font-medium">{formData.summary}</p>
                   </div>
                 )}

                 {/* Experience */}
                 {formData.experience.length > 0 && (
                   <div className="mb-6">
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">Experience</div>
                      <div className="space-y-4">
                         {formData.experience.map(exp => (
                           <div key={exp.id}>
                              <div className="flex justify-between items-baseline mb-0.5">
                                 <h3 className="font-bold text-slate-900 text-sm">{exp.title}</h3>
                                 <span className="text-xs font-bold text-slate-500 uppercase">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                              </div>
                              <div className="text-xs font-bold text-primary uppercase tracking-wide mb-2">{exp.company}</div>
                              {exp.description && (
                                <div className="text-sm text-slate-700 leading-relaxed">
                                   {exp.description.split('\n').map((line, i) => <p key={i} className="mb-1 text-justify">{line}</p>)}
                                </div>
                              )}
                           </div>
                         ))}
                      </div>
                   </div>
                 )}

                 {/* Skills */}
                 {(formData.technicalSkills.length > 0 || formData.softSkills.length > 0) && (
                    <div className="mb-6">
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">Skills</div>
                      <div className="flex flex-wrap gap-1.5">
                         {formData.technicalSkills.map((skill, i) => (
                           <span key={`t-${i}`} className="px-2 py-1 bg-slate-100 text-slate-700 font-bold text-[10px] uppercase rounded">{skill}</span>
                         ))}
                         {formData.softSkills.map((skill, i) => (
                           <span key={`s-${i}`} className="px-2 py-1 border border-slate-200 text-slate-600 font-bold text-[10px] uppercase rounded">{skill}</span>
                         ))}
                      </div>
                    </div>
                 )}

                 {/* Education */}
                 {formData.education.length > 0 && (
                    <div className="mb-6">
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">Education</div>
                      <div className="space-y-3">
                         {formData.education.map(edu => (
                           <div key={edu.id} className="flex justify-between items-baseline">
                              <div>
                                 <div className="font-bold text-slate-900 text-sm">{edu.institution}</div>
                                 <div className="text-xs text-slate-600 font-medium">{edu.degree} in {edu.field} {edu.grade && `• GPA: ${edu.grade}`}</div>
                              </div>
                              <div className="text-xs font-bold text-slate-500 uppercase">{edu.startYear} - {edu.endYear}</div>
                           </div>
                         ))}
                      </div>
                    </div>
                 )}

                 {/* Projects */}
                 {formData.projects.length > 0 && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-1 mb-3">Projects</div>
                      <div className="space-y-4">
                         {formData.projects.map(proj => (
                           <div key={proj.id}>
                              <div className="flex justify-between items-baseline mb-1">
                                 <h3 className="font-bold text-sm text-slate-900">{proj.name}</h3>
                                 <div className="flex gap-2 text-[10px] text-slate-500 font-bold uppercase">
                                   {proj.liveUrl && <span>LIVE ↗</span>}
                                   {proj.githubUrl && <span>GITHUB ↗</span>}
                                 </div>
                              </div>
                              <div className="text-sm text-slate-700 leading-relaxed text-justify mb-1">{proj.description}</div>
                              <div className="flex flex-wrap gap-1">
                                 {proj.techStack.map(t => <span key={t} className="text-[10px] font-bold text-primary uppercase">{t}</span>)}
                              </div>
                           </div>
                         ))}
                      </div>
                    </div>
                 )}
               </>
            )}
            
         </div>
      </div>
    </div>
  );
}
