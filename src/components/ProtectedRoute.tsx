import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Sparkles } from "lucide-react";

export function ProtectedRoute() {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center mb-4">
           <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
           <div className="h-16 w-16 flex items-center justify-center bg-white rounded-full z-10 m-2 shadow-sm">
             <Sparkles className="h-6 w-6 text-primary" />
           </div>
        </div>
        <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Loading Workspace</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  return <Outlet />;
}
