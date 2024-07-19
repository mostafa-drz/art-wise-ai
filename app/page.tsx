'use client';

import InputForm from './components/InputForm';
import { useState, useRef, useEffect } from 'react';
import Results from './components/Results';
import imageCompression, { Options } from 'browser-image-compression';

const imageCompressingOptions: Options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 800,
  useWebWorker: true,
};

export default function Home() {
  const [data, setData] = useState<Output | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>('');
  const worker = useRef<Worker>();
  const formData = useRef(new FormData());

  useEffect(() => {
    worker.current = new Worker('/generateBinaryForImageWorker.js');

    worker.current.onmessage = async (e) => {
      if (typeof e.data !== 'string') throw new Error('Invalid data type');
      const base64String = e.data;
      const language = formData.current.get('language') as string;
      const fileType = (formData.current.get('image') as File).type;
      setImageBase64(base64String);
      const res = await fetch('/api/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64String, language, type: fileType }),
      });
      if (!res.ok) throw new Error(await res.text());
      const responseData = await res.json();
      setData(responseData); // Set the response data to state
      setLoading(false); // Stop loading
    };
  }, []);
  // Handle messages from the worker

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!worker.current) return;

    e.preventDefault();
    setLoading(true); // Start loading

    try {
      formData.current = new FormData(e.target as HTMLFormElement);
      const image = formData.current.get('image') as File;

      if (!image) throw new Error('No image provided');

      const fileType = image.type; // Get MIME type of the image
      if (!fileType.startsWith('image/'))
        throw new Error('Invalid file type. Please upload an image.');

      // compress image on webworker first before sending to server
      const compressedImage = await imageCompression(image, imageCompressingOptions);

      // Send the file to the worker for processing
      worker.current.postMessage(compressedImage);
    } catch (e: any) {
      // Handle errors here
      console.error(e);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Art Wise AI</h1>
      <p className="text-lg text-gray-700 mb-6">
        Welcome to Art Wise AI, your personal art advisor. Upload an image or paste an image URL to
        discover detailed information about any artwork. Learn about the artist, the artwork&rsquo;s
        history, technical details, and more.
      </p>
      <InputForm onSubmit={handleSubmit} isLoading={loading} />
      <br />
      {loading ? (
        <div className="animate-pulse text-3xl text-gray-600">🤖 Working on it...</div>
      ) : (
        data && <Results {...data} imageBase64={imageBase64} />
      )}
    </div>
  );
}
