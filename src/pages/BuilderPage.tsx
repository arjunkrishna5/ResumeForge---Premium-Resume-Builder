import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, ChevronRight, User, Briefcase, GraduationCap, 
  Wrench, FolderGit2, FileText, Sparkles, Wand2, Plus, Download
} from "lucide-react";

const steps = [
  { id: 'personal', title: 'Personal Info', icon: User },
  { id: 'experience', title: 'Experience', icon: Briefcase },
  { id: 'education', title: 'Education', icon: GraduationCap },
  { id: 'skills', title: 'Skills', icon: Wrench },
  { id: 'projects', title: 'Projects', icon: FolderGit2 },
  { id: 'summary', title: 'Summary', icon: FileText },
];

export function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);

  // Dummy form state
  const [formData, setFormData] = useState({
    name: 'Sarah Jenkins',
    role: 'Senior Product Designer',
    email: 'sarah.j@example.com',
    phone: '(555) 123-4567',
    summary: 'Award-winning product designer with 8+ years of experience in creating human-centered digital experiences for fintech and healthcare sectors.',
    experience: [
       { title: 'Senior Product Designer', company: 'Stripe', date: '2021 - Present' },
       { title: 'UX Designer', company: 'Airbnb', date: '2018 - 2021' }
    ],
    skills: 'UI/UX Design, Figma, User Research, Prototyping, Frontend Basics'
  });

  const handleNext = () => setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
  const handlePrev = () => setCurrentStep(Math.max(0, currentStep - 1));

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 flex-col md:flex-row">
      {/* LEFT PANEL: Builder Form */}
      <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col h-full border-r border-slate-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-10">
        
        {/* Builder Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <Link to="/dashboard" className="text-slate-500 hover:text-navy flex items-center gap-1 text-sm font-medium transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-400">Saving...</span>
            <Button size="sm" variant="outline" className="h-8">Preview</Button>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
           <div className="flex justify-between text-sm font-medium mb-2 text-slate-500">
             <span>{steps[currentStep].title}</span>
             <span>{currentStep + 1} of {steps.length}</span>
           </div>
           <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-primary"
               initial={{ width: 0 }}
               animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
               transition={{ ease: "circOut" }}
             />
           </div>
        </div>

        {/* Form Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-md mx-auto"
            >
              {/* Step 1: Personal Info Content */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-display font-bold text-navy mb-2">Let's start with the basics</h2>
                    <p className="text-slate-500">How can employers reach you?</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-colors text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Target Role</label>
                      <input 
                        type="text" 
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-colors text-sm" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-colors text-sm" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Phone</label>
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-colors text-sm" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Experience (Mockup) */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="mb-8 flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-navy mb-2">Work Experience</h2>
                      <p className="text-slate-500">Highlight your most relevant roles.</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-9 gap-2">
                       <Plus className="h-4 w-4" /> Add
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                     {formData.experience.map((exp, i) => (
                       <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white group hover:border-primary/50 transition-colors cursor-pointer">
                         <div className="flex justify-between mb-1">
                           <h4 className="font-semibold text-navy">{exp.title}</h4>
                           <span className="text-sm text-slate-500">{exp.date}</span>
                         </div>
                         <p className="text-sm text-slate-600">{exp.company}</p>
                       </div>
                     ))}
                  </div>

                  <div className="p-5 mt-6 rounded-xl border border-indigo-100 bg-indigo-50/50 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wand2 className="h-24 w-24 text-primary" />
                     </div>
                     <h4 className="font-semibold text-navy flex items-center gap-2 mb-2 relative z-10">
                        <Sparkles className="h-4 w-4 text-primary" />
                        AI Bullet Writer
                     </h4>
                     <p className="text-sm text-slate-600 mb-4 relative z-10">Struggling to describe your impact? Let our AI suggest optimized bullet points based on your role.</p>
                     <Button size="sm" className="w-full relative z-10 bg-white border border-primary/20 text-primary hover:bg-indigo-50 shadow-sm">
                        Generate Bullets
                     </Button>
                  </div>
                </div>
              )}

              {/* Step 6: Summary (Mockup) */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-display font-bold text-navy mb-2">Professional Summary</h2>
                    <p className="text-slate-500">The elevator pitch for your career.</p>
                  </div>

                  <div>
                     <div className="flex justify-between items-end mb-1.5">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Summary</label>
                        <button className="text-xs font-semibold text-primary flex items-center gap-1 hover:text-primary-hover">
                           <Sparkles className="h-3 w-3" /> Auto-write with AI
                        </button>
                     </div>
                     <textarea 
                        rows={6}
                        value={formData.summary}
                        onChange={(e) => setFormData({...formData, summary: e.target.value})}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-colors text-sm overflow-hidden resize-none leading-relaxed" 
                     />
                  </div>
                </div>
              )}

              {/* Placeholders for other steps */}
              {[2,3,4].includes(currentStep) && (
                 <div className="py-20 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                       <Wrench className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-navy mb-2">Content Builder</h3>
                    <p className="text-slate-500">Step {currentStep + 1} content area.</p>
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Builder Footer Nav */}
        <div className="p-4 sm:p-6 border-t border-slate-200 bg-white flex justify-between items-center">
           <Button 
              variant="ghost" 
              onClick={handlePrev} 
              disabled={currentStep === 0}
              className="gap-2"
           >
              <ChevronLeft className="h-4 w-4" /> Back
           </Button>
           
           {currentStep < steps.length - 1 ? (
             <Button onClick={handleNext} className="gap-2 px-8">
                Next <ChevronRight className="h-4 w-4" />
             </Button>
           ) : (
             <Button className="gap-2 px-8 bg-green-600 hover:bg-green-700 shadow-green-600/20 shadow-lg">
                Finish & Download <Download className="h-4 w-4" />
             </Button>
           )}
        </div>
      </div>

      {/* RIGHT PANEL: Live Preview */}
      <div className="hidden md:block flex-1 bg-slate-200 overflow-y-auto p-8 lg:p-12">
         {/* Simple Resume Document Mockup */}
         <div className="mx-auto bg-white rounded-sm shadow-2xl aspect-[1/1.414] w-[80%] max-w-[800px] overflow-hidden transform-gpu transition-all origin-top scale-100 hover:scale-[1.02]">
            <div className="w-full h-full p-12 text-slate-800">
               {/* Header Preview */}
               <div className="border-b-2 border-slate-800 pb-6 mb-6">
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2 font-display uppercase">{formData.name}</h1>
                  <h2 className="text-lg text-primary font-medium tracking-widest uppercase mb-4">{formData.role}</h2>
                  <div className="flex gap-4 text-sm text-slate-500 font-medium">
                     <span>{formData.email}</span>
                     <span>•</span>
                     <span>{formData.phone}</span>
                     <span>•</span>
                     <span>New York, NY</span>
                  </div>
               </div>
               
               {/* Summary Preview */}
               <div className="mb-8">
                  <p className="text-sm leading-relaxed text-slate-700 text-justify">
                     {formData.summary}
                  </p>
               </div>

               {/* Experience Preview */}
               <div className="mb-8">
                  <h3 className="text-sm font-bold tracking-widest uppercase text-slate-900 border-b border-slate-300 pb-2 mb-4">Experience</h3>
                  
                  {formData.experience.map((exp, i) => (
                     <div key={i} className="mb-6">
                        <div className="flex justify-between items-baseline mb-1">
                           <h4 className="font-bold text-slate-800">{exp.title}</h4>
                           <span className="text-xs font-semibold text-slate-500">{exp.date}</span>
                        </div>
                        <div className="text-sm text-primary font-medium mb-2">{exp.company}</div>
                        <ul className="list-disc pl-4 text-xs space-y-1 text-slate-700">
                           <li>Led design initiatives for high-impact user interfaces.</li>
                           <li>Collaborated with cross-functional teams to deliver product features.</li>
                           <li>Improved user retention metrics through data-driven UX improvements.</li>
                        </ul>
                     </div>
                  ))}
               </div>

               {/* Skills Preview */}
               <div>
                  <h3 className="text-sm font-bold tracking-widest uppercase text-slate-900 border-b border-slate-300 pb-2 mb-4">Skills</h3>
                  <p className="text-sm leading-relaxed text-slate-700">
                     {formData.skills}
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
