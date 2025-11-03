// lib/cloudinaryUpload.js
import cloudinary from './cloudinary.js';
import { generateSafeFilename } from './uploadUtils.js';

/**
 * Upload a single file to Cloudinary
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - Upload result with metadata
 */
export async function uploadToCloudinary(file) {
  try {
    console.log(`📤 Uploading ${file.name} to Cloudinary...`);

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a safe public ID
    const safeFilename = generateSafeFilename(file.name);
    const publicId = safeFilename;

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // Important for PDFs
          public_id: publicId,
          use_filename: false,
          unique_filename: false,
          folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'task-attachments'
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('✅ Upload successful:', result.public_id);
            resolve(result);
          }
        }
      ).end(buffer);
    });

    // Return formatted metadata for our Task model
    return {
      fileName: file.name, // Original filename
      fileUrl: uploadResult.secure_url, // Cloudinary secure URL
      publicId: uploadResult.public_id, // Cloudinary public ID for deletion
      resourceType: uploadResult.resource_type || 'raw', // Resource type
      fileSize: file.size, // File size in bytes
      uploadedAt: new Date().toISOString(),
      status: 'uploaded'
    };

  } catch (error) {
    console.error(`❌ Failed to upload ${file.name}:`, error);
    throw new Error(`Upload failed for ${file.name}: ${error.message}`);
  }
}

/**
 * Upload multiple files to Cloudinary
 * @param {File[]} files - Array of files to upload
 * @returns {Promise<Object>} - Upload results
 */
export async function uploadMultipleFiles(files) {
  const uploadPromises = files.map(file => uploadToCloudinary(file));
  
  try {
    console.log(`📤 Starting upload of ${files.length} files...`);
    const results = await Promise.all(uploadPromises);
    
    console.log(`🎉 Successfully uploaded ${results.length} files to Cloudinary`);
    return {
      success: true,
      uploadedFiles: results,
      totalFiles: results.length
    };
    
  } catch (error) {
    console.error('❌ Batch upload failed:', error);
    
    // If any upload fails, we might want to cleanup successful uploads
    // For now, we'll just return the error
    throw new Error(`Batch upload failed: ${error.message}`);
  }
}