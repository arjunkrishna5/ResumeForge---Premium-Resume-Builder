import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  User, Briefcase, GraduationCap, Code, Rocket, AlignLeft,
  ChevronLeft, ChevronRight, X, Plus, Sparkles, Loader2, Check, FileText, FileSignature, Trash2, Eye, Info, Edit3
} from "lucide-react";
import { UserTypeSelector } from "../components/UserTypeSelector";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "motion/react";
import { improveJobDescription, suggestSkills, generateSummary, generateCoverLetter } from "../lib/gemini";
import { Analytics } from "../lib/analytics";
import { AuthContext } from "../contexts/AuthContext";
import { getResume, saveResume, getUserResumes, ResumeData, defaultResumeData } from "../lib/resumeService";
import { ResumeRenderer } from "../components/ResumeRenderer";
import { templates } from "../data/templates";

const genId = () => Math.random().toString(36).substring(7);

const getActiveSteps = (userType: 'student' | 'professional' | null | undefined) => {
  if (userType === 'student') {
    return [
      { id: 'personal', title: "Personal Details", icon: User },
      { id: 'education', title: "Education", icon: GraduationCap },
      { id: 'experience', title: "Experience", icon: Briefcase },
      { id: 'projects', title: "Projects", icon: Rocket },
      { id: 'skills', title: "Skills", icon: Code },
      { id: 'summary', title: "Summary", icon: AlignLeft },
      { id: 'cover', title: "Cover Letter", icon: FileSignature }
    ];
  }
  return [
    { id: 'personal', title: "Personal Details", icon: User },
    { id: 'experience', title: "Experience", icon: Briefcase },
    { id: 'education', title: "Education", icon: GraduationCap },
    { id: 'skills', title: "Skills", icon: Code },
    { id: 'projects', title: "Projects", icon: Rocket },
    { id: 'summary', title: "Summary", icon: AlignLeft },
    { id: 'cover', title: "Cover Letter", icon: FileSignature }
  ];
};

