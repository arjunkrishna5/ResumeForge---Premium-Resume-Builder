import { User, Shield, Bell, Trash2, Camera, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { updateProfile } from "firebase/auth";

export function SettingsPage() {
  const { currentUser } = useContext(AuthContext);
  
  const [name, setName] = useState(currentUser?.displayName || "");
  const [phone, setPhone] = useState("");
  
  const [profileSaved, setProfileSaved] = useState(false);
  const [toggles, setToggles] = useState([true, false, true]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || "");
    }
  }, [currentUser]);

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    try {
      if (name !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: name
        });
      }
      setProfileSaved(true);
      setTimeout(() => {
        setProfileSaved(false);
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const currentPrefs = [
    { title: 'Email Notifications', desc: 'Receive emails about updates and new features.' },
    { title: 'Download Reminders', desc: 'Remind me to download my latest resume draft.' },
    { title: 'Weekly Resume Tips', desc: 'Get expert tips on improving your resume and career.' }
  ];

  const handleToggle = (index: number) => {
    const newToggles = [...toggles];
    newToggles[index] = !newToggles[index];
    setToggles(newToggles);
  };

  const initial = name ? name.charAt(0).toUpperCase() : currentUser?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
         <h1 className="text-3xl font-display font-bold text-navy mb-1 tracking-tight">Settings</h1>
         <p className="text-slate-500 font-medium text-sm">Manage your account preferences and settings.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
         <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Profile</h2>
         <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-3">
               <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-dashed border-slate-300 text-primary relative overflow-hidden group">
                  <span className="text-3xl font-bold font-display">{initial}</span>
                  <div className="absolute inset-0 bg-navy/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                     <Camera className="h-6 w-6 text-white" />
                  </div>
               </div>
               <Button variant="outline" size="sm" className="bg-white border-slate-200 shadow-sm text-xs font-semibold px-4"><Upload className="h-3 w-3 mr-2" /> Upload Avatar</Button>
            </div>
            <div className="flex-1 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                     <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-colors text-sm" />
                  </div>
                  <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email</label>
                     <input type="email" value={currentUser?.email || ""} disabled className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 focus:outline-none transition-colors text-sm cursor-not-allowed" />
                  </div>
                  <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Phone</label>
                     <input type="tel" placeholder="Add your phone number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-colors text-sm" />
                  </div>
               </div>
               <div className="flex items-center gap-4">
                   <Button onClick={handleSaveProfile}>Save Profile</Button>
                   {profileSaved && (
                     <span className="text-sm font-medium text-emerald-600 flex items-center gap-1.5 animate-in fade-in duration-300">
                        <CheckCircle2 className="h-4 w-4" /> Profile updated successfully
                     </span>
                   )}
               </div>
            </div>
         </div>
      </div>

      {/* Account Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
         <h2 className="text-lg font-bold text-navy flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Security</h2>
         <p className="text-xs text-amber-600 mb-4 font-medium bg-amber-50 p-2 rounded border border-amber-100 flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 shrink-0" />
            Email/Password login must be enabled in your Firebase console under Authentication → Sign-in methods.
         </p>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-colors text-sm" />
             </div>
             <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10 transition-colors text-sm" />
             </div>
         </div>
         <Button variant="outline" className="mb-8 bg-white border-slate-200 shadow-sm text-slate-700">Update Password</Button>

         <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
             <div>
                <h3 className="font-bold text-navy">Delete Account</h3>
                <p className="text-sm text-slate-500">Permanently delete your account and all resumes.</p>
             </div>
             <Button variant="danger" className="shrink-0 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 shadow-sm"><Trash2 className="h-4 w-4 mr-2" /> Delete Account</Button>
         </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
         <h2 className="text-lg font-bold text-navy mb-4 flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Preferences</h2>
         <div className="space-y-6">
            {currentPrefs.map((pref, i) => (
               <div key={i} className="flex items-center justify-between">
                  <div>
                     <h4 className="font-semibold text-navy text-sm">{pref.title}</h4>
                     <p className="text-xs text-slate-500">{pref.desc}</p>
                  </div>
                  <div 
                    onClick={() => handleToggle(i)}
                    className={`w-10 h-6 rounded-full relative cursor-pointer shadow-inner transition-colors duration-300 ${toggles[i] ? 'bg-primary' : 'bg-slate-300'}`}
                  >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${toggles[i] ? 'right-1' : 'left-1'}`}></div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
