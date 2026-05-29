import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { motion } from "motion/react";
import { ArrowLeft, Download, Printer, FileText, Loader2, FileDown } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import { getResume, ResumeData, defaultResumeData } from "../lib/resumeService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ResumeRenderer } from "../components/ResumeRenderer";
import { generateDocx } from "../lib/docxExporter";

export function ResumePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useContext(AuthContext);

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [templateId, setTemplateId] = useState<string>("modern");
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);

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
    try {
      const canvas = await html2canvas(printArea, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeData.name.replace(/\s+/g, "_") || "Resume"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadDOCX = async () => {
    if (!resumeData) return;
    setDownloadingDocx(true);
    try {
      await generateDocx(resumeData, `${resumeData.name.replace(/\s+/g, "_") || "Resume"}.docx`);
    } catch(err) {
      console.error("Error downloading docx", err);
    } finally {
      setDownloadingDocx(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
     return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 font-sans">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
