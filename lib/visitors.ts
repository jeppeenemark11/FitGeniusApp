import { v4 as uuidv4 } from 'uuid';
import { db } from '@/utils/firebase';
import { collection, addDoc, setDoc, doc, query, where, getDocs, Timestamp } from 'firebase/firestore';

const VISITOR_ID_KEY = 'fitgenius_visitor_id';

export const getOrCreateVisitorId = () => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);

  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }

  return visitorId;
};

export const trackVisitor = async () => {
  const visitorId = getOrCreateVisitorId();
  const now = Timestamp.now();
  const visitorDocRef = doc(db, 'visitors', visitorId);

  try {
    // Use setDoc with merge to update the timestamp if the document exists, or create it if it doesn't
    await setDoc(visitorDocRef, { timestamp: now }, { merge: true });
  } catch (error) {
    console.error('Error tracking visitor: ', error);
  }
};

export const getVisitorCount = async (timeFrame = 24 * 60 * 60 * 1000) => {
  const now = Timestamp.now();
  const timeAgo = Timestamp.fromDate(new Date(now.toDate().getTime() - timeFrame));
  const visitorsRef = collection(db, 'visitors');
  
  const q = query(visitorsRef, where('timestamp', '>=', timeAgo));
  const snapshot = await getDocs(q);

  return snapshot.size;
};
