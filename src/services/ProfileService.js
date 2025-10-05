import { collection, query, where, getDocs, limit, startAfter } from 'firebase/firestore';
import { db } from '../config/firebase';

class ProfileService {
  async getProfiles(currentUserGender, lastDoc = null, limitCount = 5) {
    try {
      // Query opposite gender
      const oppositeGender = currentUserGender === 'male' ? 'female' : 'male';

      console.log('🔍 ProfileService: Querying for gender:', oppositeGender);

      let q = query(
        collection(db, 'users'),
        where('profileData.gender', '==', oppositeGender),
        where('profileCompleted', '==', true), // Only get completed profiles
        limit(limitCount)
      );

      // Pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      console.log('📊 ProfileService: Query returned', snapshot.size, 'documents');

      const profiles = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log('📄 ProfileService: Document data:', doc.id, JSON.stringify(data, null, 2));
        
        if (!data || !data.profileData) {
          console.error('❌ ProfileService: doc.data() or profileData is undefined for doc:', doc.id);
          return;
        }

        const profileData = data.profileData;
        
        // Validate required fields
        if (!profileData.displayName && !data.displayName) {
          console.error('❌ ProfileService: No displayName found for doc:', doc.id);
          return;
        }
        
        const profile = {
          id: doc.id,
          // Map profileData fields to the expected structure with fallbacks
          displayName: profileData.displayName || data.displayName || 'Unknown',
          name: profileData.displayName || data.displayName || 'Unknown',
          age: profileData.age || null,
          height: profileData.height || null,
          gender: profileData.gender || 'unknown',
          nationality: profileData.nationality || null,
          residenceCountry: profileData.residenceCountry || null,
          residenceCity: profileData.residenceCity || null,
          maritalStatus: profileData.maritalStatus || null,
          religion: profileData.religion || null,
          madhhab: profileData.madhhab || null,
          educationLevel: profileData.educationLevel || null,
          workStatus: profileData.workStatus || null,
          aboutMe: profileData.aboutMe || null,
          idealPartner: profileData.idealPartner || null,
          photos: profileData.photos || [],
          firstPhoto: profileData.photos && profileData.photos.length > 0 ? profileData.photos[0] : null,
          createdAt: data.createdAt || profileData.completedAt || new Date().toISOString(),
          // Add other fields as needed
          country: profileData.residenceCountry?.countryName || '',
          city: profileData.residenceCity || '',
          description: profileData.aboutMe || '',
          about: profileData.aboutMe || ''
        };
        
        console.log('📝 ProfileService: Created profile:', profile.id, 'displayName:', profile.displayName);
        profiles.push(profile);
      });

      // Sort profiles by createdAt on the client side to avoid index requirement
      profiles.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // Newest first
      });

      return {
        profiles,
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
        hasMore: snapshot.docs.length === limitCount // If we got exactly the limit, there might be more
      };
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return { profiles: [], lastDoc: null, hasMore: false };
    }
  }

  // Get initial profiles (first 5)
  async getInitialProfiles(currentUserGender) {
    return this.getProfiles(currentUserGender, null, 5);
  }

  // Get more profiles (next 5)
  async getMoreProfiles(currentUserGender, lastDoc) {
    return this.getProfiles(currentUserGender, lastDoc, 5);
  }
}

export default new ProfileService();
