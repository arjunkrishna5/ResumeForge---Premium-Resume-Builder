import { ArrowRight, CheckCircle2, LayoutDashboard, Sparkles, Download, Upload, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { motion } from "motion/react";

export function LandingPage() {
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white -z-10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="show" variants={container} className="max-w-3xl mx-auto">
            <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm bg-white">
              <Sparkles className="h-4 w-4" />
              <span>ResumeForge AI is now live</span>
            </motion.div>
            <motion.h1 variants={item} className="font-display text-4xl font-bold tracking-tight text-navy sm:text-6xl lg:text-7xl mb-6">
              Build a resume that <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">opens doors.</span>
            </motion.h1>
            <motion.p variants={item} className="text-lg leading-relaxed text-slate-600 mb-10 max-w-2xl mx-auto">
              Craft professional, ATS-optimized resumes in minutes with our intelligent builder. Not just another template—a strategic narrative for your career.
            </motion.p>
            <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 relative">
              <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-8 bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full shadow-sm rotate-12 z-10 hidden sm:block">100% Free</div>
              <Link to="/dashboard" className="w-full sm:w-auto relative group">
                <Button size="lg" className="w-full sm:w-auto h-14 text-base px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/templates" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 bg-white text-base px-8 text-slate-700">
                  View Templates
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl mb-4">Everything you need to stand out</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Powerful tools designed to help you build a compelling professional narrative.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "AI-Powered Writing", desc: "Beat writer's block. Let our AI suggest bullet points tailored to your role and industry." },
              { icon: LayoutDashboard, title: "Pro Templates", desc: "Over 20+ meticulously crafted templates that balance design with ATS readability." },
              { icon: Upload, title: "Import Existing", desc: "Upload your dusty PDF or DOCX. We'll extract the data and map it to a fresh modern layout." },
              { icon: Download, title: "Universal Export", desc: "Download in pixel-perfect PDF format or DOCX when job portals demand it." },
              { icon: CheckCircle2, title: "ATS-Optimized", desc: "Our templates are rigorously tested to parse correctly in Workday, Greenhouse, and more." },
              { icon: Sparkles, title: "100% Free", desc: "Get started without a credit card. Build, preview, and download a beautiful resume today." }
            ].map((feat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-primary/20 hover:shadow-xl hover:shadow-indigo-50/50 transition-all hover:-translate-y-1"
              >
                <div className="h-12 w-12 rounded-lg bg-indigo-50 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner text-sm"><feat.icon className="h-6 w-6" /></div>
                <h3 className="text-xl font-bold text-navy mb-3">{feat.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works / About */}
      <section id="about" className="py-24 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col items-center text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl mb-6">Create your resume in minutes, not hours</h2>
              <p className="text-lg text-slate-600 font-medium mb-12 max-w-2xl">Our streamlined process focuses on extracting your best work, while we handle the formatting and design.</p>
              
              <div className="space-y-8 w-full text-left">
                {[
                  { step: "01", title: "Answer simple prompts", desc: "Drop in your experience or let our guided forms pull your career story out of you." },
                  { step: "02", title: "Let AI refine", desc: "Our AI enhances your bullet points to emphasize impact, metrics, and action verbs." },
                  { step: "03", title: "Export and apply", desc: "Choose a template, customize colors, and download instantly." }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all">
                    <div className="flex-shrink-0"><div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">{item.step}</div></div>
                    <div>
                      <h4 className="text-xl font-bold text-navy mb-2">{item.title}</h4>
                      <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>



      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 to-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent -z-0" />
        <div className="mx-auto max-w-4xl px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-8 tracking-tight">Ready to land your dream job?</h2>
          <Link to="/dashboard"><Button size="lg" className="bg-white text-navy hover:bg-slate-50 border-none h-14 px-10 text-base sm:text-lg hover:shadow-[0_4px_24px_rgba(255,255,255,0.25)]">Start Building Now</Button></Link>
        </div>
      </section>
    </div>
  );
}
