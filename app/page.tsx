'use client';

import InputForm from './components/InputForm';
import { Suspense, useState } from 'react';
import Results from './components/Results';

export default function Home() {
  const [data, setData] = useState<Output | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const data = new FormData(e.target as HTMLFormElement);

      const res = await fetch('/api/identify', {
        method: 'POST',
        body: data,
      });
      // // handle the error
      if (!res.ok) throw new Error(await res.text());
      const responseData = await res.json();
      setData(responseData);
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl">Art Wise AI</h1>
      <InputForm onSubmit={handleSubmit} isLoading={loading} />
      <br />
      <Suspense fallback={<p>Loading...</p>}>{data && <Results {...data} />}</Suspense>
    </div>
  );
}
