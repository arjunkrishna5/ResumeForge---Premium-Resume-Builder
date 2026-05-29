import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, orderBy, Timestamp } from "firebase/firestore";
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
  id: string; title: string; company: string; startDate: string; endDate: string; current: boolean; description: string;
}

export interface EducationItem {
  id: string; institution: string; degree: string; field: string; startYear: string; endYear: string; grade: string;
}

export interface ProjectItem {
  id: string; name: string; description: string; techStack: string[]; liveUrl: string; githubUrl: string;
}

export interface ResumeData {
  name: string; role: string; email: string; phone: string; location: string; linkedin: string; portfolio: string; summary: string;
  experience: ExperienceItem[]; education: EducationItem[]; technicalSkills: string[]; softSkills: string[]; projects: ProjectItem[];
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
}

export interface ActivityDocument {
  id: string;
  action: string;
  resumeTitle: string;
  timestamp: Timestamp;
}

export const defaultResumeData: ResumeData = {
  name: "", role: "", email: "", phone: "", location: "", linkedin: "", portfolio: "", summary: "",
  experience: [], education: [], technicalSkills: [], softSkills: [], projects: []
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

export async function getUserResumes(userId: string): Promise<ResumeDocument[]> {
  try {
    const q = query(getUserResumesRef(userId), orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ResumeDocument));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `users/${userId}/resumes`);
    return [];
  }
}

export async function getResume(userId: string, resumeId: string): Promise<ResumeDocument | null> {
  const path = `users/${userId}/resumes/${resumeId}`;
  try {
    const docRef = doc(db, "users", userId, "resumes", resumeId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as ResumeDocument;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveResume(userId: string, resumeId: string | null, data: ResumeData, templateId: string = "modern"): Promise<string> {
  const path = `users/${userId}/resumes/${resumeId || 'new'}`;
  try {
    const collectionRef = getUserResumesRef(userId);
    const docRef = resumeId ? doc(collectionRef, resumeId) : doc(collectionRef);
    
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

    if (!resumeId) {
      payload.createdAt = now;
      await logActivity(userId, "created", title);
    } else {
      await logActivity(userId, "updated", title);
    }

    await setDoc(docRef, payload, { merge: true });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, resumeId ? OperationType.UPDATE : OperationType.CREATE, path);
    return "";
  }
}

export async function deleteResume(userId: string, resumeId: string): Promise<void> {
  const path = `users/${userId}/resumes/${resumeId}`;
  try {
    const docSnap = await getDoc(doc(db, "users", userId, "resumes", resumeId));
    if (docSnap.exists()) {
      const data = docSnap.data() as ResumeDocument;
      await logActivity(userId, "deleted", data.title || "Resume");
    }
    await deleteDoc(doc(db, "users", userId, "resumes", resumeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function duplicateResume(userId: string, resumeId: string): Promise<string> {
  const existing = await getResume(userId, resumeId);
  if (!existing) throw new Error("Resume not found");
  
  const newRef = doc(getUserResumesRef(userId));
  const newResume = {
    ...existing,
    title: `Copy of ${existing.title}`,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };
  delete (newResume as any).id;
  
  await setDoc(newRef, newResume);
  await logActivity(userId, "duplicated", newResume.title);
  return newRef.id;
}
