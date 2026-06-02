import { track } from '@vercel/analytics';

export const trackEvent = (
  event: string, 
  properties?: Record<string, string | number | boolean>
) => {
  try {
    track(event, properties);
  } catch (err) {
    // Silently fail — analytics should never break the app
  }
};

// Pre-defined events
export const Analytics = {
  resumeCreated: (templateId: string, userType: string) =>
    trackEvent('resume_created', { templateId, userType }),
    
  resumeDownloaded: (format: 'pdf' | 'docx') =>
    trackEvent('resume_downloaded', { format }),
    
  aiFeatureUsed: (feature: string) =>
    trackEvent('ai_feature_used', { feature }),
    
  templateViewed: (templateName: string) =>
    trackEvent('template_viewed', { templateName }),
    
  resumeImported: (fileType: string) =>
    trackEvent('resume_imported', { fileType }),
    
  userSignedUp: (method: 'google' | 'email') =>
    trackEvent('user_signed_up', { method }),
};
