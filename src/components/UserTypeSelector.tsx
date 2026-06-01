import { GraduationCap, Briefcase } from "lucide-react";

interface UserTypeSelectorProps {
  onSelect: (type: 'student' | 'professional') => void;
}

export function UserTypeSelector({ onSelect }: UserTypeSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6">
      <div className="absolute top-8 left-8 flex items-center">
        <div className="h-8 w-8 bg-primary text-white rounded-lg flex items-center justify-center mr-3 font-display font-bold">R</div>
        <h1 className="text-xl font-display font-bold text-navy tracking-tight">ResumeForge</h1>
      </div>
      
      <div className="max-w-4xl w-full text-center mb-12">
        <h2 className="text-4xl font-display font-bold text-navy mb-4">What best describes you?</h2>
        <p className="text-lg text-slate-500">We'll customize the builder for your needs</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full">
        <button
          onClick={() => onSelect('student')}
          className="flex-1 p-8 text-left bg-white border-2 border-slate-200 rounded-2xl hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all group relative"
        >
          <div className="h-14 w-14 bg-indigo-50 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold text-navy mb-4">Student / Fresh Graduate</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start"><span className="mr-2 text-primary">•</span> Education-first resume structure</li>
            <li className="flex items-start"><span className="mr-2 text-primary">•</span> Sections for internships & projects</li>
            <li className="flex items-start"><span className="mr-2 text-primary">•</span> Academic achievements & competitions</li>
            <li className="flex items-start"><span className="mr-2 text-primary">•</span> Coursework & certifications</li>
            <li className="flex items-start"><span className="mr-2 text-primary">•</span> Clubs and extracurriculars</li>
          </ul>
        </button>

        <button
          onClick={() => onSelect('professional')}
          className="flex-1 p-8 text-left bg-white border-2 border-slate-200 rounded-2xl hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all group relative"
        >
          <div className="h-14 w-14 bg-indigo-50 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
            <Briefcase className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold text-navy mb-4">Working Professional</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start"><span className="mr-2 text-primary">•</span> Experience-first resume structure</li>
            <li className="flex items-start"><span className="mr-2 text-primary">•</span> Quantified achievements & impact</li>
            <li className="flex items-start"><span className="mr-2 text-primary">•</span> Career progression highlight</li>
            <li className="flex items-start"><span className="mr-2 text-primary">•</span> Leadership & management sections</li>
            <li className="flex items-start"><span className="mr-2 text-primary">•</span> Industry certifications & skills</li>
          </ul>
        </button>
      </div>

      <div className="mt-12 flex flex-col items-center">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Step 0 of 7</p>
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-primary"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
}
