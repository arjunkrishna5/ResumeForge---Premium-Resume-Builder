import { ArrowRight, CheckCircle2, FileVideo, Sparkles, FileText, Download, Upload, Zap, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { motion } from "motion/react";

export function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white -z-10" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial="hidden" 
            animate="show" 
            variants={container}
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>ResumeForge AI is now live</span>
            </motion.div>
            
            <motion.h1 variants={item} className="font-display text-5xl font-bold tracking-tight text-navy sm:text-6xl lg:text-7xl mb-6">
              Build a resume that <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">opens doors.</span>
            </motion.h1>
            
            <motion.p variants={item} className="text-lg leading-relaxed text-slate-600 mb-10 max-w-2xl mx-auto">
              Craft professional, ATS-optimized resumes in minutes with our intelligent builder. Not just another template—a strategic narrative for your career.
            </motion.p>
            
            <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/builder">
                <Button size="lg" className="w-full sm:w-auto h-14 group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 bg-white">
                  View Templates
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
            className="relative mx-auto mt-20 max-w-5xl"
          >
            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-2 backdrop-blur-3xl shadow-2xl shadow-indigo-100/50">
              <div className="rounded-lg border border-slate-100 bg-white overflow-hidden flex aspect-video shadow-sm">
                {/* Mockup UI Sidebar */}
                <div className="w-1/3 border-r border-slate-100 bg-slate-50 p-8 flex flex-col gap-6">
                  <div className="h-8 w-2/3 rounded-md bg-slate-200 animate-pulse" />
                  <div className="space-y-3">
                    <div className="h-4 w-full rounded-md bg-slate-200 animate-pulse" />
                    <div className="h-4 w-5/6 rounded-md bg-slate-200 animate-pulse" />
                    <div className="h-4 w-4/6 rounded-md bg-slate-200 animate-pulse" />
                  </div>
                  <div className="mt-8 h-10 w-full rounded-lg bg-primary/20 animate-pulse" />
                </div>
                {/* Mockup Resume View */}
                <div className="w-2/3 p-10 flex flex-col gap-8 bg-white">
                   <div className="border-b border-slate-100 pb-4">
                      <div className="h-10 w-1/2 rounded-md bg-slate-200 mb-3" />
                      <div className="flex gap-4">
                         <div className="h-3 w-20 rounded bg-slate-100" />
                         <div className="h-3 w-24 rounded bg-slate-100" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="h-3 w-full rounded bg-slate-100" />
                      <div className="h-3 w-5/6 rounded bg-slate-100" />
                      <div className="h-3 w-full rounded bg-slate-100" />
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl mb-4">Everything you need to stand out</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Powerful tools designed to help you build a compelling professional narrative.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "AI-Powered Writing", desc: "Beat writer's block. Let our AI suggest bullet points tailored to your role and industry." },
              { icon: LayoutDashboard, title: "Pro Templates", desc: "Over 20+ meticulously crafted templates that balance design with ATS readability." },
              { icon: Upload, title: "Import Existing", desc: "Upload your dusty PDF or DOCX. We'll extract the data and map it to a fresh modern layout." },
              { icon: Download, title: "Universal Export", desc: "Download in pixel-perfect PDF format or DOCX when job portals demand it." },
              { icon: CheckCircle2, title: "ATS-Optimized", desc: "Our templates are rigorously tested to parse correctly in Workday, Greenhouse, and more." },
              { icon: Sparkles, title: "Free Forever Plan", desc: "Get started without a credit card. Build, preview, and download a beautiful basic resume." }
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-indigo-50/50 transition-all"
              >
                <div className="h-12 w-12 rounded-lg bg-indigo-50 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-navy mb-3">{feat.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl mb-6">Create your resume in minutes, not hours</h2>
                <p className="text-lg text-slate-600 mb-8">Our streamlined process focuses on extracting your best work, while we handle the formatting and design.</p>
                
                <div className="space-y-8">
                  {[
                    { step: "01", title: "Answer simple prompts", desc: "Drop in your experience or let our guided forms pull your career story out of you." },
                    { step: "02", title: "Let AI refine", desc: "Our AI enhances your bullet points to emphasize impact, metrics, and action verbs." },
                    { step: "03", title: "Export and apply", desc: "Choose a premium template, customize colors, and download instantly." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {item.step}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-navy mb-1">{item.title}</h4>
                        <p className="text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                 <div className="aspect-[4/5] rounded-xl bg-gradient-to-tr from-indigo-100 to-indigo-50 border border-slate-200/50 p-8 shadow-xl">
                    {/* Abstract illustration of ease of use */}
                    <div className="w-full h-full bg-white rounded-lg shadow-sm border border-slate-100 flex flex-col p-6 space-y-4 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-400" />
                       <div className="h-6 w-1/3 bg-slate-100 rounded-md mb-4" />
                       <div className="space-y-2">
                         <div className="h-10 w-full bg-slate-50 rounded border border-slate-100 flex items-center px-4">
                           <div className="h-2 w-2/3 bg-slate-200 rounded" />
                         </div>
                         <div className="h-10 w-full bg-slate-50 rounded border border-slate-100 flex items-center px-4">
                           <div className="h-2 w-1/2 bg-slate-200 rounded" />
                         </div>
                       </div>
                       <div className="mt-auto h-12 w-full bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                          <div className="h-2 w-24 bg-primary/40 rounded" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white relative overflow-hidden">
         <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-indigo-50 blur-3xl opacity-50 pointer-events-none" />
         
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Invest in your career. Upgrade anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             {/* Free Tier */}
             <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 flex flex-col shadow-sm">
                <h3 className="font-display text-2xl font-bold text-navy mb-2">Starter</h3>
                <p className="text-slate-500 mb-6 font-medium">Free forever</p>
                <div className="text-5xl font-bold text-navy mb-8">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {['2 Professional Templates', 'PDF Download', 'Basic AI Suggestions', 'Standard Support'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/builder">
                  <Button variant="outline" className="w-full text-lg h-12">Start Building</Button>
                </Link>
             </div>

             {/* Premium Tier */}
             <div className="rounded-2xl border-2 border-primary bg-navy p-8 sm:p-10 flex flex-col shadow-2xl shadow-indigo-900/20 relative">
                <div className="absolute top-0 aspect-square w-full right-0 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
                <div className="inline-flex absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center rounded-full bg-primary px-4 py-1 text-xs font-semibold text-white tracking-wide uppercase">
                  Most Popular
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-2 relative z-10">Pro</h3>
                <p className="text-slate-400 mb-6 font-medium relative z-10">Maximize your chances</p>
                <div className="text-5xl font-bold text-white mb-8 relative z-10">₹199<span className="text-lg text-slate-400 font-normal">/mo</span></div>
                
                <ul className="space-y-4 mb-8 flex-1 relative z-10">
                  {['All 20+ Premium Templates', 'PDF & DOCX Downloads', 'Advanced AI Content Writer', 'Unlimited Resumes', 'Cover Letter Builder', 'Priority Support'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/builder" className="relative z-10">
                  <Button className="w-full text-lg h-12 bg-white text-navy hover:bg-slate-100">Upgrade to Pro</Button>
                </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
