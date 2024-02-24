interface Input {
    image_url: string // you have access to it
    language?: string // optional field, it mentions the default language for response and further inputs, if not provided en-US, the language is in standard formats
    location?: string // optional field, if available it adds more context about where the user is taking this picture, if it helps in providing response
    age?: number // optional field: If age available it adds adjust the tone and information provided based on that age group
    user_id: string // user_id
 }

 interface Output {
        art_title: string, // the title of the art work
        artist_name: string, // the name of the artist
        date: string, // date the art is created
        more_about_artist: string, // a brief about artist, to show as complimentary data
        brief_history: string, // a brief history, importance and why it's famous, what's important about it
        technical_details: string, // from art point of view, what are some details? What details the audience should pay attention to, and why?
       other_facts: string, // any fun cats, social or historical facts about it
       recommended: {
         art_title: string
         artist_name: string,
         dat: string,
         image_url: string //an external image url on internet
        link: string // an external url to learn more about it
        }[]
 }