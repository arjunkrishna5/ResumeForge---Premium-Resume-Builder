import { motion, AnimatePresence } from "motion/react";
import { X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { templates } from "../data/templates";
import { TemplateRenders } from "./TemplateRenders";
import { Button } from "./ui/Button";

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatePickerModal({ isOpen, onClose }: TemplatePickerModalProps) {
  const navigate = useNavigate();

  const handleSelect = (templateId: string | null) => {
    onClose();
    if (templateId) {
      navigate('/builder', { state: { templateId } });
    } else {
      navigate('/builder');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 backdrop-blur-md p-4 sm:p-6"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 shrink-0 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
              <div>
                <h2 className="text-2xl font-display font-bold text-navy">Choose a Template</h2>
                <p className="text-sm text-slate-500 font-medium">Start with any template — you can change it later</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-slate-400 hover:text-navy hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content / Grid */}
            <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                
                {/* Start from Scratch Option */}
                <div 
                  onClick={() => handleSelect(null)}
                  className="group flex flex-col justify-center items-center rounded-2xl border-2 border-dashed border-slate-300 bg-white hover:bg-indigo-50/50 hover:border-primary transition-all duration-200 p-6 text-center shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 h-[320px]"
                >
                  <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white text-primary shadow-sm transition-all duration-300 border border-slate-200 group-hover:border-primary">
                    <Plus className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-navy text-lg leading-tight">Blank Resume</h3>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Start from scratch</p>
                </div>

                {/* Templates list */}
                {templates.map((template) => {
                  const RenderComp = TemplateRenders[template.renderType as keyof typeof TemplateRenders];
                  return (
                    <div 
                      key={template.id}
                      className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 h-[320px]"
                    >
                      <div className="h-[180px] bg-slate-100 p-4 flex items-center justify-center relative overflow-hidden">
                        <div className="w-[110px] h-[155px] bg-white shadow-md transform-gpu group-hover:scale-105 transition-transform duration-500 border border-slate-200/50">
                          {RenderComp && <RenderComp />}
                        </div>
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-navy text-base leading-tight mb-1">{template.name}</h3>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-snug mb-3 flex-1">{template.description}</p>
                        
                        <Button 
                          onClick={() => handleSelect(template.renderType)} 
                          className="w-full text-xs h-9 py-0 group-hover:bg-primary group-hover:text-white bg-slate-50 text-slate-700 border-slate-200"
                          variant="outline"
                        >
                          Use This Template
                        </Button>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
