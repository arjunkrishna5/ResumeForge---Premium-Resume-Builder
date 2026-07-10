import { motion, AnimatePresence } from "motion/react";
import { Plus, MoreVertical, FileText, Download, Edit3, Trash2, Import, Clock, Copy, Share2, FileVideo, Eye, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getUserResumes, deleteResume, duplicateResume, ResumeDocument, getUserActivity, ActivityDocument } from "../lib/resumeService";
import { ImportResumeModal } from "../components/ImportResumeModal";
import { TemplatePickerModal } from "../components/TemplatePickerModal";


// Dummy resume HTML renders
const ModernResumePreview = () => (
   <div className="w-full h-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-200 flex flex-col pt-3 pb-2 px-3 text-[4px] leading-tight overflow-hidden">
     <div className="border-b border-navy pb-1 mb-1.5 flex flex-col items-center">
       <div className="font-bold text-[6px] text-navy uppercase tracking-wider">Loading...</div>
       <div className="flex gap-1 text-[3px] text-slate-500 mt-1 uppercase">
         <span>Resume Preview</span>
       </div>
     </div>
     <div className="mb-1.5">
       <div className="text-slate-700 text-justify">Open builder to edit this resume.</div>
     </div>
   </div>
);

export function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  
  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activities, setActivities] = useState<ActivityDocument[]>([]);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  
  const [showWelcome, setShowWelcome] = useState(location.state?.newUser || false);

  useEffect(() => {
    if (showWelcome) {
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const fetchResumes = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getUserResumes(currentUser.uid);
      setResumes(data);
      const acts = await getUserActivity(currentUser.uid);
      setActivities(acts.slice(0, 5));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const searchQuery = new URLSearchParams(location.search).get('q') || '';
  const filteredResumes = resumes.filter(r => 
    !searchQuery || (r.title && r.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    fetchResumes();
  }, [currentUser]);

  const handleDelete = async (id: string) => {
    if (!currentUser) return;
    if (window.confirm("Are you sure you want to delete this resume? This cannot be undone.")) {
      try {
        await deleteResume(currentUser.uid, id);
        fetchResumes();
      } catch (e) {
         console.error(e);
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!currentUser) return;
    try {
      await duplicateResume(currentUser.uid, id);
      fetchResumes();
    } catch (e) {
       console.error(e);
    }
  };

  // Icons imported manually as they were missing
  const CheckCircle2 = (props:any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>;
  const Activity = (props:any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;

  const totalDownloads = resumes.reduce(
    (sum, r) => sum + (r.downloadCount || 0), 0
  );

  const stats = [
    { label: "Total Resumes", value: resumes.length.toString(), text: "Saved successfully", textClass: "text-emerald-600", icon: FileText, bg: "bg-blue-50", color: "text-blue-600" },
    { label: "Downloads", value: totalDownloads.toString(), text: "Start downloading", textClass: "text-emerald-600", icon: Download, bg: "bg-indigo-50", color: "text-indigo-600" },
    { label: "Profile Completion", value: "100%", text: "All good", textClass: "text-amber-600", icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600" },
    { label: "Active Applications", value: "0", text: "Keep applying", textClass: "text-emerald-600", icon: Activity, bg: "bg-purple-50", color: "text-purple-600" },
  ];

  const greetingName = currentUser?.displayName?.split(' ')[0] || currentUser?.email?.split('@')[0] || "there";
  const hour = new Date().getHours();
  let greetingTime = "Good morning";
  if (hour >= 12 && hour < 17) greetingTime = "Good afternoon";
  else if (hour >= 17 && hour < 22) greetingTime = "Good evening";
  else if (hour >= 22 || hour < 6) greetingTime = "Good night";

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8 relative">
      <AnimatePresence>
        {showWelcome && (
          <motion.div initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -50, x: "-50%" }} className="absolute top-0 left-1/2 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-xl font-bold text-sm z-50 flex items-center gap-3">
            Welcome to ResumeForge! Create your first resume to get started.
            <button onClick={() => setShowWelcome(false)} className="hover:text-emerald-100"><X className="h-4 w-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-3xl font-display font-bold text-navy mb-1 tracking-tight">{greetingTime}, {greetingName} 👋</h1>
          <p className="text-slate-500 font-medium text-sm">You have {resumes.length} resumes in your workspace.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex items-center gap-3">
           <Button onClick={() => setIsImportModalOpen(true)} variant="outline" className="gap-2 bg-white text-slate-700 shadow-sm border-slate-200">
             <Import className="h-4 w-4" /> Import Resume
           </Button>
           <Button onClick={() => setShowTemplatePicker(true)} className="gap-2">
             <Plus className="h-4 w-4" /> Create New Resume
           </Button>
        </motion.div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
         {/* Main Content Space - 70% */}
         <div className="w-full xl:w-[70%] space-y-8">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {stats.map((stat, i) => (
                  <motion.div 
                     key={i} 
                     initial={{ opacity: 0, y: 20 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     transition={{ delay: i * 0.1, duration: 0.4 }}
                     className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
                  >
                     <div className="flex justify-between items-start mb-2">
                        <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                           <stat.icon className="h-5 w-5" />
                        </div>
                     </div>
                     <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</h3>
                     <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-navy">{stat.value}</span>
                     </div>
                     <div className={`text-xs font-medium mt-1 ${stat.textClass}`}>{stat.text}</div>
                  </motion.div>
               ))}
            </div>

            {/* Resume Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create New Card */}
              <div onClick={() => setShowTemplatePicker(true)} className="group flex flex-col justify-center items-center h-[340px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-indigo-50/50 hover:border-primary transition-all duration-200 p-6 text-center shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1">
                <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white text-primary shadow-sm transition-all duration-300 border border-slate-200 group-hover:border-primary">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-navy text-lg leading-tight">Create New Resume</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">Start from scratch or jump right in</p>
              </div>
              
              {loading ? (
                <>
                  {[1, 2].map((n) => (
                     <div key={n} className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm h-[340px] animate-pulse">
                        <div className="h-[210px] bg-slate-100/50"></div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                           <div>
                              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                           </div>
                           <div className="flex gap-2">
                              <div className="h-8 bg-slate-200 rounded flex-1"></div>
                              <div className="h-8 bg-slate-200 rounded flex-1"></div>
                           </div>
                        </div>
                     </div>
                  ))}
                </>
              ) : filteredResumes.length === 0 ? (
                <div className="col-span-1 sm:col-span-1 lg:col-span-2 flex flex-col items-center justify-center h-[340px] rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm border-dashed">
                   <FileText className="h-12 w-12 text-slate-300 mb-4" />
                   <h3 className="text-lg font-bold text-navy mb-1">No resumes match your search</h3>
                </div>
              ) : (
                 <>
                  {filteredResumes.map((resume, i) => (
                    <motion.div
                      key={resume.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                      transition={{ delay: i * 0.1, duration: 0.2 }}
                      className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all h-[340px]"
                    >
                      {/* Thumbnail Preview Area */}
                      <div className="h-[210px] bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden rounded-t-2xl">
                        <div className="w-[124px] h-[175px] bg-white shadow-md border border-slate-200/50 transform-gpu group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                            <ModernResumePreview />
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-navy/40 transition-colors duration-300 z-10" />
                        </div>
                        
                        {/* Quick actions overlay that appears on hover */}
                        <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px] z-20">
                          <Link to={`/builder/${resume.id}`} className="p-2.5 bg-white rounded-full text-navy shadow-lg hover:scale-110 hover:text-white hover:bg-primary transition-all">
                              <Edit3 className="h-4 w-4" />
                          </Link>
                          <Link to={`/preview/${resume.id}`} className="p-2.5 bg-white rounded-full text-navy shadow-lg hover:scale-110 hover:text-white hover:bg-primary transition-all">
                              <Eye className="h-4 w-4" />
                          </Link>
                        </div>

                        {/* Completion Badge */}
                        <div className="absolute top-3 right-3 z-30">
                            <div className="bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md shadow-sm border border-slate-200 text-slate-700 flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                              {resume.completion}%
                            </div>
                        </div>
                      </div>

                      {/* Info Area */}
                      <div className="p-4 flex-1 flex flex-col justify-between border-t border-slate-100 bg-white rounded-b-2xl">
                        <div>
                            <div className="flex justify-between items-start mb-1">
                              <Link to={`/builder/${resume.id}`} className="font-bold text-navy hover:text-primary transition-colors line-clamp-1 pr-2">
                              {resume.title || "Untitled Resume"}
                              </Link>
                              <div className="relative group/menu">
                              <button className="text-slate-400 hover:text-navy -mr-2 p-1 rounded-md hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-0">
                                  <MoreVertical className="h-4 w-4" />
                              </button>
                              {/* Drop menu */}
                              <div className="absolute right-0 top-full -mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50 p-1">
                                  <button onClick={() => navigate(`/builder/${resume.id}`)} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary rounded-md flex items-center gap-2 cursor-pointer">
                                    <Edit3 className="h-4 w-4 text-slate-400" /> Edit
                                  </button>
                                  <button onClick={() => handleDuplicate(resume.id)} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary rounded-md flex items-center gap-2 cursor-pointer">
                                    <Copy className="h-4 w-4 text-slate-400" /> Duplicate
                                  </button>
                                  <div className="h-px bg-slate-100 my-1"></div>
                                  <button onClick={() => handleDelete(resume.id)} className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 cursor-pointer">
                                    <Trash2 className="h-4 w-4" /> Delete
                                  </button>
                              </div>
                              </div>
                            </div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                              {resume.templateId} Template
                            </p>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={() => navigate(`/preview/${resume.id}`)} variant="outline" size="sm" className="flex-1 h-8 text-xs font-semibold bg-slate-50 border-slate-200 cursor-pointer hover:bg-slate-100">
                              <Download className="h-3 w-3 mr-1.5" /> PDF
                          </Button>
                          <p className="text-[10px] text-slate-400 flex items-center justify-end flex-1 font-medium bg-transparent border-0 uppercase tracking-wider">
                              {new Date(resume.updatedAt.toDate()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                 </>
              )}
            </div>
         </div>

         {/* Sidebar Content Space - 30% */}
         <div className="w-full xl:w-[30%] space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
               <h2 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
                 <Activity className="h-5 w-5 text-primary" /> Recent Activity
               </h2>
               <div className="space-y-4">
                  {activities.length === 0 ? (
                     <div className="text-sm text-slate-500 font-medium">No activity yet. Create a resume to get started.</div>
                  ) : (
                     activities.map((act) => {
                       let ActIcon = FileText;
                       let color = "text-emerald-500";
                       let bg = "bg-emerald-50";
                       let actionVerb = act.action;
                       
                       if (act.action === "deleted") {
                         ActIcon = Trash2; color = "text-red-500"; bg = "bg-red-50";
                       } else if (act.action === "updated") {
                         ActIcon = Edit3; color = "text-blue-500"; bg = "bg-blue-50";
                       } else if (act.action === "downloaded") {
                         ActIcon = Download; color = "text-indigo-500"; bg = "bg-indigo-50";
                       }

                       // Simple relative time formatting
                       const diffSecs = Math.floor((Date.now() - act.timestamp.toDate().getTime()) / 1000);
                       let timeString = "Just now";
                       if (diffSecs > 86400) timeString = `${Math.floor(diffSecs/86400)}d ago`;
                       else if (diffSecs > 3600) timeString = `${Math.floor(diffSecs/3600)}h ago`;
                       else if (diffSecs > 60) timeString = `${Math.floor(diffSecs/60)}m ago`;

                       return (
                         <div key={act.id} className="flex gap-3 items-start">
                            <div className={`p-2 rounded-full ${bg} ${color} shrink-0 mt-0.5`}>
                               <ActIcon className="h-3.5 w-3.5" />
                            </div>
                            <div>
                               <p className="text-sm font-medium text-slate-700 leading-tight">
                                 {actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1)} <span className="font-bold">{act.resumeTitle}</span>
                               </p>
                               <span className="text-xs text-slate-400">{timeString}</span>
                            </div>
                         </div>
                       );
                     })
                  )}
               </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-navy rounded-2xl p-6 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <FileVideo className="h-32 w-32 -mr-8 -mt-8" />
               </div>
               <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                 Quick Tips
               </h2>
               <ul className="space-y-4">
                  <li className="flex gap-3">
                     <span className="text-primary-hover font-bold mt-0.5">1</span>
                     <p className="text-sm text-indigo-100 font-medium leading-relaxed">Quantify achievements with numbers (e.g., "Increased sales by 20%").</p>
                  </li>
                  <li className="flex gap-3">
                     <span className="text-primary-hover font-bold mt-0.5">2</span>
                     <p className="text-sm text-indigo-100 font-medium leading-relaxed">Tailor your skills section to match the job description keywords.</p>
                  </li>
                  <li className="flex gap-3">
                     <span className="text-primary-hover font-bold mt-0.5">3</span>
                     <p className="text-sm text-indigo-100 font-medium leading-relaxed">Keep descriptions concise. Aim for 3-4 strong bullet points per role.</p>
                  </li>
               </ul>
               <Button className="w-full mt-6 bg-white text-navy hover:bg-indigo-50 border-transparent text-sm">
                  Read Career Guide
               </Button>
            </div>
         </div>
      </div>
      <ImportResumeModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
      <TemplatePickerModal isOpen={showTemplatePicker} onClose={() => setShowTemplatePicker(false)} />
    </div>
  );
}
