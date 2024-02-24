"use client";

import Image from 'next/image';
import InputForm from './components/InputForm';
import {Suspense, useState} from 'react'

async function getInformationFromGemini(input: Input):Promise<Output>{
  // send a GET call to /api/identify/route.ts with the input as params adn return the response
  const response = await fetch(`/api/identify?image_url=${input.image_url}&user_id=${input.user_id}`);
  const data = await response.json();
  return data;
}

export default function Home() {
  //a simple but beatiful component designed, where users can enter the image url and get more information about the art work
  // the component should be able to make the api call and get the response, the response is defined in the api/identify/route.ts
  // the response should be displayed in a beatiful way, with a story telling fashion, and a list of recommended art works
  // the component should be able to handle multiple languages, and should be able to handle the user_id, and should be able to handle the age, and location, and language preferences
  // the component should render all the data with sections defined in the response, based on type of Output defined in the api/identify/route.ts
  const [data,setData] = useState<Output| null>(null);
  function handleSubmit(input: Input) {
    getInformationFromGemini(input).then((responseData) => {
      console.log("APIR refrence",{responseData});
      setData(responseData);
    });
  }

  console.log('rendering',{data});

  return (
    <div>
      <h1>Artwork Identification</h1>
      <InputForm onSubmit={handleSubmit}/>
      <br/>
      <Suspense fallback={<p>Loading...</p>}>
       {data && <Result {...data}/>}
       </Suspense>
    </div>
  );
}


// a component called Result, which will be used to display the response from the api
function Result(props: Output) {
  const {
    art_title,
    artist_name,
    date,
    more_about_artist,
    brief_history,
    technical_details,
    other_facts,
    recommended,
  } = props;

  return (
    <div>
      <h2>{art_title}</h2>
      <p>{artist_name}</p>
      <p>{date}</p>
      <p>{more_about_artist}</p>
      <p>{brief_history}</p>
      <p>{technical_details}</p>
      <p>{other_facts}</p>
      <h3>Recommended</h3>
      <ul>
        {recommended.map((item) => (
          <li key={item.artist_name}>
            <img src={item.image_url} alt={item.art_title} style={{width:'300px',height:'300px'}}/>
            <p>{item.art_title}</p>
            <p>{item.artist_name}</p>
            <p>{item.dat}</p>
            <a href={item.link}>Read More</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
