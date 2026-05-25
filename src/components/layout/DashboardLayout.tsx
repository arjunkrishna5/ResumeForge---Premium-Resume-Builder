import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Settings, LogOut, Plus, Sparkles, User } from "lucide-react";
import { cn } from "../../lib/utils";

export function DashboardLayout() {
  const location = useLocation();

  const navItems = [
    { name: "My Resumes", href: "/dashboard", icon: FileText },
    { name: "Templates", href: "/templates", icon: LayoutDashboard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white hidden md:flex md:flex-col">
        <div className="flex h-16 items-center px-6 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-navy">
              ResumeForge
            </span>
          </Link>
        </div>
        
        <div className="p-4">
          <Link to="/builder" className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)] hover:-translate-y-[1px] transition-all duration-200 mb-6">
            <Plus className="h-4 w-4" />
            New Resume
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-slate-100 text-navy" 
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

        <div className="mt-auto p-4 border-t border-slate-200">
          <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-navy transition-colors w-full">
            <LogOut className="h-4 w-4 text-slate-400" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-end border-b border-slate-200 bg-white/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8">
           <div className="flex items-center gap-4">
             <span className="text-sm font-medium text-slate-700">Alex Carter</span>
             <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300">
                <User className="h-4 w-4 text-slate-500" />
             </div>
           </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
