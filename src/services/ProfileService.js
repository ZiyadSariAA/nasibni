import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  limit,
  startAfter,
  arrayUnion,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

class ProfileService {
  async getProfiles(currentUserGender, lastDoc = null, limitCount = 5) {
    // Query opposite gender (declared outside try for error logging)
    const oppositeGender = currentUserGender === 'male' ? 'female' : 'male';

    try {
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

        // =========================================
        // DATA NORMALIZATION (Pre-process for UI performance)
        // =========================================

        // Normalize country data - KEEP BOTH ARABIC AND ENGLISH NAMES
        const normalizeCountry = (countryObj) => {
          if (!countryObj) return null;
          if (typeof countryObj === 'string') return countryObj;

          // Preserve both Arabic and English names for language switching
          return {
            nameAr: countryObj.nameAr || countryObj.countryName || '',
            nameEn: countryObj.nameEn || countryObj.countryName || '',
            countryName: countryObj.countryName || countryObj.nameEn || '',
            code: countryObj.alpha2 || countryObj.code || ''
          };
        };

        // Pre-process photos array
        const normalizedPhotos = profileData.photos && Array.isArray(profileData.photos)
          ? profileData.photos.filter(photo => photo && typeof photo === 'string')
          : [];

        const profile = {
          id: doc.id,
          // Core identity
          displayName: profileData.displayName || data.displayName || 'Unknown',
          name: profileData.displayName || data.displayName || 'Unknown',
          age: profileData.age || null,
          gender: profileData.gender || 'unknown',

          // Physical attributes
          height: profileData.height || null,
          weight: profileData.weight || null,
          skinTone: profileData.skinTone || null,

          // Location (pre-normalized)
          nationality: normalizeCountry(profileData.nationality),
          residenceCountry: normalizeCountry(profileData.residenceCountry),
          residenceCity: profileData.residenceCity || null,
          country: profileData.residenceCountry?.countryName ||
                   profileData.residenceCountry?.nameEn || '',
          city: profileData.residenceCity || '',

          // Background & Social
          maritalStatus: profileData.maritalStatus || null,
          religion: profileData.religion || null,
          prayerHabit: profileData.prayerHabit || null,
          educationLevel: profileData.educationLevel || null,
          workStatus: profileData.workStatus || null,
          tribeAffiliation: profileData.tribeAffiliation || null,

          // Marriage Preferences
          marriageTypes: profileData.marriageTypes || [],
          marriagePlan: profileData.marriagePlan || null,
          residenceAfterMarriage: profileData.residenceAfterMarriage || null,

          // Family & Children
          childrenTiming: profileData.childrenTiming || null,
          allowWifeWorkStudy: profileData.allowWifeWorkStudy || null,

          // Financial & Health
          incomeLevel: profileData.incomeLevel || null,
          healthStatus: profileData.healthStatus || [],

          // Lifestyle
          smoking: profileData.smoking || null,
          chatLanguages: profileData.chatLanguages || [],

          // Descriptions
          aboutMe: profileData.aboutMe || null,
          idealPartner: profileData.idealPartner || null,
          description: profileData.aboutMe || '',
          about: profileData.aboutMe || '',

          // Photos (pre-processed)
          photos: normalizedPhotos,
          firstPhoto: normalizedPhotos[0] || null,

          // Metadata
          createdAt: data.createdAt || profileData.completedAt || new Date().toISOString(),
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
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: ProfileService.getProfiles');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Error Code:', error.code);
      console.error('Error Object:', error);
      console.error('Query Gender:', oppositeGender);
      console.error('Limit Count:', limitCount);
      console.error('Has Last Doc:', !!lastDoc);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return { profiles: [], lastDoc: null, hasMore: false };
    }
  }

  // Get initial profiles - REDUCED for faster first paint
  // Load 5 initially (quick first render)
  async getInitialProfiles(currentUserGender) {
    return this.getProfiles(currentUserGender, null, 5);
  }

  // Get more profiles - SMALLER batches for smoother scrolling
  // Load 4 per pagination (less lag, more frequent loads)
  async getMoreProfiles(currentUserGender, lastDoc) {
    return this.getProfiles(currentUserGender, lastDoc, 4);
  }

