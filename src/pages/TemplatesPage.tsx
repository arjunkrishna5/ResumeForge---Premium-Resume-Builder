import { motion } from "motion/react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";

export function TemplatesPage() {
  const categories = ["All", "ATS-Friendly", "Creative", "Minimal", "Modern"];
  
  const templates = [
    { id: 1, name: "Oxford", type: "ATS-Friendly", price: "Free", color: "from-slate-700 to-slate-900" },
    { id: 2, name: "Berlin", type: "Modern", price: "Premium", color: "from-indigo-500 to-purple-600" },
    { id: 3, name: "Tokyo", type: "Minimal", price: "Free", color: "from-zinc-200 to-zinc-400" },
    { id: 4, name: "Paris", type: "Creative", price: "Premium", color: "from-rose-400 to-orange-400" },
    { id: 5, name: "Seattle", type: "Modern", price: "Free", color: "from-sky-400 to-blue-600" },
    { id: 6, name: "London", type: "ATS-Friendly", price: "Premium", color: "from-blue-800 to-indigo-900" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy mb-2">Resume Templates</h1>
          <p className="text-slate-500 text-lg">Professionally designed to get you hired.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search templates..." 
            className="w-full pl-10 pr-4 h-11 border border-slate-200 rounded-lg focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 bg-white shadow-sm transition-colors"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat, i) => (
          <button 
            key={cat}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              i === 0 
                ? "bg-navy text-white shadow-sm" 
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template, i) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Thumbnail */}
            <div className="aspect-[1/1.2] bg-slate-100 p-6 relative overflow-hidden flex flex-col">
              <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${template.color}`} />
              
              {/* App Badge */}
               {template.price === 'Premium' && (
                  <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-amber-200 to-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> PRO
                  </div>
               )}

              <div className="h-full w-full bg-white shadow-md border border-slate-200/60 rounded flex flex-col p-4 opacity-90 group-hover:scale-[1.02] transition-transform duration-300 relative z-0">
                <div className={`h-8 w-1/2 rounded bg-gradient-to-r ${template.color} mb-4`} />
                <div className="flex gap-4 mb-4">
                  <div className="w-1/3 space-y-2">
                    <div className="h-2 w-full rounded bg-slate-200" />
                    <div className="h-2 w-3/4 rounded bg-slate-100" />
                  </div>
                  <div className="w-2/3 space-y-2">
                    <div className="h-2 w-full rounded bg-slate-200" />
                    <div className="h-2 w-full rounded bg-slate-100" />
                    <div className="h-2 w-5/6 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="space-y-2 mt-auto">
                   <div className="h-2 w-full rounded bg-slate-100" />
                   <div className="h-2 w-4/5 rounded bg-slate-100" />
                </div>
              </div>

               {/* Overlay action */}
               <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-20">
                 <Button className="shadow-xl">Use This Template</Button>
               </div>
            </div>

            {/* Info */}
            <div className="p-5 flex items-center justify-between border-t border-slate-100 bg-white">
              <div>
                <h3 className="font-semibold text-navy text-lg">{template.name}</h3>
                <p className="text-sm text-slate-500">{template.type}</p>
              </div>
              {template.price === 'Free' && (
                <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">Free</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
