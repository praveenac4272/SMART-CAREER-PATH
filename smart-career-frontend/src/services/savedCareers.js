import { getAuthSession } from './authSession';
import { saveCareerToDb, getSavedCareersFromDb, deleteSavedCareerFromDb } from './api';

const STORAGE_KEY = "savedCareers";

function getLocalSavedCareers() {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    return [];
  }
}

function setLocalSavedCareers(careers) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(careers));
  } catch (err) {}
}

export async function getSavedCareers() {
  const session = getAuthSession();
  const userId = session?.userId;
  
  if (!userId) {
    return getLocalSavedCareers();
  }
  
  try {
    const response = await getSavedCareersFromDb(userId);
    if (response && response.success && Array.isArray(response.saved_careers)) {
      setLocalSavedCareers(response.saved_careers);
      return response.saved_careers;
    }
  } catch (err) {
    console.warn("Failed to fetch saved careers from database, falling back to local storage.", err);
  }
  
  return getLocalSavedCareers();
}

export async function saveCareer(career) {
  const session = getAuthSession();
  const userId = session?.userId;
  
  const saved = getLocalSavedCareers();
  const exists = saved.some((item) => item.title === career.title);
  let updated = saved;
  if (!exists) {
    updated = [...saved, career];
    setLocalSavedCareers(updated);
  }
  
  if (!userId) {
    return updated;
  }
  
  try {
    await saveCareerToDb({
      user_id: userId,
      title: career.title,
      salary: career.salary || 'Suggested by assessment',
      match: career.match || 'N/A',
      description: career.description || '',
      source: career.source || 'manual'
    });
  } catch (err) {
    console.error("Failed to save career to database", err);
  }
  
  return updated;
}

export async function saveCareersBulk(careers) {
  const session = getAuthSession();
  const userId = session?.userId;
  
  const saved = getLocalSavedCareers();
  let updated = [...saved];
  careers.forEach((career) => {
    const exists = updated.some((item) => item.title === career.title);
    if (!exists) {
      updated.push(career);
    }
  });
  setLocalSavedCareers(updated);
  
  if (!userId) {
    return updated;
  }
  
  try {
    await saveCareerToDb({
      user_id: userId,
      careers: careers.map(career => ({
        title: career.title,
        salary: career.salary || 'Suggested by assessment',
        match: career.match || 'N/A',
        description: career.description || '',
        source: career.source || 'manual'
      }))
    });
  } catch (err) {
    console.error("Failed to save careers in bulk to database", err);
  }
  
  return updated;
}

export async function removeSavedCareer(title) {
  const session = getAuthSession();
  const userId = session?.userId;
  
  const saved = getLocalSavedCareers();
  const updated = saved.filter((item) => item.title !== title);
  setLocalSavedCareers(updated);
  
  if (!userId) {
    return updated;
  }
  
  try {
    await deleteSavedCareerFromDb(userId, title);
  } catch (err) {
    console.error("Failed to delete saved career from database", err);
  }
  
  return updated;
}
