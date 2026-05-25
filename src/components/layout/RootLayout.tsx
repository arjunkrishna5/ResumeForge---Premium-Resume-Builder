import { Link, Outlet } from "react-router-dom";
import { Button } from "../ui/Button";
import { Sparkles, Menu } from "lucide-react";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-surface selection:bg-primary/20 selection:text-navy">
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-white transition-transform group-hover:scale-105 group-hover:bg-primary group-hover:rotate-3">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-navy">
              ResumeForge
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/templates" className="text-sm font-medium text-slate-600 hover:text-navy transition-colors">
              Templates
            </Link>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-navy transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-navy transition-colors">
              Pricing
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/builder">
              <Button>Get Started Free</Button>
            </Link>
          </div>

          <button className="md:hidden p-2 text-slate-600">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-navy text-white">
                  <Sparkles className="h-3 w-3" />
                </div>
                <span className="font-display text-lg font-bold tracking-tight text-navy">
                  ResumeForge
                </span>
              </Link>
              <p className="text-sm text-slate-500 max-w-xs">
                Crafting professional stories that open doors. AI-powered, meticulously designed.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><Link to="/templates" className="hover:text-primary transition-colors">Templates</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-4">Resources</h3>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary transition-colors">Career Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Resume Examples</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-500">© 2026 ResumeForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
