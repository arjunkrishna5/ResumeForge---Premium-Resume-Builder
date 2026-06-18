import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, orderBy, Timestamp, increment } from "firebase/firestore";
import { db, auth } from "./firebase";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface ExperienceItem {
  id: string; title: string; company: string; startDate: string; endDate: string; current: boolean; description: string; type?: string;
}

export interface EducationItem {
  id: string; institution: string; degree: string; field: string; startYear: string; endYear: string; grade: string; gpa?: string; coursework?: string; honors?: string;
}

export interface ProjectItem {
  id: string; name: string; description: string; techStack: string[]; liveUrl: string; githubUrl: string; isAcademic?: boolean;
}

export interface CertificationItem {
  name: string; issuer: string; date: string;
}

export interface AchievementItem {
  title: string; subtitle: string; date: string;
}

export interface ResumeData {
  userType?: 'student' | 'professional';
  name: string; role: string; email: string; phone: string; location: string; linkedin: string; portfolio: string; summary: string;
  experience: ExperienceItem[]; education: EducationItem[]; technicalSkills: string[]; softSkills: string[]; projects: ProjectItem[];
  certifications?: CertificationItem[];
  achievements?: AchievementItem[];
  coverLetterInfo?: { jobTitle: string; company: string; tone: string };
  coverLetter?: string;
}

export interface ResumeDocument {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  data: ResumeData;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completion: number;
  downloadCount?: number;
}

export interface ActivityDocument {
  id: string;
  action: string;
  resumeTitle: string;
  timestamp: Timestamp;
}

export const defaultResumeData: ResumeData = {
  name: "", role: "", email: "", phone: "", location: "", linkedin: "", portfolio: "", summary: "",
  experience: [], education: [], technicalSkills: [], softSkills: [], projects: [], certifications: [], achievements: []
};

// Collection structure: users/{userId}/resumes/{resumeId}
function getUserResumesRef(userId: string) {
  return collection(db, "users", userId, "resumes");
}

function getUserActivityRef(userId: string) {
  return collection(db, "users", userId, "activity");
}

export async function logActivity(userId: string, action: string, resumeTitle: string) {
  try {
    const actRef = doc(getUserActivityRef(userId));
    await setDoc(actRef, {
      action,
      resumeTitle,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error("Failed to log activity", error);
  }
}

export async function getUserActivity(userId: string): Promise<ActivityDocument[]> {
  try {
    const q = query(getUserActivityRef(userId), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityDocument));
  } catch (error) {
    console.error("Failed to fetch activity", error);
    return [];
  }
}

function mockTimestamp(dateInput: any): any {
  if (!dateInput) {
    const now = new Date();
    return {
      toDate: () => now,
      seconds: Math.floor(now.getTime() / 1000),
      nanoseconds: (now.getTime() % 1000) * 1000000
    };
  }
  if (dateInput.toDate && typeof dateInput.toDate === "function") return dateInput;
  
  const d = dateInput.seconds !== undefined 
    ? new Date(dateInput.seconds * 1000) 
    : (dateInput instanceof Date ? dateInput : new Date(dateInput));
    
  return {
    toDate: () => d,
    seconds: Math.floor(d.getTime() / 1000),
    nanoseconds: (d.getTime() % 1000) * 1000000
  };
}

const serializeTimestamp = (ts: any) => {
  if (!ts) {
    return { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 };
  }
  if (ts.seconds !== undefined) {
    return { seconds: ts.seconds, nanoseconds: ts.nanoseconds || 0 };
  }
  const d = ts.toDate ? ts.toDate() : (ts instanceof Date ? ts : new Date(ts));
  return { seconds: Math.floor(d.getTime() / 1000), nanoseconds: (d.getTime() % 1000) * 1000000 };
};

export async function getUserResumes(userId: string): Promise<ResumeDocument[]> {
  try {
    const q = query(getUserResumesRef(userId), orderBy("updatedAt", "desc"));
    const getPromise = getDocs(q);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore list timed out")), 2000)
    );
    const snapshot = await Promise.race([getPromise, timeoutPromise]);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      updatedAt: mockTimestamp(doc.data().updatedAt),
      createdAt: mockTimestamp(doc.data().createdAt)
    } as ResumeDocument));
  } catch (error) {
    console.warn("Firestore fetch failed, checking localStorage fallback:", error);
    try {
      const localKey = `resumes_${userId}`;
      const localDataRaw = localStorage.getItem(localKey);
      if (localDataRaw) {
        const localResumes = JSON.parse(localDataRaw);
        return Object.values(localResumes).map((doc: any) => ({
          ...doc,
          updatedAt: mockTimestamp(doc.updatedAt),
          createdAt: mockTimestamp(doc.createdAt)
        })).sort((a: any, b: any) => 
          b.updatedAt.seconds - a.updatedAt.seconds
        ) as ResumeDocument[];
      }
    } catch (err) {
      console.error("Local storage fetch failed:", err);
    }
    return [];
  }
}

