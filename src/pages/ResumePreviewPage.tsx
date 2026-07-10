import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { motion } from "motion/react";
import { ArrowLeft, Download, Printer, FileText, Loader2, FileDown, AlertCircle, X } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import { getResume, ResumeData, defaultResumeData, incrementDownloadCount } from "../lib/resumeService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ResumeRenderer } from "../components/ResumeRenderer";
import { generateDocx } from "../lib/docxExporter";
import { Analytics } from "../lib/analytics";

export function ResumePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useContext(AuthContext);

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [templateId, setTemplateId] = useState<string>("modern");
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!currentUser || !id) return;
      try {
        const doc = await getResume(currentUser.uid, id);
        if (doc) {
          setResumeData(doc.data);
          setTemplateId(doc.templateId || "modern");
        }
      } catch (err) {
        console.error("Failed to load resume for preview", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, currentUser]);

  const handleDownloadPDF = async () => {
    const printArea = document.getElementById("resume-print-area");
    if (!printArea || !resumeData) return;

    setDownloadingPdf(true);
    setDownloadError(null);
    try {
      const canvas = await html2canvas(printArea, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/jpeg", 0.8);
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate how much of the canvas corresponds to one PDF page
      const canvasPageHeight = (canvas.width / pdfWidth) * pdfPageHeight;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // First page
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfPageHeight;
      
      // Add new pages until the content ends (with a 5mm tolerance to avoid empty trailing pages from decimal margins)
      while (heightLeft > 5) {
        position = position - pdfPageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfPageHeight;
      }
      
      pdf.save(`${resumeData.name.replace(/\s+/g, "_") || "Resume"}.pdf`);
      if (currentUser && id) {
        await incrementDownloadCount(currentUser.uid, id);
      }
      Analytics.resumeDownloaded('pdf');
    } catch (error: any) {
      console.error("Error generating PDF", error);
      setDownloadError("Failed to generate PDF. You can also try printing directly to PDF using your browser's Print dialog.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadDOCX = async () => {
    if (!resumeData) return;
    setDownloadingDocx(true);
    setDownloadError(null);
    try {
      await generateDocx(resumeData, `${resumeData.name.replace(/\s+/g, "_") || "Resume"}.docx`);
      if (currentUser && id) {
        await incrementDownloadCount(currentUser.uid, id);
      }
      Analytics.resumeDownloaded('docx');
    } catch(err: any) {
      console.error("Error downloading docx", err);
      setDownloadError("Failed to generate DOCX file: " + (err.message || String(err)));
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
     return (
        <div className="flex min-h-screen flex-col bg-slate-900 font-sans">
           <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                 <div className="h-9 w-32 bg-slate-800 rounded animate-pulse" />
              </div>
           </header>
           <main className="flex-1 overflow-y-auto p-8 sm:p-12 lg:p-16 flex justify-center items-start">
              <div className="w-[210mm] min-h-[297mm] bg-slate-800/50 rounded animate-pulse shadow-2xl flex flex-col p-12 space-y-6">
                 <div className="w-1/3 h-10 bg-slate-700/50 rounded mx-auto mb-4" />
                 <div className="w-full h-4 bg-slate-700/50 rounded" />
                 <div className="w-5/6 h-4 bg-slate-700/50 rounded" />
                 <div className="w-4/6 h-4 bg-slate-700/50 rounded" />
                 <div className="mt-8 space-y-4">
                    <div className="w-1/4 h-6 bg-slate-700/50 rounded" />
                    <div className="w-full h-24 bg-slate-700/50 rounded" />
                    <div className="w-full h-24 bg-slate-700/50 rounded" />
                 </div>
              </div>
           </main>
        </div>
     );
  }

  if (!resumeData) {
     return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 font-sans text-white space-y-4">
           <p className="font-bold text-xl">Resume not found.</p>
           <Link to="/dashboard"><Button variant="outline" className="text-white border-slate-700">Back to Dashboard</Button></Link>
        </div>
     );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-900 font-sans print:bg-white print:block">
      {/* Toolbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur-xl print:hidden">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" className="text-slate-300 hover:bg-slate-800 hover:text-white border-transparent bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="h-6 w-px bg-slate-700" />
          <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Resume Preview
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handlePrint} variant="outline" className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownloadDOCX} disabled={downloadingDocx} variant="outline" className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white">
            {downloadingDocx ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
            Download DOCX
          </Button>
          <Button onClick={handleDownloadPDF} disabled={downloadingPdf} className="bg-primary text-white hover:bg-[#4F46E5] hover:-translate-y-[1px]">
            {downloadingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Download PDF
          </Button>
        </div>
      </header>

      {/* Download Error Alert */}
      {downloadError && (
        <div className="mx-6 mt-4 p-4 bg-red-950/80 border border-red-500/30 rounded-xl flex items-start gap-3 text-white print:hidden animate-in fade-in duration-200">
          <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-200">Download Failed</p>
            <p className="text-xs text-red-300/80 mt-0.5 leading-relaxed">{downloadError}</p>
          </div>
          <button 
            onClick={() => setDownloadError(null)} 
            className="p-1 text-red-400 hover:text-red-200 hover:bg-red-800/30 rounded-full transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Canvas Area */}
      <main className="flex-1 overflow-y-auto p-8 sm:p-12 lg:p-16 flex justify-center print:p-0 print:m-0 print:h-full print:w-full">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
           className="w-[210mm] print:w-[210mm] print:h-[297mm] overflow-hidden bg-white shadow-2xl shadow-black/50 print:shadow-none print:m-0"
        >
           <div id="resume-print-area" className="w-[210mm] min-h-[297mm] bg-white">
              <ResumeRenderer data={resumeData} template={templateId} />
           </div>
        </motion.div>
      </main>
    </div>
  );
}