  /**
   * Record a profile view
   * Updates viewedBy array on viewed user and viewedProfiles array on viewer
   *
   * @param {string} viewerId - User viewing the profile
   * @param {string} viewedUserId - User being viewed
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async recordProfileView(viewerId, viewedUserId) {
    try {
      console.log(`👁️ Recording profile view: ${viewerId} views ${viewedUserId}`);

      // Validate input
      if (!viewerId || !viewedUserId) {
        throw new Error('Both viewer ID and viewed user ID are required');
      }

      if (viewerId === viewedUserId) {
        // Don't record self-views
        return { success: true };
      }

      // Update viewed user's document
      await updateDoc(doc(db, 'users', viewedUserId), {
        viewedBy: arrayUnion(viewerId),
        profileViews: increment(1),
        updatedAt: serverTimestamp()
      });

      // Update viewer's document
      await updateDoc(doc(db, 'users', viewerId), {
        viewedProfiles: arrayUnion(viewedUserId),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Profile view recorded');
      return { success: true };
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: ProfileService.recordProfileView');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Viewer ID:', viewerId);
      console.error('Viewed User ID:', viewedUserId);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return { success: false, error: error.message };
    }
  }

  /**
   * Update user's online status
   *
   * @param {string} userId - User ID
   * @param {boolean} isOnline - Online status
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async updateOnlineStatus(userId, isOnline) {
    try {
      console.log(`🟢 Updating online status for ${userId}: ${isOnline}`);

      await updateDoc(doc(db, 'users', userId), {
        isOnline: isOnline,
        lastActive: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Online status updated');
      return { success: true };
    } catch (error) {
      console.error('Error updating online status:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update user's last active timestamp
   *
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async updateLastActive(userId) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        lastActive: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error updating last active:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get users who viewed this profile
   * Used for "Who Viewed You" tab in People screen
   *
   * @param {string} userId - User ID
   * @param {number} limitCount - Max number of viewers to fetch
   * @returns {Promise<Array>} Array of user profile objects
   */
  async getProfileViewers(userId, limitCount = 50) {
    try {
      console.log(`👁️ Fetching profile viewers for user ${userId}`);

      // Get current user document to get viewedBy array
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const viewedBy = userData.viewedBy || [];

      if (viewedBy.length === 0) {
        console.log('📋 No profile viewers found');
        return [];
      }

      // Get current user's blocked users to filter them out
      const blockedUsers = Array.isArray(userData.blockedUsers) ? userData.blockedUsers : [];
      const blockedBy = Array.isArray(userData.blockedBy) ? userData.blockedBy : [];
      const allBlockedUsers = [...new Set([...blockedUsers, ...blockedBy])].filter(id => id); // Remove null/undefined

      // Filter out blocked users from viewedBy array
      const viewerIds = viewedBy.filter(id => id && !allBlockedUsers.includes(id));

      if (viewerIds.length === 0) {
        console.log('📋 No non-blocked profile viewers found');
        return [];
      }

      // Fetch viewer profiles (limit to first N to avoid large queries)
      const limitedViewerIds = viewerIds.slice(0, limitCount);

      // Fetch all viewer documents
      const viewerProfiles = [];
      for (const viewerId of limitedViewerIds) {
        try {
          const viewerDoc = await getDoc(doc(db, 'users', viewerId));

          if (viewerDoc.exists()) {
            const viewerData = viewerDoc.data();

            // Only include active users with completed profiles
            if (viewerData.accountStatus === 'active' && viewerData.profileCompleted) {
              const profileData = viewerData.profileData || {};

              viewerProfiles.push({
                id: viewerDoc.id,
                displayName: profileData.displayName || viewerData.displayName || 'Unknown',
                age: profileData.age || null,
                photos: viewerData.photos || [],
                firstPhoto: (viewerData.photos && viewerData.photos[0]?.url) || null,
                residenceCountry: profileData.residenceCountry || null,
                residenceCity: profileData.residenceCity || null,
                aboutMe: profileData.aboutMe || null
              });
            }
          }
        } catch (viewerError) {
          console.error(`Error fetching viewer ${viewerId}:`, viewerError);
          // Continue with other viewers
        }
      }

      console.log(`📋 Found ${viewerProfiles.length} profile viewers`);
      return viewerProfiles;
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: ProfileService.getProfileViewers');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('User ID:', userId);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return [];
    }
  }
}

export default new ProfileService();