export async function getResume(userId: string, resumeId: string): Promise<ResumeDocument | null> {
  const path = `users/${userId}/resumes/${resumeId}`;
  try {
    const docRef = doc(db, "users", userId, "resumes", resumeId);
    const getPromise = getDoc(docRef);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore get timed out")), 2000)
    );
    const snapshot = await Promise.race([getPromise, timeoutPromise]);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
        updatedAt: mockTimestamp(snapshot.data().updatedAt),
        createdAt: mockTimestamp(snapshot.data().createdAt)
      } as ResumeDocument;
    }
  } catch (error) {
    console.warn("Firestore get failed, checking localStorage fallback:", error);
  }

  try {
    const localKey = `resumes_${userId}`;
    const localDataRaw = localStorage.getItem(localKey);
    if (localDataRaw) {
      const localResumes = JSON.parse(localDataRaw);
      const doc = localResumes[resumeId];
      if (doc) {
        return {
          ...doc,
          updatedAt: mockTimestamp(doc.updatedAt),
          createdAt: mockTimestamp(doc.createdAt)
        } as ResumeDocument;
      }
    }
  } catch (err) {
    console.error("Local storage read failed:", err);
  }
  return null;
}

export async function saveResume(userId: string, resumeId: string | null, data: ResumeData, templateId: string = "modern"): Promise<string> {
  const path = `users/${userId}/resumes/${resumeId || 'new'}`;
  const id = resumeId || `local_${Math.random().toString(36).substring(7)}`;
  const title = (data.name || data.role) ? `${data.name}${data.name && data.role ? ' - ' : ''}${data.role}` : "Untitled Resume";
  
  // Basic completion calc (naive)
  let filledFields = 0;
  let totalFields = 8; // Basic fields
  if(data.name) filledFields++; if(data.role) filledFields++; if(data.email) filledFields++; if(data.phone) filledFields++;
  if(data.location) filledFields++; if(data.linkedin) filledFields++; if(data.portfolio) filledFields++; if(data.summary) filledFields++;
  if(data.experience.length > 0) { filledFields++; totalFields++; }
  if(data.education.length > 0) { filledFields++; totalFields++; }
  if(data.technicalSkills.length > 0) { filledFields++; totalFields++; }
  if(data.projects.length > 0) { filledFields++; totalFields++; }
  const completion = Math.round((filledFields / totalFields) * 100);

  const now = Timestamp.now();
  const payload: Partial<ResumeDocument> = {
    userId,
    title,
    data,
    updatedAt: now,
    completion,
    templateId
  };

  let isNew = !resumeId;
  if (isNew) {
    payload.createdAt = now;
  }

  // 1. Attempt Firestore write with a 2-second timeout
  try {
    const collectionRef = getUserResumesRef(userId);
    const docRef = resumeId ? doc(collectionRef, resumeId) : doc(collectionRef);
    const targetId = docRef.id;

    if (isNew) {
      await logActivity(userId, "created", title);
    } else {
      await logActivity(userId, "updated", title);
    }

    const writePromise = setDoc(docRef, payload, { merge: true });
    const timeoutPromise = new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore write timed out")), 2000)
    );
    await Promise.race([writePromise, timeoutPromise]);
    
    // Also mirror to localStorage to maintain a backup
    try {
      const localKey = `resumes_${userId}`;
      const localDataRaw = localStorage.getItem(localKey);
      const localResumes = localDataRaw ? JSON.parse(localDataRaw) : {};
      
      const localPayload = {
        ...payload,
        id: targetId,
        updatedAt: serializeTimestamp(now),
        createdAt: isNew ? serializeTimestamp(now) : serializeTimestamp(localResumes[targetId]?.createdAt || now)
      };
      
      localResumes[targetId] = localPayload;
      localStorage.setItem(localKey, JSON.stringify(localResumes));
    } catch (e) {
      console.warn("Failed to mirror save to localStorage:", e);
    }

    return targetId;
  } catch (error) {
    console.warn("Firestore save failed or timed out. Falling back to local storage.", error);
  }

  // 2. Fallback to localStorage save
  try {
    const localKey = `resumes_${userId}`;
    const localDataRaw = localStorage.getItem(localKey);
    const localResumes = localDataRaw ? JSON.parse(localDataRaw) : {};
    
    const localPayload = {
      ...payload,
      id,
      updatedAt: serializeTimestamp(now),
      createdAt: isNew ? serializeTimestamp(now) : serializeTimestamp(localResumes[id]?.createdAt || now)
    };
    
    localResumes[id] = localPayload;
    localStorage.setItem(localKey, JSON.stringify(localResumes));
    
    await logActivity(userId, isNew ? "created (offline)" : "updated (offline)", title);
    return id;
  } catch (err) {
    console.error("Local storage fallback save failed:", err);
    throw new Error("Failed to save resume locally.");
  }
}

