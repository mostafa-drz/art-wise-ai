'use client';

import React, { useState } from 'react';
import InputForm from '../InputForm';
import { MAX_IMAGE_FILE_SIZE, uploadImageToFirebase } from '../../utils';
import { User } from '../../types';
import { useGlobalState } from '../../context/GlobalState';
import * as api from '../../utils/api';

interface UploadSectionProps {
  user: User;
  onSuccess: (data: any) => void;
  onError: (error: string | null) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ user, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sessionId, language } = useGlobalState();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    onError(null);
    const image = formData.get('image') as File;

    try {
      if (!image) throw new Error('No image provided');

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
    } catch (err: any) {
      console.error(err);
      onError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return <InputForm onSubmit={handleSubmit} isLoading={loading} error={null} />;
};

export default UploadSection;
