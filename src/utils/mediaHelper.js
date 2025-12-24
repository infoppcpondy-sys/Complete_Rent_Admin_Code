/**
 * Media Helper Utilities
 * Centralized functions for handling image and video URLs across the application
 */

// Base URL for media files
const MEDIA_BASE_URL = process.env.REACT_APP_MEDIA_URL || 'https://rentpondy.com/PPC';

// Default images
const DEFAULT_PROPERTY_IMAGE = 'https://d17r9yv50dox9q.cloudfront.net/car_gallery/default.jpg';

/**
 * Get the full URL for a photo
 * Handles both string paths and File objects
 * @param {string|File|Blob} photo - Photo path or File object
 * @returns {string} Full URL for the photo
 */
export const getPhotoUrl = (photo) => {
  if (!photo) {
    return DEFAULT_PROPERTY_IMAGE;
  }

  // If it's a File or Blob object (for preview before upload)
  if (photo instanceof File || photo instanceof Blob) {
    return URL.createObjectURL(photo);
  }

  // If it's already a full URL
  if (typeof photo === 'string') {
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo;
    }
    
    // Clean the path - remove leading slashes and backslashes
    const cleanPath = photo.replace(/^[/\\]+/, '').replace(/\\/g, '/');
    return `${MEDIA_BASE_URL}/${cleanPath}`;
  }

  // If it's an object with photoUrl or photo property
  if (typeof photo === 'object') {
    const photoPath = photo.photoUrl || photo.photo || photo.url;
    return getPhotoUrl(photoPath);
  }

  return DEFAULT_PROPERTY_IMAGE;
};

/**
 * Get the full URL for a video
 * Handles both string paths and File objects
 * @param {string|File|Blob} video - Video path or File object
 * @returns {string|null} Full URL for the video or null if not available
 */
export const getVideoUrl = (video) => {
  if (!video) {
    return null;
  }

  // If it's a File or Blob object (for preview before upload)
  if (video instanceof File || video instanceof Blob) {
    return URL.createObjectURL(video);
  }

  // If it's already a full URL
  if (typeof video === 'string') {
    if (video.startsWith('http://') || video.startsWith('https://')) {
      return video;
    }
    
    // Clean the path - remove leading slashes and backslashes
    const cleanPath = video.replace(/^[/\\]+/, '').replace(/\\/g, '/');
    return `${MEDIA_BASE_URL}/${cleanPath}`;
  }

  // If it's an object with videoUrl or video property
  if (typeof video === 'object') {
    const videoPath = video.videoUrl || video.video || video.url;
    return getVideoUrl(videoPath);
  }

  return null;
};

/**
 * Get the first photo URL from a photos array
 * @param {Array} photos - Array of photos
 * @returns {string} URL of the first photo or default image
 */
export const getFirstPhotoUrl = (photos) => {
  if (!photos || !Array.isArray(photos) || photos.length === 0) {
    return DEFAULT_PROPERTY_IMAGE;
  }
  return getPhotoUrl(photos[0]);
};

/**
 * Get all photo URLs from a photos array
 * @param {Array} photos - Array of photos
 * @returns {Array<string>} Array of photo URLs
 */
export const getAllPhotoUrls = (photos) => {
  if (!photos || !Array.isArray(photos)) {
    return [];
  }
  return photos.map(photo => getPhotoUrl(photo));
};

/**
 * Check if a photo is a File object (new upload) or a string (existing photo)
 * @param {any} photo - Photo to check
 * @returns {boolean} True if it's a new file upload
 */
export const isNewUpload = (photo) => {
  return photo instanceof File || photo instanceof Blob;
};

/**
 * Separate existing photos from new uploads
 * @param {Array} photos - Array of photos (mixed Files and strings)
 * @returns {Object} { existingPhotos: string[], newPhotos: File[] }
 */
export const separatePhotosByType = (photos) => {
  if (!photos || !Array.isArray(photos)) {
    return { existingPhotos: [], newPhotos: [] };
  }

  const existingPhotos = [];
  const newPhotos = [];

  photos.forEach(photo => {
    if (isNewUpload(photo)) {
      newPhotos.push(photo);
    } else if (typeof photo === 'string') {
      existingPhotos.push(photo);
    }
  });

  return { existingPhotos, newPhotos };
};

/**
 * Clean up object URLs to prevent memory leaks
 * @param {string} url - Object URL to revoke
 */
export const revokeObjectUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

export const DEFAULT_IMAGE = DEFAULT_PROPERTY_IMAGE;
export const MEDIA_URL = MEDIA_BASE_URL;