export function BuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  const [formData, setRawFormData] = useState<ResumeData>(defaultResumeData);
  const hasUserEdited = useRef(false);
  const setFormData = useCallback((value: React.SetStateAction<ResumeData>) => {
    hasUserEdited.current = true;
    setRawFormData(value);
  }, []);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(id || null);

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);
  
  // Read template from router state or default to "modern"
  const templateFromState = (location.state as any)?.templateId || "modern";
  const [selectedTemplate, setSelectedTemplate] = useState(templateFromState);
  const [previewTab, setPreviewTab] = useState<"resume" | "cover">("resume");
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const mobilePreviewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [mobilePreviewScale, setMobilePreviewScale] = useState(0.8);

  // ResizeObserver for dynamic scaling (Desktop)
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { height, width } = entry.contentRect;
        // A4 physical pixels assuming 96dpi is roughly 794x1123
        const docHeight = 1123; 
        const docWidth = 794;
        
        // Fit to 85% of container height or 90% of width, whichever is smaller
        const scaleHeight = (height * 0.85) / docHeight;
        const scaleWidth = (width * 0.90) / docWidth;
        setPreviewScale(Math.min(scaleHeight, scaleWidth));
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [mobilePreviewOpen]); // re-run if modal opens

  // ResizeObserver for dynamic scaling (Mobile)
  useEffect(() => {
    const container = mobilePreviewContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { height, width } = entry.contentRect;
        const docHeight = 1123; 
        const docWidth = 794;
        
        const scaleHeight = (height * 0.85) / docHeight;
        const scaleWidth = (width * 0.90) / docWidth;
        setMobilePreviewScale(Math.min(scaleHeight, scaleWidth));
      }
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [mobilePreviewOpen]);

  // Date mask function: forces MM/YYYY format
  const maskDate = (value: string): string => {
    // Remove everything that's not a digit
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 2) {
      return digits;
    }
    
    // Clamp month to 01-12
    let month = digits.slice(0, 2);
    const monthNum = parseInt(month);
    if (monthNum > 12) month = '12';
    if (monthNum === 0) month = '01';
    
    const year = digits.slice(2, 6);
    return `${month}/${year}`;
  };

  const maskYear = (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 4);
  };

  // Load existing resume or handle imported Data
  useEffect(() => {
    async function loadData() {
      // Check importedData first
      if (location.state?.importedData) {
        setRawFormData(location.state.importedData);
        window.history.replaceState({}, document.title);
        isInitialLoadRef.current = false;
        return;
      }
      
      if (!currentUser || !id) {
        isInitialLoadRef.current = false;
        return;
      }
      try {
        const doc = await getResume(currentUser.uid, id);
        if (doc) {
          setRawFormData(doc.data);
          setCurrentResumeId(doc.id);
          if (doc.templateId) {
             setSelectedTemplate(doc.templateId);
          }
        } else {
          setCurrentResumeId(null);
          navigate('/builder', { replace: true });
        }
      } catch (err) {
        console.error("Failed to load resume", err);
      } finally {
        setTimeout(() => {
          isInitialLoadRef.current = false;
        }, 50);
      }
    }
    loadData();
  }, [id, currentUser, navigate, location.state]);

  // Auto-save effect
  useEffect(() => {
    // Never save on initial mount
    if (!hasUserEdited.current) return;
    // Never save if no user
    if (!currentUser) return;
    
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        const savedId = await saveResume(
          currentUser.uid,
          currentResumeId || null,
          formData,
          selectedTemplate
        );
        if (!currentResumeId) {
          setCurrentResumeId(savedId);
          // Update URL to include new ID without triggering a re-render
          window.history.replaceState(
            null, '', `/builder/${savedId}`
          );
        }
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (err) {
        console.error('Failed to auto-save', err);
        setSaveStatus('error');
      }
    }, 3000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, selectedTemplate, currentUser, currentResumeId]);



  const manuallySaveAndFinish = async () => {
    if (!currentUser) return;
    try {
      setSaveStatus("saving");
      const savedId = await saveResume(currentUser.uid, currentResumeId, formData, selectedTemplate);
      Analytics.resumeCreated(selectedTemplate, formData.userType || "professional");
      navigate(`/preview/${savedId || currentResumeId}`);
    } catch (e) {
      console.error(e);
      showError("Failed to save and finish.");
    }
  };

  const handleSkipToDownload = async () => {
    if (!currentUser) return;
    setSaveStatus("saving");
    try {
      const savedId = await saveResume(
        currentUser.uid,
        currentResumeId || null,
        formData,
        selectedTemplate
      );
      navigate(`/preview/${savedId}`);
    } catch (err) {
      console.error('Save failed:', err);
      showError('Failed to save. Please try again.');
      setSaveStatus("error");
    }
  };

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
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  
  const [atsScore, setAtsScore] = useState<{
    score: number;
    grade: string;
    issues: string[];
    suggestions: string[];
  } | null>(null);
  const [isCalculatingATS, setIsCalculatingATS] = useState(false);

  const hasCalculatedATS = useRef(false);

  // Reset ATS score flag on significant changes
  useEffect(() => {
    hasCalculatedATS.current = false;
  }, [
    formData.name,
    formData.role,
    formData.experience.length,
    formData.education.length,
    formData.technicalSkills.length,
    formData.projects.length,
    formData.summary
  ]);

  const formDataRef = useRef(formData);
  useEffect(() => { formDataRef.current = formData; }, [formData]);

  const handleCalculateATS = useCallback(async () => {
    const data = formDataRef.current;
    setIsCalculatingATS(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculateATSScore',
          ...data
        })
      });
      const result = await res.json();
      if (result.atsData) setAtsScore(result.atsData);
    } catch (err) {
      console.error('ATS calculation failed:', err);
    } finally {
      setIsCalculatingATS(false);
    }
  }, []);

  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const [lastInProgressResume, setLastInProgressResume] = useState<any>(null);

  const formatRelativeTime = (timestamp: any) => {
    if (!timestamp) return 'recently';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diff = (new Date().getTime() - date.getTime()) / 1000;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return 'Yesterday';
  };

  useEffect(() => {
    if (!currentUser || currentResumeId) return;
    
    const checkLastResume = async () => {
      try {
        const resumes = await getUserResumes(currentUser.uid);
        const lastResume = resumes[0];
        
        if (lastResume && lastResume.completion < 100) {
          setLastInProgressResume(lastResume);
          setShowContinuePrompt(true);
        }
      } catch (err) {
        console.error('Could not check last resume:', err);
      }
    };
    
    checkLastResume();
  }, [currentUser, currentResumeId]);

  // Recalculate ATS score when advancing to the last step (Step 6 or 7)
  useEffect(() => {
    if ((currentStep === 5 || currentStep === 6) && formDataRef.current.name && !hasCalculatedATS.current) {
       hasCalculatedATS.current = true;
       handleCalculateATS();
    }
  }, [currentStep, handleCalculateATS]);

  const [errorMsg, setErrorMsg] = useState("");

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 5000);
  };

  const handleInputChange = (field: keyof ResumeData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImproveExp = async () => {
    if (!expForm.description) return;
    setIsImprovingExp(true);
    try {
      const improved = await improveJobDescription(expForm.description);
      setExpForm(prev => ({ ...prev, description: improved }));
    Analytics.aiFeatureUsed("improve_exp");
    } catch(err: any) { console.error('AI call failed:', err); showError(String(err)); } finally { setIsImprovingExp(false); }
  };

  const handleSuggestSkills = async () => {
    if (!formData.role) return;
    setIsSuggestingSkills(true);
    try {
      const newTech = await suggestSkills(formData.role);
      setFormData(prev => ({ ...prev, technicalSkills: [...prev.technicalSkills, ...newTech] }));
    Analytics.aiFeatureUsed("suggest_skills");
    } catch(err: any) { console.error('AI call failed:', err); showError(String(err)); } finally { setIsSuggestingSkills(false); }
  };

  const handleAutoSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const g = await generateSummary(formData);
      setFormData(prev => ({ ...prev, summary: g }));
    Analytics.aiFeatureUsed("auto_summary");
    } catch(err: any) { console.error('AI call failed:', err); showError(String(err)); } finally { setIsGeneratingSummary(false); }
  };
  
  const handleAutoCoverLetter = async () => {
    if (!formData.coverLetterInfo?.jobTitle || !formData.coverLetterInfo?.company) {
       showError("Please provide job title and company to generate cover letter.");
       return;
    }
    setIsGeneratingCoverLetter(true);
    try {
      const g = await generateCoverLetter({
         name: formData.name,
         jobTitle: formData.coverLetterInfo.jobTitle,
         company: formData.coverLetterInfo.company,
         tone: formData.coverLetterInfo.tone || "Professional",
         summary: formData.summary,
         skills: formData.technicalSkills
      });
      setFormData(prev => ({ ...prev, coverLetter: g }));
      setPreviewTab("cover");
    Analytics.aiFeatureUsed("auto_cover_letter");
    } catch(err: any) { console.error('AI call failed:', err); showError(String(err)); } finally { setIsGeneratingCoverLetter(false); }
  };

  const activeSteps = getActiveSteps(formData.userType);
  const currentStepId = activeSteps[currentStep]?.id || 'personal';

  if (!formData.userType) {
    return <UserTypeSelector onSelect={(type) => setFormData(prev => ({ ...prev, userType: type }))} />;
  }

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans relative overflow-hidden">
      {/* LEFT PANEL: Form */}
      <div className="w-full md:w-[45%] bg-white border-r border-slate-200 flex flex-col h-screen shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 shrink-0 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-display font-bold text-navy tracking-tight flex items-center">
              <div className="h-8 w-8 bg-primary text-white rounded-lg flex items-center justify-center mr-3 font-display font-bold">R</div>
              ResumeForge
            </h1>
            <div className="flex gap-1">
              {activeSteps.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all ${i === currentStep ? 'w-6 bg-primary' : i < currentStep ? 'w-2 bg-primary/40' : 'w-2 bg-slate-200'}`} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
             {saveStatus === "saving" && <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin"/> Saving...</span>}
             {saveStatus === "saved" && <span className="text-xs font-bold text-emerald-500 flex items-center gap-1"><Check className="h-3 w-3"/> Saved</span>}
          </div>
        </div>

        
        {/* Continue Banner */}
        {showContinuePrompt && lastInProgressResume && (
          <div className="mx-6 mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-navy">
                Continue where you left off?
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                "{lastInProgressResume.title}" — 
                last edited {formatRelativeTime(
                  lastInProgressResume.updatedAt
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setShowContinuePrompt(false);
                  setLastInProgressResume(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5"
              >
                Start fresh
              </button>
              <button 
                onClick={() => {
                  navigate(`/builder/${lastInProgressResume.id}`);
                }}
                className="text-xs font-semibold text-white bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              
              <div className="mb-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {(() => { const Icon = activeSteps[currentStep].icon; return <Icon className="h-6 w-6" />; })()}
                </div>
                <div className="flex items-center mb-2">
                  <h2 className="text-2xl font-display font-bold text-navy tracking-tight">{activeSteps[currentStep].title}</h2>
                  {currentStepId === 'cover' && (
                    <div className="ml-3 flex items-center relative group">
                      <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full mr-2 tracking-wider">OPTIONAL</span>
                      <Info className="h-4 w-4 text-slate-400 cursor-help" />
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[9999] shadow-xl pointer-events-none">
                        A cover letter is a short letter sent with your resume when applying for a job. It introduces you, explains why you want the role, and highlights why you're a great fit. A strong cover letter can significantly improve your chances of getting an interview.
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full border-4 border-transparent border-b-slate-800"></div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-500 font-medium">{currentStepId === 'cover' ? "Generate a tailored cover letter to accompany your resume." : "Fill in the details below to build your resume."}</p>
              </div>

              {/* STEP 1: PERSONAL */}
              {currentStepId === 'personal' && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                      <input type="text" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Jane Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm font-medium transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">
                        {formData.userType === 'student' ? 'Target Role / Internship (Optional)' : 'Target Role'}
                      </label>
                      <input type="text" value={formData.role} onChange={e => handleInputChange('role', e.target.value)} placeholder={formData.userType === 'student' ? "e.g. Software Engineering Intern" : "e.g. Software Engineer"} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm font-medium transition-all" />
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
              {currentStepId === 'experience' && (
                <div className="space-y-4">
                  {formData.experience.map((exp) => (
                    <div key={exp.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-navy">{exp.title}</h4>
                        <p className="text-sm text-slate-600 font-medium">{exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setExpForm(exp); setIsAddingExp(true); }} className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-50"><Edit3 className="h-4 w-4" /></button>
                        <button onClick={() => { setFormData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== exp.id) })) }} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                  
                  {isAddingExp ? (
                    <div className="p-5 border border-primary/30 bg-indigo-50/30 rounded-xl space-y-4 animate-in slide-in-from-top-2">
                       <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Job Title</label>
                            <input type="text" value={expForm.title} onChange={e => setExpForm(p => ({...p, title: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Company</label>
                            <input type="text" value={expForm.company} onChange={e => setExpForm(p => ({...p, company: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Start Date</label>
                            <input type="text" placeholder="MM/YYYY" maxLength={7} value={expForm.startDate} onChange={e => setExpForm(p => ({...p, startDate: maskDate(e.target.value)}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                          </div>
                          <div>
                             <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">End Date</label>
                             <input type="text" placeholder="MM/YYYY" maxLength={7} value={expForm.endDate} disabled={expForm.current} onChange={e => setExpForm(p => ({...p, endDate: maskDate(e.target.value)}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm disabled:opacity-50 disabled:bg-slate-100" />
                          </div>
                       </div>
                       <div className="flex items-center gap-2 mt-2">
                          <input type="checkbox" id="currentRole" checked={expForm.current} onChange={e => setExpForm(p => ({...p, current: e.target.checked, endDate: e.target.checked ? "" : p.endDate}))} className="rounded text-primary focus:ring-primary/20 h-4 w-4" />
                          <label htmlFor="currentRole" className="text-xs font-bold text-slate-600">I currently work here</label>
                       </div>
                       <div className="mt-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
                            <button type="button" onClick={handleImproveExp} disabled={isImprovingExp || !expForm.description} className="text-xs font-bold text-primary flex items-center hover:text-[#4F46E5] disabled:opacity-50">
                              {isImprovingExp ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Sparkles className="h-3 w-3 mr-1" />} AI Improve
                            </button>
                          </div>
                          <textarea value={expForm.description} onChange={e => setExpForm(p => ({...p, description: e.target.value}))} rows={4} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" placeholder="- Developed web application using..." />
                       </div>
                       <div className="flex gap-2 justify-end pt-2">
                         <Button variant="outline" onClick={() => setIsAddingExp(false)} className="text-slate-500 border-slate-200">Cancel</Button>
                         <Button onClick={() => {
                            if(expForm.title && expForm.company) {
                               setFormData(prev => {
                                 if (expForm.id) {
                                   return { ...prev, experience: prev.experience.map(e => e.id === expForm.id ? expForm : e) };
                                 }
                                 return { ...prev, experience: [...prev.experience, { ...expForm, id: genId() }] };
                               });
                               setIsAddingExp(false);
                               setExpForm({ id: "", title: "", company: "", startDate: "", endDate: "", current: false, description: "" });
                            }
                         }}>Save Experience</Button>
                       </div>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => setIsAddingExp(true)} className="w-full border-dashed border-2 border-slate-200 text-primary py-8 hover:bg-primary/5 hover:border-primary/30">
                      <Plus className="h-5 w-5 mr-2" /> Add Experience
                    </Button>
                  )}
                </div>
              )}

              {/* STEP 3: EDUCATION */}
              {currentStepId === 'education' && (
                <div className="space-y-4">
                  {formData.education.map((edu) => (
                    <div key={edu.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-navy">{edu.institution}</h4>
                        <p className="text-sm text-slate-600 font-medium">{edu.degree} in {edu.field}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEduForm(edu); setIsAddingEdu(true); }} className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-50"><Edit3 className="h-4 w-4" /></button>
                        <button onClick={() => { setFormData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) })) }} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}

                  {isAddingEdu ? (
                    <div className="p-5 border border-primary/30 bg-indigo-50/30 rounded-xl space-y-4 animate-in slide-in-from-top-2">
                       <div className="grid sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Institution Name</label>
                            <input type="text" value={eduForm.institution} onChange={e => setEduForm(p => ({...p, institution: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Degree</label>
                            <input type="text" placeholder="B.S." value={eduForm.degree} onChange={e => setEduForm(p => ({...p, degree: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Field of Study</label>
                            <input type="text" placeholder="Computer Science" value={eduForm.field} onChange={e => setEduForm(p => ({...p, field: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Start Year</label>
                            <input type="text" placeholder="YYYY" maxLength={4} value={eduForm.startYear} onChange={e => setEduForm(p => ({...p, startYear: maskYear(e.target.value)}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">End Year</label>
                            <input type="text" placeholder="YYYY" maxLength={4} value={eduForm.endYear} onChange={e => setEduForm(p => ({...p, endYear: maskYear(e.target.value)}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Grade / GPA (Optional)</label>
                            <input type="text" placeholder="3.8/4.0" value={eduForm.grade} onChange={e => setEduForm(p => ({...p, grade: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                          </div>
                       </div>
                       <div className="flex gap-2 justify-end pt-2">
                         <Button variant="outline" onClick={() => setIsAddingEdu(false)} className="text-slate-500 border-slate-200">Cancel</Button>
                         <Button onClick={() => {
                            if(eduForm.institution) {
                               setFormData(prev => {
                                 if (eduForm.id) {
                                   return { ...prev, education: prev.education.map(e => e.id === eduForm.id ? eduForm : e) };
                                 }
                                 return { ...prev, education: [...prev.education, { ...eduForm, id: genId() }] };
                               });
                               setIsAddingEdu(false);
                               setEduForm({ id: "", institution: "", degree: "", field: "", startYear: "", endYear: "", grade: "" });
                            }
                         }}>Save</Button>
                       </div>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => setIsAddingEdu(true)} className="w-full border-dashed border-2 border-slate-200 text-primary py-8 hover:bg-primary/5 hover:border-primary/30">
                      <Plus className="h-5 w-5 mr-2" /> Add Education
                    </Button>
                  )}
                </div>
              )}

              {/* STEP 4: SKILLS */}
              {currentStepId === 'skills' && (
                <div className="space-y-8">
                  <div className="flex flex-col gap-4">
                     <div className="flex items-end justify-between">
                       <div>
                          <h3 className="font-bold text-navy text-sm mb-1">AI Skill Suggestions</h3>
                          <p className="text-xs text-slate-600 font-medium">Get suggestions based on your target role: <strong className="text-primary">{formData.role || 'Not specified'}</strong></p>
                       </div>
                       <Button type="button" size="sm" onClick={handleSuggestSkills} disabled={!formData.role || isSuggestingSkills} className="shrink-0">
                         {isSuggestingSkills ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />} Suggest
                       </Button>
                     </div>
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Technical Skills</label>
                     <div className="flex flex-wrap gap-2 mb-3">
                        {formData.technicalSkills.map(skill => (
                          <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 group">
                           {skill} <button onClick={() => setFormData(p => ({...p, technicalSkills: p.technicalSkills.filter(s => s !== skill)}))}><X className="h-3 w-3 hover:text-red-500 transition-colors" /></button>
                          </span>
                        ))}
                     </div>
                     <div className="flex gap-2">
                        <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => {
                           if(e.key === 'Enter') {
                              e.preventDefault();
                              const val = techInput.trim();
                              if(val && !formData.technicalSkills.includes(val)) setFormData(p => ({...p, technicalSkills: [...p.technicalSkills, val]}));
                              setTechInput("");
                           }
                        }} placeholder="e.g. React" className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm transition-all" />
                        <Button variant="outline" onClick={() => {
                           const val = techInput.trim();
                           if(val && !formData.technicalSkills.includes(val)) setFormData(p => ({...p, technicalSkills: [...p.technicalSkills, val]}));
                           setTechInput("");
                        }} className="border-slate-200">Add</Button>
                     </div>
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Soft Skills</label>
                     <div className="flex flex-wrap gap-2 mb-3">
                        {formData.softSkills.map(skill => (
                          <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 group">
                           {skill} <button onClick={() => setFormData(p => ({...p, softSkills: p.softSkills.filter(s => s !== skill)}))}><X className="h-3 w-3 hover:text-red-500 transition-colors" /></button>
                          </span>
                        ))}
                     </div>
                     <div className="flex gap-2">
                        <input type="text" value={softInput} onChange={e => setSoftInput(e.target.value)} onKeyDown={e => {
                           if(e.key === 'Enter') {
                              e.preventDefault();
                              const val = softInput.trim();
                              if(val && !formData.softSkills.includes(val)) setFormData(p => ({...p, softSkills: [...p.softSkills, val]}));
                              setSoftInput("");
                           }
                        }} placeholder="e.g. Leadership" className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm transition-all" />
                        <Button variant="outline" onClick={() => {
                           const val = softInput.trim();
                           if(val && !formData.softSkills.includes(val)) setFormData(p => ({...p, softSkills: [...p.softSkills, val]}));
                           setSoftInput("");
                        }} className="border-slate-200">Add</Button>
                     </div>
                  </div>
                </div>
              )}

              {/* STEP 5: PROJECTS */}
              {currentStepId === 'projects' && (
                <div className="space-y-4">
                   {formData.projects.map((proj) => (
                    <div key={proj.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm relative pr-12">
                      <h4 className="font-bold text-navy mb-1">{proj.name}</h4>
                      <p className="text-xs text-slate-600 font-medium mb-3 line-clamp-2">{proj.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                         {proj.techStack.map(t => <span key={t} className="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded">{t}</span>)}
                      </div>
                      <div className="absolute top-4 right-4 flex gap-1">
                        <button onClick={() => { setProjForm({...proj, techStackInput: proj.techStack.join(', ')}); setIsAddingProj(true); }} className="p-2 text-slate-400 hover:text-primary rounded-lg hover:bg-slate-50"><Edit3 className="h-4 w-4" /></button>
                        <button onClick={() => { setFormData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== proj.id) })) }} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}

                  {isAddingProj ? (
                    <div className="p-5 border border-primary/30 bg-indigo-50/30 rounded-xl space-y-4 animate-in slide-in-from-top-2">
                       <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Project Name</label>
                          <input type="text" value={projForm.name} onChange={e => setProjForm(p => ({...p, name: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
                          <textarea rows={3} value={projForm.description} onChange={e => setProjForm(p => ({...p, description: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Tech Stack (comma separated)</label>
                          <input type="text" placeholder="React, Node.js, Stripe" value={projForm.techStackInput} onChange={e => setProjForm(p => ({...p, techStackInput: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                       </div>
                       <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Live URL (Optional)</label>
                            <input type="text" value={projForm.liveUrl} onChange={e => setProjForm(p => ({...p, liveUrl: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">GitHub URL (Optional)</label>
                            <input type="text" value={projForm.githubUrl} onChange={e => setProjForm(p => ({...p, githubUrl: e.target.value}))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                          </div>
                       </div>
                       <div className="flex gap-2 justify-end pt-2">
                         <Button variant="outline" onClick={() => setIsAddingProj(false)} className="text-slate-500 border-slate-200">Cancel</Button>
                         <Button onClick={() => {
                            if(projForm.name) {
                               const tags = projForm.techStackInput.split(',').map(s=>s.trim()).filter(Boolean);
                               setFormData(prev => {
                                 if (projForm.id) {
                                   return { ...prev, projects: prev.projects.map(p => p.id === projForm.id ? { ...projForm, techStack: tags } : p) };
                                 }
                                 return { ...prev, projects: [...prev.projects, { ...projForm, id: genId(), techStack: tags }] };
                               });
                               setIsAddingProj(false);
                               setProjForm({ id: "", name: "", description: "", techStackInput: "", techStack: [], liveUrl: "", githubUrl: "" });
                            }
                         }}>Save Project</Button>
                       </div>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => setIsAddingProj(true)} className="w-full border-dashed border-2 border-slate-200 text-primary py-8 hover:bg-primary/5 hover:border-primary/30">
                      <Plus className="h-5 w-5 mr-2" /> Add Project
                    </Button>
                  )}
                </div>
              )}

              {/* STEP 6: SUMMARY */}
              {currentStepId === 'summary' && (
                <div className="space-y-6">
                  <div className="p-5 border border-primary/20 bg-primary/5 rounded-2xl flex flex-col items-start gap-4">
                     <div>
                       <h3 className="font-bold text-navy text-sm mb-1">Writer's block?</h3>
                       <p className="text-xs text-slate-600 font-medium">We can write a tailored summary using all the data you just provided.</p>
                     </div>
                     <Button type="button" size="sm" onClick={handleAutoSummary} disabled={isGeneratingSummary} className="w-full shrink-0 flex items-center justify-center gap-2">
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

              {/* STEP 7: COVER LETTER */}
              {currentStepId === 'cover' && (
                <div className="space-y-6">
                  <div className="p-5 border border-primary/20 bg-primary/5 rounded-2xl space-y-4">
                     <div>
                       <h3 className="font-bold text-navy text-sm mb-1 text-center">Generate Cover Letter</h3>
                       <p className="text-xs text-slate-600 font-medium text-center">Use your resume data to generate a tailored cover letter.</p>
                     </div>
                     <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Position you're applying for</label>
                          <input type="text" value={formData.coverLetterInfo?.jobTitle || ''} onChange={e => handleInputChange('coverLetterInfo', { ...formData.coverLetterInfo, jobTitle: e.target.value })} placeholder="e.g. Frontend Developer" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Company Name</label>
                          <input type="text" value={formData.coverLetterInfo?.company || ''} onChange={e => handleInputChange('coverLetterInfo', { ...formData.coverLetterInfo, company: e.target.value })} placeholder="e.g. Acme Corp" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Tone</label>
                        <div className="flex gap-2">
                          {["Professional", "Enthusiastic", "Concise"].map(t => (
                             <button key={t} onClick={() => handleInputChange('coverLetterInfo', { ...formData.coverLetterInfo, tone: t })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.coverLetterInfo?.tone === t || (!formData.coverLetterInfo?.tone && t === "Professional") ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{t}</button>
                          ))}
                        </div>
                     </div>
                     <Button type="button" size="sm" onClick={handleAutoCoverLetter} disabled={isGeneratingCoverLetter} className="w-full shrink-0 flex items-center justify-center gap-2">
                       {isGeneratingCoverLetter ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} AI Generate Cover Letter
                     </Button>
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Cover Letter Body</label>
                     <textarea 
                       value={formData.coverLetter || ''}
                       onChange={e => {
                          handleInputChange('coverLetter', e.target.value);
                          setPreviewTab('cover');
                       }}
                       className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 text-sm leading-relaxed" 
                       rows={12} 
                       placeholder="Dear Hiring Manager..."
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
          
          {currentStep === activeSteps.length - 2 ? (
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleSkipToDownload} className="px-6 font-bold text-primary border-primary hover:bg-primary/5" disabled={saveStatus === "saving"}>
                {saveStatus === "saving" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Skip to Download
              </Button>
              <Button onClick={() => setCurrentStep(p => p + 1)} className="px-6 font-bold shadow-[0_4px_12px_rgba(99,102,241,0.2)]">
                Add Cover Letter <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : currentStep === activeSteps.length - 1 ? (
             <Button onClick={manuallySaveAndFinish} className="px-6 font-bold shadow-[0_4px_12px_rgba(99,102,241,0.2)]" disabled={saveStatus === "saving"}><Sparkles className="h-4 w-4 mr-2" /> {saveStatus === "saving" ? 'Saving...' : 'Finish & Download'}</Button>
          ) : (
             <Button onClick={() => setCurrentStep(p => p + 1)} className="px-6 font-bold shadow-[0_4px_12px_rgba(99,102,241,0.2)]">Next Step <ChevronRight className="h-4 w-4 ml-2" /></Button>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Live Preview (Desktop) */}
      <div className="hidden md:flex md:w-[55%] relative flex-col overflow-hidden bg-slate-200/50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
         
         {/* Live Preview Header area (Tabs and Template Selector) */}
         <div className="w-full h-16 border-b border-slate-200 bg-white/80 backdrop-blur shrink-0 flex items-center justify-between px-6 z-10">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
               <button onClick={() => setPreviewTab('resume')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${previewTab === 'resume' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}>Resume</button>
               <button onClick={() => setPreviewTab('cover')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${previewTab === 'cover' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'}`}>Cover Letter</button>
            </div>
            {previewTab === 'resume' && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Template:</span>
                <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} className="bg-white border border-slate-200 text-sm font-bold text-navy py-1.5 px-3 rounded-lg focus:outline-none focus:ring-[3px] focus:ring-primary/10">
                  {templates.map(t => (
                    <option key={t.id} value={t.renderType}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}
         </div>

                      {/* ATS Score display */}
             {atsScore !== null && (
              <div className="mx-4 mb-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm z-20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">ATS Score</span>
                  <div className={`text-lg font-bold ${
                    atsScore.score >= 80 ? 'text-emerald-600' :
                    atsScore.score >= 60 ? 'text-amber-600' : 
                    'text-red-500'
                  }`}>
                    {atsScore.score}/100
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      atsScore.score >= 80 ? 'bg-emerald-500' :
                      atsScore.score >= 60 ? 'bg-amber-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${atsScore.score}%` }}
                  />
                </div>
                {atsScore.issues.length > 0 && (
                  <div className="space-y-1">
                    {atsScore.issues.slice(0,2).map((issue, i) => (
                      <p key={i} className="text-[10px] text-slate-500 flex items-center gap-1">
                        <span className="text-amber-500">⚠</span>
                        {issue}
                      </p>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleCalculateATS}
                  disabled={isCalculatingATS}
                  className="mt-2 w-full text-[10px] font-semibold text-primary hover:bg-primary/5 py-1 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isCalculatingATS ? 'Analyzing...' : '↻ Recalculate'}
                </button>
              </div>
            )}

            {atsScore === null && formData.name && (
              <div className="mx-4 mb-3 z-20">
                <button
                  type="button"
                  onClick={handleCalculateATS}
                  disabled={isCalculatingATS}
                  className="w-full p-3 bg-white border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                >
                  {isCalculatingATS ? 
                    '⟳ Calculating ATS Score...' : 
                    '✓ Check ATS Score'
                  }
                </button>
              </div>
            )}

          <div className="flex-1 overflow-hidden flex items-center justify-center p-8 relative" ref={previewContainerRef}>
           <AnimatePresence>
             {errorMsg && (
               <motion.div initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 50, x: "-50%" }} className="absolute bottom-8 left-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-xl font-bold text-sm z-50 flex items-center gap-2">
                 <X className="h-4 w-4" /> {errorMsg}
               </motion.div>
             )}
           </AnimatePresence>
           
           <div className="mx-auto bg-white shadow-2xl shadow-slate-300 shrink-0 transform-gpu transition-all origin-center overflow-hidden pointer-events-none flex flex-col relative"
                style={{ width: '794px', minHeight: '1123px', transform: `scale(${previewScale})` }}
           >
              {previewTab === 'resume' ? (
                <>
                  {!formData.name && !formData.role && formData.experience.length === 0 ? (
                     <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 mt-32">
                        <FileText className="h-24 w-24 mb-4 text-slate-300" />
                        <p className="font-bold text-xl uppercase tracking-widest text-slate-400">Start filling the form</p>
                        <p className="font-medium text-slate-400">to see your resume preview</p>
                     </div>
                  ) : (
                    <ResumeRenderer data={formData} template={selectedTemplate} />
                  )}
                </>
              ) : (
                <div className="p-8 sm:p-12 overflow-hidden flex flex-col h-full w-full">
                  <div className="mb-12 border-b-2 border-slate-900 pb-6 text-center shrink-0">
                    <h1 className="text-3xl font-display font-bold uppercase text-slate-900 tracking-tight leading-none mb-1">
                      {formData.name || 'YOUR NAME'}
                    </h1>
                    <div className="flex flex-wrap justify-center items-center gap-3 text-xs font-semibold uppercase text-slate-600 tracking-wider">
                       {formData.email && <span>{formData.email}</span>}
                       {formData.phone && <span>• {formData.phone}</span>}
                       {formData.location && <span>• {formData.location}</span>}
                    </div>
                  </div>
                  {formData.coverLetter ? (
                    <div className="text-[14px] leading-[1.8] text-slate-800 font-serif whitespace-pre-wrap break-word max-w-full">
                      {formData.coverLetter}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center opacity-30 mt-16 flex-1">
                        <FileSignature className="h-24 w-24 mb-4 text-slate-300" />
                        <p className="font-bold text-xl uppercase tracking-widest text-slate-400">No Cover Letter</p>
                        <p className="font-medium text-slate-400">Fill out step 7 to generate one</p>
                    </div>
                  )}
                </div>
              )}
           </div>
         </div>
      </div>
      
      {/* Mobile Floating Preview Button */}
      <button 
        onClick={() => setMobilePreviewOpen(true)}
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 bg-navy text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.3)] z-40 transition-transform active:scale-95"
      >
        <Eye className="h-6 w-6" />
      </button>

      {/* Mobile Preview Sheet */}
      <AnimatePresence>
        {mobilePreviewOpen && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 bg-slate-200/50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] flex flex-col md:hidden"
          >
            <div className="w-full h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-10 shadow-sm">
               <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                 <button onClick={() => setPreviewTab('resume')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${previewTab === 'resume' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}>Resume</button>
                 <button onClick={() => setPreviewTab('cover')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${previewTab === 'cover' ? 'bg-white shadow-sm text-primary' : 'text-slate-500'}`}>Cover Letter</button>
               </div>
               <button onClick={() => setMobilePreviewOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                 <X className="h-6 w-6" />
               </button>
            </div>
            {previewTab === 'resume' && (
              <div className="bg-white border-b border-slate-200 px-4 py-2 shrink-0">
                <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-sm font-bold text-navy py-2 px-3 rounded-lg focus:outline-none">
                  {templates.map(t => (
                    <option key={t.id} value={t.renderType}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="flex-1 overflow-hidden flex items-center justify-center p-4 relative" ref={mobilePreviewContainerRef}>
               <div className="mx-auto bg-white shadow-2xl shadow-slate-300 shrink-0 transform-gpu origin-center overflow-hidden pointer-events-none flex flex-col relative"
                    style={{ width: '794px', minHeight: '1123px', transform: `scale(${mobilePreviewScale})` }}
               >
                  {previewTab === 'resume' ? (
                    <>
                      {!formData.name && !formData.role && formData.experience.length === 0 ? (
                         <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 mt-32">
                            <FileText className="h-24 w-24 mb-4 text-slate-300" />
                            <p className="font-bold text-xl uppercase tracking-widest text-slate-400">Start filling the form</p>
                            <p className="font-medium text-slate-400">to see your resume preview</p>
                         </div>
                      ) : (
                        <ResumeRenderer data={formData} template={selectedTemplate} />
                      )}
                    </>
                  ) : (
                    <div className="p-8 overflow-hidden flex flex-col h-full w-full">
                      <div className="mb-12 border-b-2 border-slate-900 pb-6 text-center shrink-0">
                        <h1 className="text-3xl font-display font-bold uppercase text-slate-900 tracking-tight leading-none mb-1">
                          {formData.name || 'YOUR NAME'}
                        </h1>
                      </div>
                      {formData.coverLetter ? (
                        <div className="text-[14px] leading-[1.8] text-slate-800 font-serif whitespace-pre-wrap break-word max-w-full">
                          {formData.coverLetter}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center opacity-30 mt-16 flex-1">
                            <FileSignature className="h-24 w-24 mb-4 text-slate-300" />
                            <p className="font-bold text-xl uppercase tracking-widest text-slate-400">No Cover Letter</p>
                        </div>
                      )}
                    </div>
                  )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}