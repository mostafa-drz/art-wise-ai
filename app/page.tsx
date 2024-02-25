"use client";

import InputForm from './components/InputForm';
import {Suspense, useState} from 'react'
import Results from './components/Results';

async function getInformationFromGemini(input: Input):Promise<Output>{
  // send a post request to the /api/identify route with the input fields as body
  const response = await fetch(`/api/identify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(input)
  });
  const data = await response.json();
  return data;
}

export default function Home() {
  const [data,setData] = useState<Output| null>(null);

  function handleSubmit(input: Input) {

    getInformationFromGemini(input).then((responseData) => {
      console.log("APIR refrence",{responseData});
      setData(responseData);
    });
  }

  console.log('rendering',{data});

  return (
    <div className='flex flex-col items-center'>
      <h1 className='text-4xl'>Art Wise AI</h1>
      <InputForm onSubmit={handleSubmit}/>
      <br/>
      <Suspense fallback={<p>Loading...</p>}>
       {data && <Results {...data}/>}
       </Suspense>
    </div>
  );
}
