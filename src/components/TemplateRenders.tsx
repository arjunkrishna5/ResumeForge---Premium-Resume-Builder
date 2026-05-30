import React from "react";

export const TemplateRenders = {
  modern: () => (
    <div className="w-full h-full bg-white border border-slate-200 flex flex-col p-3 text-[4px] leading-tight overflow-hidden pointer-events-none">
      <div className="border-b border-navy pb-1 mb-1.5 text-center">
        <div className="font-bold text-[6px] text-navy uppercase tracking-wider">Name Surname</div>
        <div className="text-primary font-semibold mt-0.5 tracking-widest uppercase">Professional Title</div>
        <div className="flex justify-center gap-1 text-[3px] text-slate-500 mt-1"><span>info@email.com</span> <span className="uppercase tracking-widest">• Location</span></div>
      </div>
      <div className="mb-1.5"><div className="text-slate-700 text-justify">Professional summary goes here. Describes key achievements.</div></div>
      <div className="flex-1">
        <div className="font-bold uppercase border-b border-slate-200 mb-1 text-slate-800">Experience</div>
        <div className="mb-1">
          <div className="flex justify-between"><span className="font-bold">Company</span><span className="text-slate-500 text-[3px]">Date</span></div>
          <div className="text-primary">Role</div>
          <div className="h-[2px] w-[80%] bg-slate-200 mt-0.5"></div>
          <div className="h-[2px] w-[60%] bg-slate-200 mt-0.5"></div>
        </div>
      </div>
    </div>
  ),
  minimal: () => (
    <div className="w-full h-full bg-[#FAFAFA] border border-slate-200 flex flex-col p-3 text-[4px] leading-tight overflow-hidden pointer-events-none">
      <div className="mb-2"><div className="font-light text-[6px] text-slate-800 tracking-tight">NAME SURNAME</div><div className="text-[3px] text-slate-500 mt-0.5">Title • Email • Phone</div></div>
      <div className="grid grid-cols-[1fr_2fr] gap-2 flex-1">
        <div><div className="font-medium text-slate-800 mb-1">SKILLS</div><div className="h-[2px] w-full bg-slate-200 mb-0.5"></div><div className="h-[2px] w-[80%] bg-slate-200 mb-0.5"></div></div>
        <div>
          <div className="font-medium text-slate-800 mb-1">EXPERIENCE</div>
          <div className="mb-1.5"><div className="font-medium">Role</div><div className="text-[3px] text-slate-500">Company • Date</div><div className="h-[2px] w-full bg-slate-200 mt-0.5"></div></div>
        </div>
      </div>
    </div>
  ),
  creative: () => (
    <div className="w-full h-full bg-slate-900 border border-slate-800 flex text-[4px] leading-tight overflow-hidden text-slate-300 pointer-events-none">
      <div className="w-[30%] bg-indigo-600 p-2"><div className="w-4 h-4 rounded-full bg-indigo-400 mb-2"></div><div className="font-bold text-[4px] text-white uppercase mb-2">NAME</div><div className="h-[2px] w-full bg-indigo-400 mb-0.5"></div></div>
      <div className="w-[70%] p-2 flex flex-col"><div className="mb-2"><div className="font-bold text-white uppercase border-b border-slate-700 pb-[1px] mb-1">Profile</div><div className="h-[2px] w-full bg-slate-700"></div></div><div className="flex-1"><div className="font-bold text-white uppercase border-b border-slate-700 pb-[1px] mb-1">Work</div><div className="font-bold text-indigo-400">Company</div></div></div>
    </div>
  ),
  executive: () => (
    <div className="w-full h-full bg-white border-t-[6px] border-navy flex flex-col p-3 text-[4px] leading-tight overflow-hidden pointer-events-none shadow-inner">
      <div className="flex justify-between items-end border-b-2 border-slate-300 pb-1 mb-2">
         <div className="font-serif text-[7px] text-slate-900 font-bold">Name Surname</div>
         <div className="text-[3px] text-slate-500 text-right">Email<br/>Phone</div>
      </div>
      <div className="font-serif font-bold text-slate-800 border-b border-slate-200 mb-1">EXECUTIVE SUMMARY</div>
      <div className="h-[2px] w-full bg-slate-200 mb-0.5"></div><div className="h-[2px] w-[90%] bg-slate-200 mb-2"></div>
      <div className="font-serif font-bold text-slate-800 border-b border-slate-200 mb-1">PROFESSIONAL EXPERIENCE</div>
      <div><div className="font-bold">Corp Inc</div><div className="h-[2px] w-full bg-slate-200 mt-1"></div></div>
    </div>
  ),
  zenith: () => (
    <div className="w-full h-full bg-white border border-slate-200 flex flex-col p-3 text-[4px] leading-tight overflow-hidden pointer-events-none">
      <div className="pb-1 mb-1">
        <div className="font-bold text-[6px] text-slate-900">Name Surname</div>
        <div className="text-slate-600 mt-0.5">Professional Title</div>
        <div className="text-[3px] text-slate-500 mt-0.5">info@email.com • Location</div>
      </div>
      <div className="mb-1.5">
        <div className="font-bold text-[4px] uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1">Skills</div>
        <div className="flex gap-0.5"><span className="bg-slate-100 px-1 rounded">React</span><span className="bg-slate-100 px-1 rounded">Node</span></div>
      </div>
      <div className="flex-1">
        <div className="font-bold text-[4px] uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1">Experience</div>
        <div className="mb-1">
          <div className="font-bold text-slate-800">Role • Company</div>
          <div className="h-[2px] w-[80%] bg-slate-200 mt-0.5"></div>
        </div>
      </div>
    </div>
  ),
  monogram: () => (
    <div className="w-full h-full bg-white border border-slate-200 flex flex-col p-3 text-[4px] leading-tight overflow-hidden pointer-events-none">
      <div className="border-l-[2px] border-indigo-600 pl-1.5 mb-2">
        <div className="font-bold text-[7px] text-slate-900">Name Surname</div>
        <div className="text-slate-500 mt-0.5">Professional Title</div>
      </div>
      <div className="flex gap-1 text-[3px] text-slate-500 mb-1.5">info@email.com • Location</div>
      <div className="h-[1px] w-full bg-slate-200 mb-1.5"></div>
      <div className="flex-1">
        <div className="font-bold text-[4px] text-indigo-600 uppercase mb-1">Experience</div>
        <div className="mb-1">
          <div className="font-bold text-slate-800">Role - Company</div>
          <div className="h-[2px] w-[80%] bg-slate-200 mt-0.5"></div>
        </div>
      </div>
    </div>
  ),
  compact: () => (
    <div className="w-full h-full bg-white border border-slate-200 flex flex-col p-2 text-[3.5px] leading-[1.1] overflow-hidden pointer-events-none">
      <div className="flex justify-between items-baseline mb-1">
        <div className="font-bold text-[5px] text-slate-900">Name Surname <span className="font-normal text-slate-600">| Title</span></div>
        <div className="text-[3px] text-slate-500">info@email.com • Location</div>
      </div>
      <div className="font-bold text-[3.5px] uppercase border-b-[0.5px] border-slate-300 mb-0.5">Experience</div>
      <div className="mb-0.5">
        <div className="flex justify-between"><span className="font-bold">Company - Role</span><span>Date</span></div>
        <div className="h-[1.5px] w-[90%] bg-slate-200 mt-0.5"></div>
      </div>
      <div className="mb-0.5">
        <div className="flex justify-between"><span className="font-bold">Company - Role</span><span>Date</span></div>
        <div className="h-[1.5px] w-[90%] bg-slate-200 mt-0.5"></div>
      </div>
      <div className="font-bold text-[3.5px] uppercase border-b-[0.5px] border-slate-300 mt-1 mb-0.5">Skills</div>
      <div className="text-slate-600">React, Node, TypeScript, Management</div>
    </div>
  ),
  gradient: () => (
    <div className="w-full h-full bg-white border border-slate-200 flex flex-col text-[4px] leading-tight overflow-hidden pointer-events-none">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 shadow-sm text-center">
        <div className="font-bold text-[6px] text-white">Name Surname</div>
        <div className="text-indigo-100 mt-0.5">Professional Title</div>
        <div className="text-[3px] text-indigo-200 mt-1">info@email.com • Location</div>
      </div>
      <div className="p-3 flex-1">
        <div className="font-bold text-[4px] text-indigo-600 mb-1">Experience</div>
        <div className="mb-1">
          <div className="font-bold text-slate-800">Role</div>
          <div className="text-slate-500 text-[3px]">Company</div>
          <div className="h-[2px] w-[80%] bg-slate-200 mt-0.5"></div>
        </div>
      </div>
    </div>
  ),
  scholar: () => (
    <div className="w-full h-full bg-white border border-slate-200 flex flex-col p-3 text-[4px] leading-tight overflow-hidden pointer-events-none">
      <div className="text-center mb-2">
        <div className="font-serif font-bold text-[6px] text-slate-900">Name Surname</div>
        <div className="text-[3px] text-slate-600 mt-0.5">info@email.com • Location</div>
      </div>
      <div className="mb-1.5">
        <div className="font-bold uppercase border-b border-slate-300 mb-1 pb-0.5 text-center">Education</div>
        <div className="flex justify-between font-bold text-slate-800"><span>University</span><span>Date</span></div>
        <div className="text-slate-600">Degree • GPA: 4.0</div>
      </div>
      <div className="flex-1">
        <div className="font-bold uppercase border-b border-slate-300 mb-1 pb-0.5 text-center">Projects</div>
        <div className="mb-1">
          <div className="font-bold text-slate-800">Project Name</div>
          <div className="h-[2px] w-[80%] bg-slate-200 mt-0.5"></div>
        </div>
      </div>
    </div>
  ),
  claude: () => (
    <div className="w-full h-full bg-white border border-slate-200 flex flex-col p-3 text-[4px] leading-tight overflow-hidden pointer-events-none">
      <div className="mb-1">
        <div className="font-bold text-[6.5px] tracking-tight text-slate-900">Name Surname</div>
        <div className="font-medium text-[3.5px] text-indigo-500 uppercase tracking-widest mt-0.5">Professional Title</div>
      </div>
      <div className="h-[0.5px] w-full bg-slate-800 mb-0.5"></div>
      <div className="text-[3px] text-slate-600 mb-1.5">info@email.com | Location | LinkedIn</div>
      
      <div className="mb-1.5">
        <div className="font-bold text-[3px] uppercase tracking-widest border-b-[0.5px] border-slate-300 pb-[1px] mb-1">Experience</div>
        <div className="flex justify-between items-baseline"><span className="font-semibold text-slate-900">Role</span><span className="text-[3px] text-slate-500">Date</span></div>
        <div className="font-medium text-[3px] text-indigo-500 mb-0.5">Company</div>
        <div className="h-[1.5px] w-[90%] bg-slate-200 mt-0.5"></div>
        <div className="h-[1.5px] w-[80%] bg-slate-200 mt-0.5"></div>
      </div>
      
      <div>
        <div className="font-bold text-[3px] uppercase tracking-widest border-b-[0.5px] border-slate-300 pb-[1px] mb-1">Skills</div>
        <div className="text-[3px]"><span className="font-semibold">Technical:</span> React, TypeScript</div>
      </div>
    </div>
  )
};
