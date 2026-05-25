import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, LogOut, Plus, Sparkles, User, Search, Home, Edit3, Bell } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "motion/react";

export function DashboardLayout() {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Resumes", href: "/dashboard", icon: FileText, exact: true }, // For highlight purposes, merging logic
    { name: "Templates", href: "/templates", icon: LayoutDashboard },
    { name: "Builder", href: "/builder", icon: Edit3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  // Derive page title
  let pageTitle = "Dashboard";
  if (location.pathname.startsWith("/templates")) pageTitle = "Templates";
  if (location.pathname.startsWith("/builder")) pageTitle = "Resume Builder";
  if (location.pathname.startsWith("/settings")) pageTitle = "Settings";

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar - Fixed 240px */}
      <aside className="hidden w-[240px] flex-col border-r border-slate-200 bg-white md:flex flex-shrink-0 z-20">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-white transition-transform group-hover:scale-105 group-hover:rotate-3">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-navy">
              ResumeForge
            </span>
          </Link>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <Link to="/builder" className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:-translate-y-[1px] transition-all duration-200 mb-6 cursor-pointer">
            <Plus className="h-4 w-4" />
            New Resume
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              // Special case for dashboard vs my resumes
              let isActive = false;
              if (item.name === "Dashboard" && location.pathname === "/dashboard") isActive = true;
              else if (item.name !== "Dashboard" && item.name !== "My Resumes" && location.pathname.startsWith(item.href)) isActive = true;

              // Skip duplicate rendering visually if we want 'My Resumes' specifically inside dashboard
              if (item.name === "My Resumes") return null;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
                    isActive 
                      ? "bg-indigo-50 text-primary font-semibold" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-navy"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-slate-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="shrink-0 p-4 border-t border-slate-200">
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-navy transition-colors w-full cursor-pointer">
            <LogOut className="h-4 w-4 text-slate-400" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-xl z-10 sticky top-0">
           <div className="flex items-center">
              <h1 className="text-lg font-bold text-navy">{pageTitle}</h1>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="relative hidden sm:block w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-primary/10 transition-colors"
                />
             </div>
             
             <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-navy transition-colors cursor-pointer">
               <Bell className="h-5 w-5" />
               <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
             </button>

             <div className="h-6 w-px bg-slate-200 mx-1"></div>

             <div className="flex items-center gap-3 group cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-colors">
               <div className="hidden md:flex flex-col items-end">
                 <span className="text-sm font-semibold text-slate-700 leading-tight">Alex Johnson</span>
                 <span className="text-xs text-slate-500 font-medium">Free Plan</span>
               </div>
               <div className="h-9 w-9 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border border-slate-200">
                  <User className="h-4 w-4 text-primary" />
               </div>
             </div>
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
