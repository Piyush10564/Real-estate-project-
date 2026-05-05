// Cloudinary upload utility
const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dvjqfnmty';
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'real_estate_app';

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data.secure_url; // Return the Cloudinary URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Upload multiple images
export const uploadMultipleToCloudinary = async (files) => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};
