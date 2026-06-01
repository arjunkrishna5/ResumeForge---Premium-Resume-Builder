import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, Filter, ChevronDown, Check, X, Heart } from "lucide-react";
import { Button } from "../components/ui/Button";
import { TemplateRenders } from "../components/TemplateRenders";
import { templates } from "../data/templates";

export function TemplatesPage() {
  const navigate = useNavigate();
  const categories = ["All", "ATS-Friendly", "Creative", "Minimal", "Modern", "Executive"];
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);

  // Body scroll lock on modal open
  useEffect(() => {
    if (previewTemplate) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [previewTemplate]);

  // Handle ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setPreviewTemplate(null); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const [sortBy, setSortBy] = useState('popular');

  const filtered = activeCategory === "All" ? templates : templates.filter(t => t.type === activeCategory || (activeCategory === "ATS-Friendly" && parseInt(t.score) > 94));
  
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'ats') {
      return parseInt(b.score) - parseInt(a.score);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0; // popular = original order
  });

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Filter Bar */}
      <div className="flex flex-col gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-navy mb-1 tracking-tight">Template Gallery</h1>
            <p className="text-slate-500 font-medium">Find the perfect design for your next role.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative w-full md:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search templates..." 
                 className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm font-medium focus:border-primary focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-primary/10 transition-colors"
               />
             </div>
             <div className="relative group">
               <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
                  <Filter className="h-4 w-4" />
                  Sort: {sortBy === 'popular' ? 'Popular' : sortBy === 'ats' ? 'ATS Score' : 'Name'} <ChevronDown className="h-4 w-4 ml-1" />
               </button>
               <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                 <button onClick={() => setSortBy('popular')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">Popular</button>
                 <button onClick={() => setSortBy('ats')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">ATS Score</button>
                 <button onClick={() => setSortBy('name')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors">Name A-Z</button>
               </div>
             </div>
          </div>
        </div>

        <div className="flex flex-nowrap overflow-x-auto hide-scrollbar gap-2 pt-2 border-t border-slate-100 pb-2 md:pb-0 md:flex-wrap">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? "bg-navy text-white shadow-md shadow-navy/20" 
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {sorted.map((template, i) => {
            const RenderComp = TemplateRenders[template.renderType as keyof typeof TemplateRenders];
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={template.id}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.1)]"
              >
                {/* Visual Preview Area */}
                <div className="aspect-[1/1.2] bg-slate-100 p-8 relative overflow-hidden flex items-center justify-center">

                  <button className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-all cursor-pointer">
                     <Heart className="h-4 w-4" />
                  </button>

                  <div className="w-[180px] h-[254px] bg-white shadow-xl transform-gpu group-hover:scale-105 transition-transform duration-500 relative">
                     <RenderComp />
                  </div>

                   {/* Overlay action */}
                   <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm z-20">
                     <Button onClick={() => setPreviewTemplate(template)} className="shadow-2xl px-6 bg-white text-navy hover:bg-slate-50">View Details</Button>
                   </div>
                </div>

                {/* Info */}
                <div className="p-5 border-t border-slate-100 bg-white flex justify-between items-center">
                    <div>
                       <h3 className="font-bold text-navy text-lg leading-tight">{template.name}</h3>
                       <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-0.5">{template.type}</p>
                    </div>
                    <div className="text-right">
                       <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 inline-block">
                         ATS: {template.score}
                       </span>
                    </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Full Screen Preview Modal */}
      <AnimatePresence>
         {previewTemplate && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-md p-4 sm:p-8"
               onClick={() => setPreviewTemplate(null)}
            >
               <motion.div 
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-full max-w-[90vw] h-[90vh] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-200"
               >
                  {/* Left Side - Big Render */}
                  <div className="w-full md:w-[65%] bg-slate-100 border-r border-slate-200 flex items-center justify-center p-8 overflow-y-auto relative">
                     <button onClick={() => setPreviewTemplate(null)} className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-sm text-slate-500 hover:text-navy cursor-pointer md:hidden z-10">
                        <X className="h-5 w-5" />
                     </button>
                     <div className="w-[400px] h-[565px] bg-white shadow-2xl shadow-indigo-900/10 scale-90 sm:scale-100 transform-gpu relative border border-slate-200/50">
                        {TemplateRenders[previewTemplate.renderType as keyof typeof TemplateRenders]()}
                     </div>
                  </div>
                  
                  {/* Right Side - Details */}
                  <div className="w-full md:w-[35%] bg-white p-8 lg:p-12 flex flex-col relative overflow-y-auto">
                     <button onClick={() => setPreviewTemplate(null)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-navy bg-slate-50 hover:bg-slate-100 rounded-full transition-colors cursor-pointer hidden md:block">
                        <X className="h-5 w-5" />
                     </button>
                     
                     <div className="mt-8 mb-8">
                        <div className="flex items-center gap-3 mb-3">
                           <h2 className="text-4xl font-display font-bold text-navy">{previewTemplate.name}</h2>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                           <span className="text-xs font-bold px-3 py-1.5 bg-primary/10 text-primary uppercase tracking-wider rounded-md">{previewTemplate.type}</span>
                           <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 uppercase tracking-wider rounded-md border border-emerald-100 border-dashed">ATS Optimized: {previewTemplate.score}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed font-medium">A meticulously crafted resume template focusing on readability and structural flow, ensuring recruitment software parses you perfectly.</p>
                     </div>

                     <div className="mb-8">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Template Features</h4>
                        <ul className="space-y-4">
                           {previewTemplate.features.map((feat: string, i: number) => (
                              <li key={i} className="flex items-center gap-3">
                                 <div className="p-1 rounded-full bg-indigo-50 text-primary">
                                    <Check className="h-3 w-3" />
                                 </div>
                                 <span className="text-slate-700 font-semibold text-sm">{feat}</span>
                              </li>
                           ))}
                        </ul>
                     </div>

                     <div className="mt-auto pt-6 border-t border-slate-100 space-y-3">
                        <Button 
                          onClick={() => navigate('/builder', { state: { templateId: previewTemplate.renderType } })}
                          className="w-full h-14 text-base shadow-[0_4px_14px_rgba(99,102,241,0.3)]">Use This Template</Button>
                        <Button variant="outline" onClick={() => setPreviewTemplate(null)} className="w-full h-14 text-base bg-white border-slate-200">Back to Gallery</Button>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
