import {
  collection,
  query,
  where,
  getDocs,
  documentId
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * PeopleDataService - Optimized batch fetching for People tab
 * 
 * KEY OPTIMIZATION: Uses batched getDocs() instead of individual getDoc() calls
 * - Before: 50 sequential getDoc() = 50 Firestore reads
 * - After: 5 batched getDocs() (10 per batch) = 5 Firestore reads
 * - 90% reduction in queries!
 */
class PeopleDataService {
  /**
   * Fetch multiple user profiles by IDs with optimized batching
   * 
   * @param {string[]} userIds - Array of user IDs to fetch
   * @param {Object} currentUserData - Current user's Firestore document data (to filter blocked users)
   * @param {number} limitCount - Max number of profiles to return
   * @returns {Promise<Array>} Array of normalized profile objects
   */
  async getProfilesByIds(userIds, currentUserData, limitCount = 50) {
    const startTime = Date.now();
    
    try {
      console.log('📦 PeopleDataService: Batch fetching profiles');
      console.log('  - Total IDs to fetch:', userIds.length);
      console.log('  - Limit:', limitCount);

      if (!userIds || userIds.length === 0) {
        console.log('  - No user IDs provided, returning empty array');
        return [];
      }

      // Filter blocked users BEFORE fetching (save Firestore reads!)
      const blockedUsers = Array.isArray(currentUserData.blockedUsers) ? currentUserData.blockedUsers : [];
      const blockedBy = Array.isArray(currentUserData.blockedBy) ? currentUserData.blockedBy : [];
      const allBlockedUsers = [...new Set([...blockedUsers, ...blockedBy])].filter(id => id);
      
      const filteredUserIds = userIds.filter(id => id && !allBlockedUsers.includes(id));
      console.log('  - After blocking filter:', filteredUserIds.length);

      if (filteredUserIds.length === 0) {
        console.log('  - All users filtered out (blocked), returning empty array');
        return [];
      }

      // Limit to requested count
      const limitedUserIds = filteredUserIds.slice(0, limitCount);
      console.log('  - After limit:', limitedUserIds.length);

      // Split into chunks of 10 (Firestore 'in' query limit)
      const chunks = this.chunkArray(limitedUserIds, 10);
      console.log('  - Batch chunks:', chunks.length);

      // Fetch all chunks in parallel with Promise.all()
      const chunkPromises = chunks.map((chunk, index) => 
        this.fetchProfileChunk(chunk, index)
      );

      const chunkResults = await Promise.all(chunkPromises);
      
      // Flatten results and normalize
      const allProfiles = chunkResults.flat();

      const endTime = Date.now();
      const timeTaken = endTime - startTime;

      console.log('✅ PeopleDataService: Batch fetch complete');
      console.log('  - Firestore queries:', chunks.length);
      console.log('  - Profiles fetched:', allProfiles.length);
      console.log('  - Time taken:', timeTaken + 'ms');
      console.log('  - Avg time per profile:', Math.round(timeTaken / allProfiles.length) + 'ms');

      return allProfiles;

    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('🔴 ERROR: PeopleDataService.getProfilesByIds');
      console.error('═══════════════════════════════════════');
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('User IDs count:', userIds?.length);
      console.error('Timestamp:', new Date().toISOString());
      console.error('═══════════════════════════════════════');
      return [];
    }
  }

  /**
   * Fetch a chunk of profiles using batched getDocs()
   * Uses Firestore where(documentId(), 'in', [...]) for efficient batching
   * 
   * @param {string[]} userIds - Chunk of up to 10 user IDs
   * @param {number} chunkIndex - Index of chunk (for logging)
   * @returns {Promise<Array>} Array of normalized profiles
   * @private
   */
  async fetchProfileChunk(userIds, chunkIndex) {
    try {
      console.log(`  📦 Fetching chunk ${chunkIndex + 1}: ${userIds.length} profiles`);

      // Use documentId() for efficient batch query
      const q = query(
        collection(db, 'users'),
        where(documentId(), 'in', userIds)
      );

      const snapshot = await getDocs(q);
      
      console.log(`  ✅ Chunk ${chunkIndex + 1} fetched: ${snapshot.size} documents`);

      const profiles = [];
      snapshot.forEach(doc => {
        const data = doc.data();

        // Filter out invalid profiles
        if (!data || !data.profileData) {
          console.warn(`  ⚠️ Skipping ${doc.id}: No profileData`);
          return;
        }

        // Only include active users with completed profiles
        if (data.accountStatus !== 'active' || !data.profileCompleted) {
          console.warn(`  ⚠️ Skipping ${doc.id}: Not active or incomplete`);
          return;
        }

        // Normalize and add to results
        const normalizedProfile = this.normalizeProfileData(doc);
        profiles.push(normalizedProfile);
      });

      return profiles;

    } catch (error) {
      console.error(`  🔴 Error fetching chunk ${chunkIndex + 1}:`, error.message);
      return [];
    }
  }

  /**
   * Normalize profile data from Firestore document
   * Single source of truth for profile normalization
   * Extracted from LikeService/ProfileService to avoid duplication
   * 
   * @param {DocumentSnapshot} doc - Firestore document snapshot
   * @returns {Object} Normalized profile object
   * @private
   */
  normalizeProfileData(doc) {
    const data = doc.data();
    const profileData = data.profileData || {};

    // Normalize country data - KEEP BOTH ARABIC AND ENGLISH NAMES
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

    // Pre-process photos array
    const normalizedPhotos = profileData.photos && Array.isArray(profileData.photos)
      ? profileData.photos.filter(photo => photo && typeof photo === 'string')
      : [];

    return {
      id: doc.id,
      // Core identity
      displayName: profileData.displayName || data.displayName || 'Unknown',
      name: profileData.displayName || data.displayName || 'Unknown',
      age: profileData.age || null,
      gender: profileData.gender || null,

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
  }

  /**
   * Split array into chunks of specified size
   * 
   * @param {Array} array - Array to split
   * @param {number} size - Chunk size
   * @returns {Array[]} Array of chunks
   * @private
   */
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export default new PeopleDataService();

