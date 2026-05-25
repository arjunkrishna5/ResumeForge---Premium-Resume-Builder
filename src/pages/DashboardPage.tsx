import { motion } from "motion/react";
import { Plus, MoreVertical, FileText, Download, Edit3, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const resumes = [
    { id: 1, title: "Software Engineer - Google", lastEdited: "2 hours ago", color: "from-blue-500 to-indigo-500" },
    { id: 2, title: "Frontend Developer - Startup", lastEdited: "2 days ago", color: "from-emerald-400 to-teal-500" },
    { id: 3, title: "Product Manager Variant", lastEdited: "1 week ago", color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-navy mb-1">My Resumes</h1>
          <p className="text-slate-500">Manage and create your professional stories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Create New Card */}
        <Link to="/builder" className="group h-72 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-50 hover:border-primary transition-all duration-200 p-6 text-center">
          <div className="h-14 w-14 rounded-full bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white text-primary transition-all duration-300">
            <Plus className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-navy">Create New Resume</h3>
          <p className="text-sm text-slate-500 mt-2">Start from scratch or use AI</p>
        </Link>

        {/* Existing Resumes */}
        {resumes.map((resume, i) => (
          <motion.div
            key={resume.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            {/* Thumbnail Preview Area */}
            <div className="h-40 bg-slate-100 border-b border-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
               <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${resume.color}`} />
               <div className="w-full h-full bg-white shadow-sm border border-slate-200 rounded p-3 flex flex-col gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className={`h-4 w-1/2 rounded-sm bg-gradient-to-r ${resume.color}`} />
                  <div className="h-2 w-3/4 rounded-sm bg-slate-200" />
                  <div className="h-2 w-full rounded-sm bg-slate-100" />
                  <div className="h-2 w-full rounded-sm bg-slate-100" />
                  <div className="h-2 w-4/5 rounded-sm bg-slate-100" />
               </div>
               
               {/* Quick actions overlay that appears on hover */}
               <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                 <Link to="/builder" className="p-2 bg-white rounded-full text-navy hover:scale-110 hover:text-primary transition-all">
                    <Edit3 className="h-4 w-4" />
                 </Link>
                 <button className="p-2 bg-white rounded-full text-navy hover:scale-110 hover:text-primary transition-all">
                    <Download className="h-4 w-4" />
                 </button>
               </div>
            </div>

            {/* Info Area */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <Link to="/builder" className="font-semibold text-navy hover:text-primary transition-colors line-clamp-1 flex-1 pr-2">
                  {resume.title}
                </Link>
                <div className="relative group/menu">
                  <button className="text-slate-400 hover:text-navy -mr-2 p-1 rounded-md hover:bg-slate-50">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {/* Invisible drop menu mockup */}
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 p-1">
                    <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-navy rounded-md flex items-center gap-2">
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-auto flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Edited {resume.lastEdited}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
