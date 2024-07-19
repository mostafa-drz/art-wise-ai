'use client';

import InputForm from './components/InputForm';
import { Suspense, useState } from 'react';
import Results from './components/Results';

export default function Home() {
  const [data, setData] = useState<Output | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const image = formData.get('image') as File;
      const language = formData.get('language') as string;

      if (!image) throw new Error('No image provided');

      const fileType = image.type; // Get MIME type of the image
      if (!fileType.startsWith('image/'))
        throw new Error('Invalid file type. Please upload an image.');

      const worker = new Worker('/generateBinaryForImageWorker.js');

      // Handle messages from the worker
      worker.onmessage = async (e) => {
        const base64String = e.data;
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
      };

      // Send the file to the worker for processing
      worker.postMessage(image);
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    } finally {
      setLoading(false); // Stop loading
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl">Art Wise AI</h1>
      <InputForm onSubmit={handleSubmit} isLoading={loading} />
      <br />
      <Suspense fallback={<p>Loading...</p>}>
        {data && <Results {...data} imageBase64={imageBase64} />}
      </Suspense>
    </div>
  );
}
