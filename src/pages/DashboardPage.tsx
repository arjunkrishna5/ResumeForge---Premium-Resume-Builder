import { motion } from "motion/react";
import { Plus, MoreVertical, FileText, Download, Edit3, Trash2, Import, Clock, Copy, Share2, FileVideo, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

// Dummy resume HTML renders
const ModernResumePreview = () => (
   <div className="w-full h-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-200 flex flex-col pt-3 pb-2 px-3 text-[4px] leading-tight overflow-hidden">
     <div className="border-b border-navy pb-1 mb-1.5 flex flex-col items-center">
       <div className="font-bold text-[6px] text-navy uppercase tracking-wider">Alex Johnson</div>
       <div className="text-primary font-semibold mt-0.5 tracking-widest uppercase">Software Engineer</div>
       <div className="flex gap-1 text-[3px] text-slate-500 mt-1 uppercase">
         <span>alex@email.com</span>•<span>San Francisco, CA</span>
       </div>
     </div>
     <div className="mb-1.5">
       <div className="text-slate-700 text-justify">Experienced software engineer specializing in frontend architecture and scaling. Documented history of improving system performance and delivering user-centric applications.</div>
     </div>
     <div className="flex-1">
       <div className="font-bold uppercase border-b border-slate-200 mb-1 text-slate-800 tracking-wider">Experience</div>
       <div className="mb-1">
         <div className="flex justify-between">
           <span className="font-bold text-navy">Google</span>
           <span className="text-[3px] text-slate-500">2021 - Present</span>
         </div>
         <div className="font-semibold text-primary">Senior Software Engineer</div>
         <ul className="list-disc pl-2 mt-0.5 space-y-[1px] text-slate-600">
           <li>Led development of internal dashboard tools...</li>
           <li>Optimized build times by 40% using modern bundlers...</li>
         </ul>
       </div>
       <div>
         <div className="flex justify-between">
           <span className="font-bold text-navy">Startup Inc</span>
           <span className="text-[3px] text-slate-500">2018 - 2021</span>
         </div>
         <div className="font-semibold text-primary">Frontend Developer</div>
       </div>
     </div>
   </div>
);

const MinimalResumePreview = () => (
   <div className="w-full h-full bg-[#FAFAFA] shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-200 flex flex-col p-3 text-[4px] leading-tight overflow-hidden font-sans">
     <div className="mb-2">
       <div className="font-light text-[7px] text-slate-800 tracking-tight">ALEX JOHNSON</div>
       <div className="text-[4px] text-slate-500 mt-0.5 flex gap-1">PMA • alex@email.com • +1 234 567 8900</div>
     </div>
     <div className="grid grid-cols-[1fr_2fr] gap-2 flex-1">
       <div>
          <div className="font-medium text-slate-800 mb-1">SKILLS</div>
          <div className="text-slate-500 space-y-[1px]">Product Strategy<br/>Agile Process<br/>User Research<br/>Roadmapping</div>
       </div>
       <div>
          <div className="font-medium text-slate-800 mb-1">EXPERIENCE</div>
          <div className="mb-1.5">
             <div className="font-medium text-slate-700">Product Manager</div>
             <div className="text-[3px] text-slate-500 mb-0.5">Tech Company • 2020 - Present</div>
             <div className="text-slate-600">Managed cross-functional teams to deliver 5 major product updates.</div>
          </div>
       </div>
     </div>
   </div>
);

const CreativeResumePreview = () => (
   <div className="w-full h-full bg-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-slate-800 flex text-[4px] leading-tight overflow-hidden text-slate-300">
     <div className="w-[30%] bg-indigo-600 p-2 text-indigo-100 flex flex-col">
        <div className="w-5 h-5 rounded-full bg-indigo-400 mb-2"></div>
        <div className="font-bold text-[5px] text-white uppercase tracking-widest leading-none mb-2">ALEX<br/>JOHNSON</div>
        <div className="font-medium text-[3px] mb-2 uppercase border-b border-indigo-400 pb-1">Full Stack</div>
        <div className="space-y-[1px] text-[3px]">HTML/CSS<br/>JavaScript<br/>React.js<br/>Node.js</div>
     </div>
     <div className="w-[70%] p-2 flex flex-col">
        <div className="mb-2">
           <div className="font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-[1px] mb-1">Profile</div>
           <div className="text-slate-400 text-justify">Creative technologist building immersive digital experiences with modern web technologies.</div>
        </div>
        <div className="flex-1">
           <div className="font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-[1px] mb-1">Work</div>
           <div className="mb-1">
              <div className="font-bold text-indigo-400">Creative Agency</div>
              <div className="text-[3px] text-slate-500 mb-0.5">Developer • 2022 - Present</div>
              <div className="text-slate-400">Award winning agency websites.</div>
           </div>
        </div>
     </div>
   </div>
);


export function DashboardPage() {
  const navigate = useNavigate();

  const resumes = [
    { id: 1, title: "Software Engineer - Google", template: "Modern", lastEdited: "2 hours ago", completion: 100, preview: <ModernResumePreview /> },
    { id: 2, title: "Full Stack Developer", template: "Creative", lastEdited: "2 days ago", completion: 85, preview: <CreativeResumePreview /> },
    { id: 3, title: "Product Manager Resume", template: "Minimal", lastEdited: "1 week ago", completion: 60, preview: <MinimalResumePreview /> },
  ];

  // Icons imported manually as they were missing
  const CheckCircle2 = (props:any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>;
  const Activity = (props:any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;

  const stats = [
    { label: "Total Resumes", value: "3", text: "+1 this month", textClass: "text-emerald-600", icon: FileText, bg: "bg-blue-50", color: "text-blue-600" },
    { label: "Downloads", value: "12", text: "+4 this week", textClass: "text-emerald-600", icon: Download, bg: "bg-indigo-50", color: "text-indigo-600" },
    { label: "Profile Completion", value: "85%", text: "Needs attention", textClass: "text-amber-600", icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600" },
    { label: "Active Applications", value: "5", text: "2 interviews", textClass: "text-emerald-600", icon: Activity, bg: "bg-purple-50", color: "text-purple-600" },
  ];


  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-3xl font-display font-bold text-navy mb-1 tracking-tight">Good morning, Alex 👋</h1>
          <p className="text-slate-500 font-medium text-sm">You have 3 resumes. Your last edit was 2 hours ago.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex items-center gap-3">
           <Button variant="outline" className="gap-2 bg-white text-slate-700 shadow-sm border-slate-200">
             <Import className="h-4 w-4" /> Import Resume
           </Button>
           <Button onClick={() => navigate('/builder')} className="gap-2">
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
              <Link to="/builder" className="group flex flex-col justify-center items-center h-[340px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-indigo-50/50 hover:border-primary transition-all duration-200 p-6 text-center shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1">
                <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white text-primary shadow-sm transition-all duration-300 border border-slate-200 group-hover:border-primary">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-navy text-lg leading-tight">Create New Resume</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">Start from scratch or import existing</p>
              </Link>

              {/* Existing Resumes */}
              {resumes.map((resume, i) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4, shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                  transition={{ delay: i * 0.1, duration: 0.2 }}
                  className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all h-[340px]"
                >
                  {/* Thumbnail Preview Area */}
                  <div className="h-[210px] bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
                     {/* The HTML Render inside the card container */}
                     <div className="w-[124px] h-[175px] bg-white shadow-md border border-slate-200/50 transform-gpu group-hover:scale-105 transition-transform duration-500 overflow-hidden relative">
                         {resume.preview}
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
                  <div className="p-4 flex-1 flex flex-col justify-between border-t border-slate-100 bg-white">
                    <div>
                        <div className="flex justify-between items-start mb-1">
                           <Link to={`/builder/${resume.id}`} className="font-bold text-navy hover:text-primary transition-colors line-clamp-1 pr-2">
                           {resume.title}
                           </Link>
                           <div className="relative group/menu">
                           <button className="text-slate-400 hover:text-navy -mr-2 p-1 rounded-md hover:bg-slate-50 cursor-pointer">
                              <MoreVertical className="h-4 w-4" />
                           </button>
                           {/* Invisible drop menu mockup */}
                           <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50 p-1">
                              <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary rounded-md flex items-center gap-2 cursor-pointer">
                                 <Edit3 className="h-4 w-4 text-slate-400" /> Edit
                              </button>
                              <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary rounded-md flex items-center gap-2 cursor-pointer">
                                 <Copy className="h-4 w-4 text-slate-400" /> Duplicate
                              </button>
                              <button className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary rounded-md flex items-center gap-2 cursor-pointer">
                                 <Share2 className="h-4 w-4 text-slate-400" /> Share
                              </button>
                              <div className="h-px bg-slate-100 my-1"></div>
                              <button className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 cursor-pointer">
                                 <Trash2 className="h-4 w-4" /> Delete
                              </button>
                           </div>
                           </div>
                        </div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                           {resume.template} Template
                        </p>
                    </div>

                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" className="flex-1 h-8 text-xs font-semibold bg-slate-50 border-slate-200">
                          <Download className="h-3 w-3 mr-1.5" /> PDF
                       </Button>
                       <p className="text-xs text-slate-400 flex items-center justify-end flex-1 font-medium">
                          <Clock className="h-3 w-3 mr-1" />
                          {resume.lastEdited}
                       </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
         </div>

         {/* Sidebar Content Space - 30% */}
         <div className="w-full xl:w-[30%] space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
               <h2 className="font-bold text-navy text-lg mb-4 flex items-center gap-2">
                 <Activity className="h-5 w-5 text-primary" /> Recent Activity
               </h2>
               <div className="space-y-4">
                  {[
                     { desc: "Downloaded Software Engineer resume", time: "2h ago", icon: Download, color: "text-blue-500", bg: "bg-blue-50" },
                     { desc: "Updated skills section in Creative Resume", time: "Yesterday", icon: Edit3, color: "text-amber-500", bg: "bg-amber-50" },
                     { desc: "Previewed Product Manager Resume", time: "2 days ago", icon: Eye, color: "text-indigo-500", bg: "bg-indigo-50" },
                     { desc: "Created new resume outline", time: "3 days ago", icon: Plus, color: "text-emerald-500", bg: "bg-emerald-50" },
                     { desc: "Exported Full Stack Developer as DOCX", time: "Last week", icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
                  ].map((act, i) => (
                     <div key={i} className="flex gap-3 items-start">
                        <div className={`p-2 rounded-full ${act.bg} ${act.color} shrink-0 mt-0.5`}>
                           <act.icon className="h-3.5 w-3.5" />
                        </div>
                        <div>
                           <p className="text-sm font-medium text-slate-700 leading-tight">{act.desc}</p>
                           <span className="text-xs text-slate-400">{act.time}</span>
                        </div>
                     </div>
                  ))}
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
    </div>
  );
}
