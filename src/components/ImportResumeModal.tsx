import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { parseResumeFile } from "../lib/resumeParser";
import { useNavigate } from "react-router-dom";

interface ImportResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportResumeModal({ isOpen, onClose }: ImportResumeModalProps) {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.pdf') && !selectedFile.name.endsWith('.docx')) {
      setError("Please upload a PDF or DOCX file.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const parsedData = await parseResumeFile(file);
      onClose();
      navigate('/builder', { state: { importedData: parsedData } });
    } catch (err: any) {
      console.error("Failed to parse resume", err);
      setError(err.message || "Failed to parse resume. Please try again or fill manually.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFile(null);
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 bg-navy/40 backdrop-blur-sm"
           onClick={handleClose}
        />
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg z-10 relative overflow-hidden"
        >
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="text-2xl font-display font-bold text-navy mb-2">Import Existing Resume</h2>
          <p className="text-sm text-slate-500 mb-6 tracking-wide">
            Upload your PDF or DOCX and we'll extract your information automatically.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-start gap-2 text-sm">
               <AlertCircle className="h-5 w-5 shrink-0" />
               <p>{error}</p>
            </div>
          )}

          {!file ? (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                isHovering ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
              }`}
            >
              <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                 onChange={handleFileChange}
              />
              <div className={`p-4 rounded-full mb-4 ${isHovering ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                <UploadCloud className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-navy mb-1">Click to browse or drag and drop</h3>
              <p className="text-xs font-medium text-slate-400">Supported formats: PDF, DOCX (Max 5MB)</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between bg-slate-50">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white rounded-lg border border-slate-200 text-primary shrink-0">
                    <FileText className="h-6 w-6" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-navy line-clamp-1">{file.name}</p>
                    <p className="text-xs font-medium text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                 </div>
               </div>
               {!loading && (
                 <button onClick={() => setFile(null)} className="text-xs font-bold text-red-500 hover:text-red-600 px-2 py-1">
                    Remove
                 </button>
               )}
               {loading && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
            </div>
          )}

          <div className="mt-8 flex gap-3">
             <Button variant="outline" onClick={handleClose} disabled={loading} className="flex-1 border-slate-200 text-slate-600">Cancel</Button>
             <Button onClick={handleImport} disabled={!file || loading} className="flex-1">
                {loading ? (
                   <>
                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                     Extracting...
                   </>
                ) : "Extract & Import"}
             </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
