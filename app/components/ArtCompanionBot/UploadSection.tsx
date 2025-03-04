'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { MAX_IMAGE_FILE_SIZE, uploadImageToFirebase } from '../../utils';
import { User, Output } from '../../types';
import { useGlobalState } from '../../context/GlobalState';
import * as api from '../../utils/api';

interface UploadSectionProps {
  user: User;
  onSuccess: (data: Output) => void;
  onError: (error: string | null) => void;
  onLoading: (loading: boolean) => void;
  loading: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  user,
  onSuccess,
  onError,
  onLoading,
  loading,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { sessionId, language } = useGlobalState();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const image = acceptedFiles[0];
    if (!image) return;

    // Create preview
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    // Handle upload
    handleUpload(image);

    return () => URL.revokeObjectURL(objectUrl);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxSize: MAX_IMAGE_FILE_SIZE,
    multiple: false,
  });

  const handleUpload = async (image: File) => {
    onLoading(true);
    onError(null);

    try {
      if (!image.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please upload an image.');
      }

      if (image.size > MAX_IMAGE_FILE_SIZE) {
        throw new Error('Image size exceeds the 5MB limit.');
      }

      const imageURL = await uploadImageToFirebase(user.uid, sessionId, image);
      const { data, error } = await api.identifyArtwork({ user, imageURL, language });

      if (error) {
        setError(error);
        onError(error);
      } else {
        onSuccess(data);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        onError(err.message || 'Something went wrong.');
      } else {
        console.error(err);
        onError('Something went wrong.');
      }
    } finally {
      onLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-8 transition-all
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
        `}
        aria-label="Upload artwork or take a photo"
      >
        <input {...getInputProps()} accept="image/*" capture="environment" disabled={loading} />

        {preview ? (
          <div className="relative w-full aspect-video">
            <Image src={preview} alt="Upload preview" fill className="object-contain rounded-lg" />
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center space-x-4">
              <svg
                className="h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                className="h-12 w-12 text-gray-400 md:hidden"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {isDragActive ? (
                  'Drop your artwork here...'
                ) : (
                  <>
                    <span className="hidden md:inline">Drag and drop your artwork, or </span>
                    <span className="text-blue-600 hover:text-blue-700">
                      {window.innerWidth <= 768 ? 'Take a photo or choose image' : 'browse files'}
                    </span>
                  </>
                )}
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Take a photo or upload PNG, JPG, GIF (max 5MB)
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-sm text-gray-600">Analyzing artwork...</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
