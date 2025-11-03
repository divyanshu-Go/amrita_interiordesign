// app/api/upload/route.js
import { NextRequest, NextResponse } from 'next/server';
import { validateFile } from '@/lib/uploadUtils';
import { uploadMultipleFiles } from '@/lib/cloudinaryUpload';

export async function POST(request) {
  try {
    // Get the form data
    const formData = await request.formData();
    const files = formData.getAll('files'); // Support multiple files
    
    // Validate that files were provided
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Check maximum file limit (3 files as per requirements)
    if (files.length > 3) {
      return NextResponse.json(
        { error: 'Maximum 3 files allowed per task' },
        { status: 400 }
      );
    }

    console.log(`📁 Processing ${files.length} files for upload...`);

    // Validate each file
    const validationResults = [];
    const validFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Convert File to a format we can validate
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        mimetype: file.type // For consistency with our validation function
      };

      const validation = validateFile(fileData);
      
      if (!validation.isValid) {
        validationResults.push({
          fileName: file.name,
          errors: validation.errors
        });
      } else {
        validFiles.push(file);
        console.log(`✅ File validated: ${file.name} (${file.size} bytes)`);
      }
    }

    // If any files failed validation, return errors
    if (validationResults.length > 0) {
      return NextResponse.json(
        { 
          error: 'File validation failed',
          validationErrors: validationResults
        },
        { status: 400 }
      );
    }

    // Upload validated files to Cloudinary
    console.log('🚀 Starting Cloudinary upload...');
    const uploadResult = await uploadMultipleFiles(validFiles);

    console.log('🎉 Upload completed successfully!');

    return NextResponse.json({
      message: 'Files uploaded successfully to Cloudinary',
      filesCount: uploadResult.totalFiles,
      files: uploadResult.uploadedFiles
    });

  } catch (error) {
    console.error('❌ Upload API Error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Upload endpoint is working',
    methods: ['POST'],
    maxFiles: 3,
    allowedTypes: ['application/pdf'],
    maxSize: '10MB'
  });
}