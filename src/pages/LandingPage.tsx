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
            <motion.h1 variants={item} className="font-display text-5xl font-bold tracking-tight text-navy sm:text-6xl lg:text-7xl mb-6">
              Build a resume that <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">opens doors.</span>
            </motion.h1>
            <motion.p variants={item} className="text-lg leading-relaxed text-slate-600 mb-10 max-w-2xl mx-auto">
              Craft professional, ATS-optimized resumes in minutes with our intelligent builder. Not just another template—a strategic narrative for your career.
            </motion.p>
            <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="w-full sm:w-auto h-14 group text-base px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/templates">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 bg-white text-base px-8 text-slate-700">
                  View Templates
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            <div className="rounded-2xl border border-slate-200/50 bg-white/50 p-2 backdrop-blur-3xl shadow-2xl shadow-indigo-100/50 relative text-left">
              <div className="absolute -top-4 right-6 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-bold border border-indigo-200 flex items-center gap-1.5 shadow-sm z-10 uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5" /> AI-Powered
              </div>
              <div className="rounded-xl border border-slate-100 bg-white overflow-hidden flex aspect-video shadow-sm">
                <div className="w-[25%] bg-slate-50 border-r border-slate-100 p-6 sm:flex flex-col gap-4 hidden">
                   {[...Array(6)].map((_, i) => (
                     <div key={i} className={`h-10 rounded-lg flex items-center px-3 ${i === 0 ? 'bg-primary/10 text-primary shadow-sm' : 'text-slate-400'}`}>
                       <div className={`h-4 w-4 rounded-full mr-3 flex items-center justify-center text-[9px] font-bold ${i === 0 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>{i + 1}</div>
                       <div className={`h-2 rounded-full ${i===0?'bg-primary w-20':'bg-slate-200 w-24'}`} />
                     </div>
                   ))}
                </div>
                <div className="w-full sm:w-[75%] p-8 sm:p-10 text-[8px] sm:text-[9px] leading-relaxed flex flex-col bg-slate-100/50 pointer-events-none">
                   <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-200 w-full h-full p-8 flex flex-col overflow-hidden rounded-sm">
                       <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
                         <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase text-slate-900 leading-none tracking-tight">Sarah Jenkins</h1>
                         <h2 className="text-[9px] sm:text-[10px] font-bold uppercase text-primary tracking-[0.2em] mt-2">Senior Product Designer</h2>
                         <div className="flex justify-center gap-3 text-slate-500 mt-2 uppercase tracking-wide font-medium"><span>sarah.j@example.com</span><span>•</span><span>(555) 123-4567</span><span>•</span><span>San Francisco, CA</span></div>
                       </div>
                       <div className="text-slate-700 text-justify mb-5 font-medium leading-[1.6]">Award-winning product designer with 8+ years of experience in creating human-centered digital experiences for fintech and healthcare sectors. Proven track record of improving user retention by 40% and leading high-performing design teams to deliver end-to-end product features that scale seamlessly.</div>
                       <div>
                         <div className="font-bold text-slate-900 text-[9px] sm:text-[10px] uppercase tracking-widest border-b border-slate-200 pb-1 mb-3">Experience</div>
                         <div className="mb-4">
                           <div className="flex justify-between font-bold text-slate-900"><span>Senior Product Designer</span><span className="text-slate-500">2021 - Present</span></div>
                           <div className="text-primary font-bold mt-0.5 mb-1.5">Stripe</div>
                           <ul className="list-disc pl-4 text-slate-700 space-y-1"><li>Led design initiatives for high-impact user interfaces across core payment flows.</li><li>Collaborated with cross-functional technical teams to deliver critical product features.</li></ul>
                         </div>
                         <div>
                           <div className="flex justify-between font-bold text-slate-900"><span>UX Designer</span><span className="text-slate-500">2018 - 2021</span></div>
                           <div className="text-primary font-bold mt-0.5 mb-1.5">Airbnb</div>
                           <ul className="list-disc pl-4 text-slate-700 space-y-1"><li>Improved user retention metrics through data-driven UX improvements.</li></ul>
                         </div>
                       </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <div className="border-y border-slate-100 bg-white py-6 overflow-hidden flex flex-col items-center justify-center -mt-px">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Trusted by professionals hired at</p>
        <div className="flex justify-center flex-wrap gap-8 md:gap-16 opacity-40 grayscale">
          {['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple'].map(company => (
            <div key={company} className="text-xl font-display font-bold text-slate-800 tracking-tight">{company}</div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
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

      {/* How it works */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl mb-6">Create your resume in minutes, not hours</h2>
                <p className="text-lg text-slate-600 font-medium mb-8">Our streamlined process focuses on extracting your best work, while we handle the formatting and design.</p>
                <div className="space-y-8">
                  {[
                    { step: "01", title: "Answer simple prompts", desc: "Drop in your experience or let our guided forms pull your career story out of you." },
                    { step: "02", title: "Let AI refine", desc: "Our AI enhances your bullet points to emphasize impact, metrics, and action verbs." },
                    { step: "03", title: "Export and apply", desc: "Choose a premium template, customize colors, and download instantly." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex-shrink-0 mt-1"><div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shadow-inner">{item.step}</div></div>
                      <div>
                        <h4 className="text-lg font-bold text-navy mb-1">{item.title}</h4>
                        <p className="text-slate-600 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                 <div className="aspect-[4/5] rounded-3xl bg-gradient-to-tr from-indigo-100 to-indigo-50 border border-slate-200/50 p-8 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col p-6 space-y-4 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-400" />
                       <div className="h-6 w-1/3 bg-slate-100 rounded-md mb-4" />
                       <div className="space-y-3 pt-2">
                         <div className="h-12 w-full bg-slate-50 rounded-lg border border-slate-200 shadow-sm flex items-center px-4"><div className="h-2.5 w-2/3 bg-slate-300 rounded-full" /></div>
                         <div className="h-12 w-full bg-slate-50 rounded-lg border border-slate-200 shadow-sm flex items-center px-4"><div className="h-2.5 w-1/2 bg-slate-300 rounded-full" /></div>
                       </div>
                       <div className="mt-auto h-12 w-full bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 text-primary font-bold text-xs uppercase tracking-wider">Generating Magic...</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl mb-4">Don't just take our word for it</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Join thousands of professionals who have transformed their careers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
               { name: "Michael T.", role: "Frontend Developer", init: "M", color: "bg-blue-100 text-blue-700", quote: "The AI bullet point generator completely transformed my resume. I was struggling to quantify my impact, and ResumeForge did it perfectly. Landed interviews at three major tech companies!" },
               { name: "Sarah K.", role: "Product Manager", init: "S", color: "bg-emerald-100 text-emerald-700", quote: "Absolutely love the modern templates. They are clean, professional, and don't get scrambled by ATS systems like my old Canva resume did. Worth every penny for the pro tier." },
               { name: "David L.", role: "Data Analyst", init: "D", color: "bg-purple-100 text-purple-700", quote: "The interface is incredibly intuitive. Being able to see live previews right next to where I type made the whole process take 20 minutes instead of a full weekend." }
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col"
              >
                 <div className="flex items-center gap-4 mb-6">
                    <div className={`h-12 w-12 rounded-full ${t.color} flex items-center justify-center font-bold text-lg`}>{t.init}</div>
                    <div><div className="font-bold text-navy tracking-tight">{t.name}</div><div className="text-sm text-slate-500 font-medium">{t.role}</div></div>
                 </div>
                 <div className="flex gap-1 mb-4 text-amber-400">{[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}</div>
                 <p className="text-slate-700 italic font-medium leading-relaxed">"{t.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
         <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-indigo-50 blur-3xl opacity-50 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Invest in your career. Upgrade anytime.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
             <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 flex flex-col shadow-sm">
                <h3 className="font-display text-2xl font-bold text-navy mb-2">Starter</h3>
                <p className="text-slate-500 mb-6 font-semibold uppercase tracking-wider text-xs">Free forever</p>
                <div className="text-5xl font-bold text-navy mb-8">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-1">
                  {['2 Professional Templates', 'PDF Download', 'Basic AI Suggestions', 'Standard Support'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium"><CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /><span>{feat}</span></li>
                  ))}
                </ul>
                <Link to="/dashboard"><Button variant="outline" className="w-full text-lg h-14 bg-white border-slate-200">Start Building</Button></Link>
             </div>
             <div className="rounded-3xl border-2 border-primary bg-navy p-8 sm:p-10 flex flex-col shadow-2xl shadow-indigo-900/40 relative">
                <div className="absolute top-0 aspect-square w-full right-0 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
                <div className="inline-flex absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white tracking-widest uppercase shadow-sm">Most Popular</div>
                <h3 className="font-display text-2xl font-bold text-white mb-2 relative z-10">Pro</h3>
                <p className="text-slate-400 mb-6 font-semibold uppercase tracking-wider text-xs relative z-10">Maximize your chances</p>
                <div className="text-5xl font-bold text-white mb-8 relative z-10">$15<span className="text-lg text-slate-400 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 flex-1 relative z-10">
                  {['All 20+ Premium Templates', 'PDF & DOCX Downloads', 'Advanced AI Content Writer', 'Unlimited Resumes', 'Cover Letter Builder', 'Priority Support'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 font-medium"><CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" /><span>{feat}</span></li>
                  ))}
                </ul>
                <Link to="/dashboard" className="relative z-10"><Button className="w-full text-lg h-14 bg-white text-navy hover:bg-slate-50 border-transparent">Upgrade to Pro</Button></Link>
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 to-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent -z-0" />
        <div className="mx-auto max-w-4xl px-4 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-white mb-8 tracking-tight">Ready to land your dream job?</h2>
          <Link to="/dashboard"><Button size="lg" className="bg-white text-navy hover:bg-slate-50 border-none h-14 px-10 text-lg hover:shadow-[0_4px_24px_rgba(255,255,255,0.25)]">Start Building Free</Button></Link>
        </div>
      </section>
    </div>
  );
}