export async function deleteResume(userId: string, resumeId: string): Promise<void> {
  const path = `users/${userId}/resumes/${resumeId}`;
  
  // 1. Try Firestore delete with timeout
  try {
    const docSnap = await getDoc(doc(db, "users", userId, "resumes", resumeId));
    if (docSnap.exists()) {
      const data = docSnap.data() as ResumeDocument;
      await logActivity(userId, "deleted", data.title || "Resume");
    }
    const deletePromise = deleteDoc(doc(db, "users", userId, "resumes", resumeId));
    const timeoutPromise = new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore delete timed out")), 2000)
    );
    await Promise.race([deletePromise, timeoutPromise]);
  } catch (error) {
    console.warn("Firestore delete failed or timed out. Removing from local storage.", error);
  }

  // 2. Always delete from localStorage fallback as well
  try {
    const localKey = `resumes_${userId}`;
    const localDataRaw = localStorage.getItem(localKey);
    if (localDataRaw) {
      const localResumes = JSON.parse(localDataRaw);
      if (localResumes[resumeId]) {
        delete localResumes[resumeId];
        localStorage.setItem(localKey, JSON.stringify(localResumes));
      }
    }
  } catch (err) {
    console.error("Local storage delete failed:", err);
  }
}

export async function duplicateResume(userId: string, resumeId: string): Promise<string> {
  const existing = await getResume(userId, resumeId);
  if (!existing) throw new Error("Resume not found");
  
  const title = `Copy of ${existing.title}`;
  const now = Timestamp.now();
  const newId = `local_${Math.random().toString(36).substring(7)}`;

  // 1. Try Firestore duplicate
  try {
    const newRef = doc(getUserResumesRef(userId));
    const targetId = newRef.id;
    const newResume = {
      ...existing,
      title,
      createdAt: now,
      updatedAt: now
    };
    delete (newResume as any).id;
    
    await logActivity(userId, "duplicated", title);
    
    const writePromise = setDoc(newRef, newResume);
    const timeoutPromise = new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore duplicate timed out")), 2000)
    );
    await Promise.race([writePromise, timeoutPromise]);
    
    // Mirror to local storage
    try {
      const localKey = `resumes_${userId}`;
      const localDataRaw = localStorage.getItem(localKey);
      const localResumes = localDataRaw ? JSON.parse(localDataRaw) : {};
      
      localResumes[targetId] = {
        ...newResume,
        id: targetId,
        createdAt: serializeTimestamp(now),
        updatedAt: serializeTimestamp(now)
      };
      localStorage.setItem(localKey, JSON.stringify(localResumes));
    } catch (e) {
      console.warn("Failed to mirror duplicate to local storage:", e);
    }
    
    return targetId;
  } catch (error) {
    console.warn("Firestore duplicate failed or timed out. Duplicating in local storage.", error);
  }

  // 2. Local storage duplicate fallback
  try {
    const localKey = `resumes_${userId}`;
    const localDataRaw = localStorage.getItem(localKey);
    const localResumes = localDataRaw ? JSON.parse(localDataRaw) : {};
    
    const newResume = {
      ...existing,
      id: newId,
      title,
      createdAt: serializeTimestamp(now),
      updatedAt: serializeTimestamp(now)
    };
    
    localResumes[newId] = newResume;
    localStorage.setItem(localKey, JSON.stringify(localResumes));
    
    await logActivity(userId, "duplicated (offline)", title);
    return newId;
  } catch (err) {
    console.error("Local storage duplicate fallback failed:", err);
    throw new Error("Failed to duplicate resume.");
  }
}

export async function incrementDownloadCount(userId: string, resumeId: string): Promise<void> {
  try {
    const docRef = doc(db, "users", userId, "resumes", resumeId);
    const writePromise = setDoc(docRef,
      { downloadCount: increment(1), updatedAt: Timestamp.now() },
      { merge: true }
    );
    const timeoutPromise = new Promise<void>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore increment timed out")), 1500)
    );
    await Promise.race([writePromise, timeoutPromise]);
  } catch (error) {
    console.error("Failed to track download", error);
  }
}
