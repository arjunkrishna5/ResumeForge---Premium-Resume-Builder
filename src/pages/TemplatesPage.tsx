import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Sparkles, Filter, ChevronDown, Check, X, Heart } from "lucide-react";
import { Button } from "../components/ui/Button";

// Dummy resume HTML renders matching Dashboard
const TemplateRenders = {
  modern: () => (
    <div className="w-full h-full bg-white border border-slate-200 flex flex-col p-3 text-[4px] leading-tight overflow-hidden pointer-events-none">
      <div className="border-b border-navy pb-1 mb-1.5 text-center">
        <div className="font-bold text-[6px] text-navy uppercase tracking-wider">Name Surname</div>
        <div className="text-primary font-semibold mt-0.5 tracking-widest uppercase">Professional Title</div>
        <div className="flex justify-center gap-1 text-[3px] text-slate-500 mt-1 uppercase">info@email.com • Location</div>
      </div>
      <div className="mb-1.5"><div className="text-slate-700 text-justify">Professional summary goes here. Describes key achievements.</div></div>
      <div className="flex-1">
        <div className="font-bold uppercase border-b border-slate-200 mb-1 text-slate-800">Experience</div>
        <div className="mb-1">
          <div className="flex justify-between"><span className="font-bold">Company</span><span className="text-slate-500 text-[3px]">Date</span></div>
          <div className="text-primary">Role</div>
          <div className="h-[2px] w-[80%] bg-slate-200 mt-0.5"></div>
          <div className="h-[2px] w-[60%] bg-slate-200 mt-0.5"></div>
        </div>
      </div>
    </div>
  ),
  minimal: () => (
    <div className="w-full h-full bg-[#FAFAFA] border border-slate-200 flex flex-col p-3 text-[4px] leading-tight overflow-hidden pointer-events-none">
      <div className="mb-2"><div className="font-light text-[6px] text-slate-800 tracking-tight">NAME SURNAME</div><div className="text-[3px] text-slate-500 mt-0.5">Title • Email • Phone</div></div>
      <div className="grid grid-cols-[1fr_2fr] gap-2 flex-1">
        <div><div className="font-medium text-slate-800 mb-1">SKILLS</div><div className="h-[2px] w-full bg-slate-200 mb-0.5"></div><div className="h-[2px] w-[80%] bg-slate-200 mb-0.5"></div></div>
        <div>
          <div className="font-medium text-slate-800 mb-1">EXPERIENCE</div>
          <div className="mb-1.5"><div className="font-medium">Role</div><div className="text-[3px] text-slate-500">Company • Date</div><div className="h-[2px] w-full bg-slate-200 mt-0.5"></div></div>
        </div>
      </div>
    </div>
  ),
  creative: () => (
    <div className="w-full h-full bg-slate-900 border border-slate-800 flex text-[4px] leading-tight overflow-hidden text-slate-300 pointer-events-none">
      <div className="w-[30%] bg-indigo-600 p-2"><div className="w-4 h-4 rounded-full bg-indigo-400 mb-2"></div><div className="font-bold text-[4px] text-white uppercase mb-2">NAME</div><div className="h-[2px] w-full bg-indigo-400 mb-0.5"></div></div>
      <div className="w-[70%] p-2 flex flex-col"><div className="mb-2"><div className="font-bold text-white uppercase border-b border-slate-700 pb-[1px] mb-1">Profile</div><div className="h-[2px] w-full bg-slate-700"></div></div><div className="flex-1"><div className="font-bold text-white uppercase border-b border-slate-700 pb-[1px] mb-1">Work</div><div className="font-bold text-indigo-400">Company</div></div></div>
    </div>
  ),
  executive: () => (
    <div className="w-full h-full bg-white border-t-[6px] border-navy flex flex-col p-3 text-[4px] leading-tight overflow-hidden pointer-events-none shadow-inner">
      <div className="flex justify-between items-end border-b-2 border-slate-300 pb-1 mb-2">
         <div className="font-serif text-[7px] text-slate-900 font-bold">Name Surname</div>
         <div className="text-[3px] text-slate-500 text-right">Email<br/>Phone</div>
      </div>
      <div className="font-serif font-bold text-slate-800 border-b border-slate-200 mb-1">EXECUTIVE SUMMARY</div>
      <div className="h-[2px] w-full bg-slate-200 mb-0.5"></div><div className="h-[2px] w-[90%] bg-slate-200 mb-2"></div>
      <div className="font-serif font-bold text-slate-800 border-b border-slate-200 mb-1">PROFESSIONAL EXPERIENCE</div>
      <div><div className="font-bold">Corp Inc</div><div className="h-[2px] w-full bg-slate-200 mt-1"></div></div>
    </div>
  )
};

export function TemplatesPage() {
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

  const templates = [
    { id: 1, name: "Nexus", type: "Modern", price: "Free", score: "96%", renderType: "modern", features: ["1-column layout", "Photo optional", "High readability"] },
    { id: 2, name: "Atlas", type: "Executive", price: "Premium", score: "99%", renderType: "executive", features: ["Traditional format", "Space optimized", "ATS ideal"] },
    { id: 3, name: "Meridian", type: "Minimal", price: "Free", score: "98%", renderType: "minimal", features: ["Clean typography", "Focus on content", "2-column option"] },
    { id: 4, name: "Apex", type: "Creative", price: "Premium", score: "85%", renderType: "creative", features: ["Dark mode base", "Avatar support", "Skill bars"] },
    { id: 5, name: "Nova", type: "Modern", price: "Premium", score: "94%", renderType: "modern", features: ["Timeline bullets", "Accent colors", "Modern serif"] },
    { id: 6, name: "Slate", type: "Creative", price: "Free", score: "88%", renderType: "creative", features: ["Sidebar block", "Icon support", "Visual headers"] },
    { id: 7, name: "Prism", type: "Minimal", price: "Premium", score: "97%", renderType: "minimal", features: ["Ultra clean", "Large headings", "Subtle borders"] },
    { id: 8, name: "Vertex", type: "Executive", price: "Premium", score: "99%", renderType: "executive", features: ["C-Level focused", "Dense data presentation", "Classic Serif"] },
    { id: 9, name: "Core", type: "Modern", price: "Free", score: "95%", renderType: "modern", features: ["Versatile use", "Clear hierarchy", "San-serif body"] },
  ];

  const filtered = activeCategory === "All" ? templates : templates.filter(t => t.type === activeCategory || (activeCategory === "ATS-Friendly" && parseInt(t.score) > 94));

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Filter Bar */}
      <div className="flex flex-col gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm z-10 sticky top-0 relative">
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
             <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer">
                <Filter className="h-4 w-4" />
                Sort: Popular <ChevronDown className="h-4 w-4 ml-1" />
             </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
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
          {filtered.map((template, i) => {
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
                  
                  {/* Badge */}
                   {template.price === 'Premium' && (
                      <div className="absolute top-4 left-4 z-10 bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1.5 uppercase tracking-wide">
                        <Sparkles className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> Premium
                      </div>
                   )}
                   {template.price === 'Free' && (
                      <div className="absolute top-4 left-4 z-10 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-md shadow-sm uppercase tracking-wide">
                        Free
                      </div>
                   )}

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
                           {previewTemplate.price === 'Premium' && (
                              <Sparkles className="h-5 w-5 fill-amber-400 text-amber-500" />
                           )}
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
                        <Button className="w-full h-14 text-base shadow-[0_4px_14px_rgba(99,102,241,0.3)]">Use This Template</Button>
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
