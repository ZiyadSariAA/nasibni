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
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import PeopleDataService from './PeopleDataService';

class ProfileService {
  /**
   * Get profiles with real-time updates using onSnapshot
   *
   * @param {string} currentUserGender - Current user's gender ('male' or 'female')
   * @param {DocumentSnapshot|null} lastDoc - Last document for pagination (cursor)
   * @param {number} limitCount - Number of profiles to fetch
   * @param {function} onUpdate - Callback function called when data updates
   * @param {function} onError - Callback function called on error
   * @returns {function} - Unsubscribe function to stop listening
   */
  getProfiles(currentUserGender, lastDoc = null, limitCount = 5, onUpdate, onError) {
    // Query opposite gender (declared outside try for error logging)
    const oppositeGender = currentUserGender === 'male' ? 'female' : 'male';

    try {
      console.log('🔍 ProfileService: Setting up real-time listener for gender:', oppositeGender);

      // Build query
      let q = query(
        collection(db, 'users'),
        where('profileData.gender', '==', oppositeGender),
        where('profileCompleted', '==', true), // Only get completed profiles
        limit(limitCount)
      );

      // Pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
        console.log('📄 ProfileService: Paginating after document:', lastDoc.id);
      }

      // Set up real-time listener
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          // Detect if data is from cache or server
          const fromCache = snapshot.metadata.fromCache;
          const hasPendingWrites = snapshot.metadata.hasPendingWrites;

          console.log('📊 ProfileService: Snapshot received');
          console.log('  - Documents:', snapshot.size);
          console.log('  - From Cache:', fromCache);
          console.log('  - Has Pending Writes:', hasPendingWrites);

          const profiles = [];
          snapshot.forEach(doc => {
            const data = doc.data();

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

            profiles.push(profile);
          });

          // Sort profiles by createdAt on the client side to avoid index requirement
          profiles.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA; // Newest first
          });

          console.log('✅ ProfileService: Processed', profiles.length, 'profiles');

          // Call update callback with results and metadata
          if (onUpdate) {
            onUpdate({
              profiles,
              lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
              hasMore: snapshot.docs.length === limitCount,
              fromCache,
              hasPendingWrites
            });
          }
        },
        (error) => {
          console.error('═══════════════════════════════════════');
          console.error('🔴 ERROR: ProfileService.getProfiles (onSnapshot)');
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

          // Call error callback
          if (onError) {
            onError(error);
          }
        }
      );

      console.log('✅ ProfileService: Real-time listener created');
      return unsubscribe; // Return unsubscribe function for cleanup

    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: ProfileService.getProfiles (setup)');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');

      // Call error callback
      if (onError) {
        onError(error);
      }

      // Return no-op unsubscribe function
      return () => {};
    }
  }

  /**
   * Get initial profiles with real-time updates
   * Load 5 initially for quick first render
   *
   * @param {string} currentUserGender - Current user's gender
   * @param {function} onUpdate - Callback for updates
   * @param {function} onError - Callback for errors
   * @returns {function} - Unsubscribe function
   */
  getInitialProfiles(currentUserGender, onUpdate, onError) {
    return this.getProfiles(currentUserGender, null, 5, onUpdate, onError);
  }

  /**
   * Get more profiles with ONE-TIME fetch (pagination)
   * Load 4 per batch for smoother scrolling
   *
   * NOTE: Using getDocs (not onSnapshot) for pagination to avoid listener accumulation
   * and simplify state management. Initial load uses onSnapshot for real-time updates.
   *
   * @param {string} currentUserGender - Current user's gender
   * @param {DocumentSnapshot} lastDoc - Last document cursor
   * @returns {Promise<{profiles, lastDoc, hasMore}>} - Profile data
   */
  async getMoreProfiles(currentUserGender, lastDoc) {
    const oppositeGender = currentUserGender === 'male' ? 'female' : 'male';
    const limitCount = 4; // Pagination batch size

    try {
      console.log('🔄 ProfileService: Fetching more profiles (getDocs)');
      console.log('  - Gender:', oppositeGender);
      console.log('  - Last Doc ID:', lastDoc?.id);
      console.log('  - Limit:', limitCount);

      // Build query with pagination cursor
      let q = query(
        collection(db, 'users'),
        where('profileData.gender', '==', oppositeGender),
        where('profileCompleted', '==', true),
        limit(limitCount)
      );

      // CRITICAL: Add pagination cursor
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      } else {
        console.warn('⚠️ No lastDoc provided for pagination!');
      }

      // One-time fetch with getDocs
      const snapshot = await getDocs(q);
      console.log('📊 ProfileService: Pagination query returned', snapshot.size, 'documents');

      const profiles = [];
      snapshot.forEach(doc => {
        const data = doc.data();

        if (!data || !data.profileData) {
          console.error('❌ ProfileService: Invalid doc data for:', doc.id);
          return;
        }

        const profileData = data.profileData;

        if (!profileData.displayName && !data.displayName) {
          console.error('❌ ProfileService: No displayName for:', doc.id);
          return;
        }

        // =========================================
        // DATA NORMALIZATION (Same as onSnapshot)
        // =========================================

        const normalizeCountry = (countryObj) => {
          if (!countryObj) return null;
          if (typeof countryObj === 'string') return countryObj;

          return {
            nameAr: countryObj.nameAr || countryObj.countryName || '',
            nameEn: countryObj.nameEn || countryObj.countryName || '',
            countryName: countryObj.countryName || countryObj.nameEn || '',
            code: countryObj.alpha2 || countryObj.code || ''
          };
        };

        const normalizedPhotos = profileData.photos && Array.isArray(profileData.photos)
          ? profileData.photos.filter(photo => photo && typeof photo === 'string')
          : [];

        const profile = {
          id: doc.id,
          displayName: profileData.displayName || data.displayName || 'Unknown',
          name: profileData.displayName || data.displayName || 'Unknown',
          age: profileData.age || null,
          gender: profileData.gender || 'unknown',
          height: profileData.height || null,
          weight: profileData.weight || null,
          skinTone: profileData.skinTone || null,
          nationality: normalizeCountry(profileData.nationality),
          residenceCountry: normalizeCountry(profileData.residenceCountry),
          residenceCity: profileData.residenceCity || null,
          country: profileData.residenceCountry?.countryName ||
                   profileData.residenceCountry?.nameEn || '',
          city: profileData.residenceCity || '',
          maritalStatus: profileData.maritalStatus || null,
          religion: profileData.religion || null,
          prayerHabit: profileData.prayerHabit || null,
          educationLevel: profileData.educationLevel || null,
          workStatus: profileData.workStatus || null,
          tribeAffiliation: profileData.tribeAffiliation || null,
          marriageTypes: profileData.marriageTypes || [],
          marriagePlan: profileData.marriagePlan || null,
          residenceAfterMarriage: profileData.residenceAfterMarriage || null,
          childrenTiming: profileData.childrenTiming || null,
          allowWifeWorkStudy: profileData.allowWifeWorkStudy || null,
          incomeLevel: profileData.incomeLevel || null,
          healthStatus: profileData.healthStatus || [],
          smoking: profileData.smoking || null,
          chatLanguages: profileData.chatLanguages || [],
          aboutMe: profileData.aboutMe || null,
          idealPartner: profileData.idealPartner || null,
          description: profileData.aboutMe || '',
          about: profileData.aboutMe || '',
          photos: normalizedPhotos,
          firstPhoto: normalizedPhotos[0] || null,
          createdAt: data.createdAt || profileData.completedAt || new Date().toISOString(),
        };

        profiles.push(profile);
      });

      // Sort by createdAt
      profiles.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // Newest first
      });

      const newLastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
      const hasMore = snapshot.docs.length === limitCount;

      console.log('✅ ProfileService: Pagination complete');
      console.log('  - Profiles loaded:', profiles.length);
      console.log('  - New lastDoc ID:', newLastDoc?.id);
      console.log('  - Has more:', hasMore);

      return {
        profiles,
        lastDoc: newLastDoc,
        hasMore
      };

    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: ProfileService.getMoreProfiles');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Error Code:', error.code);
      console.error('Query Gender:', oppositeGender);
      console.error('Limit Count:', limitCount);
      console.error('Has Last Doc:', !!lastDoc);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');

      return { profiles: [], lastDoc: null, hasMore: false };
    }
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
   * OPTIMIZED: Uses batched fetching via PeopleDataService
   * - Reduced from ~51 Firestore reads to ~6 reads (90% reduction!)
   *
   * @param {string} userId - User ID
   * @param {Object|null} userData - Optional: User's Firestore document data (to avoid refetch)
   * @param {number} limitCount - Max number of viewers to fetch
   * @returns {Promise<Array>} Array of user profile objects
   */
  async getProfileViewers(userId, userData = null, limitCount = 50) {
    const startTime = Date.now();
    let firestoreReads = 0;

    try {
      console.log(`👁️ Fetching profile viewers for user ${userId} (OPTIMIZED)`);

      // Fetch user document if not provided
      if (!userData) {
        console.log('  - Fetching user document...');
        const userDoc = await getDoc(doc(db, 'users', userId));
        firestoreReads++;

        if (!userDoc.exists()) {
          throw new Error('User not found');
        }

        userData = userDoc.data();
      } else {
        console.log('  - Using provided userData (0 reads)');
      }

      const viewedBy = userData.viewedBy || [];

      if (viewedBy.length === 0) {
        console.log('📋 No profile viewers found');
        console.log(`📊 PERFORMANCE: getProfileViewers - ${firestoreReads} reads, ${Date.now() - startTime}ms`);
        return [];
      }

      console.log(`  - Found ${viewedBy.length} viewers in array`);

      // ========================================
      // OPTIMIZATION: Use PeopleDataService for batched fetching
      // ========================================
      const profiles = await PeopleDataService.getProfilesByIds(
        viewedBy,
        userData,
        limitCount
      );

      // Calculate batch queries: ceil(profiles.length / 10)
      const batchQueries = Math.ceil(Math.min(viewedBy.length, limitCount) / 10);
      firestoreReads += batchQueries;

      const timeTaken = Date.now() - startTime;

      console.log('📊 PERFORMANCE: getProfileViewers Complete');
      console.log(`  - Firestore reads: ${firestoreReads} (vs ${viewedBy.length + 1} with old method)`);
      console.log(`  - Time taken: ${timeTaken}ms`);
      console.log(`  - Profiles fetched: ${profiles.length}`);
      console.log(`  - Reduction: ${Math.round((1 - firestoreReads / (viewedBy.length + 1)) * 100)}%`);

      return profiles;
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
