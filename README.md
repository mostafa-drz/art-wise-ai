# Art Wise AI

Your personal AI-powered art companion – explore the story behind artworks effortlessly.
[Demo](https://youtube.com/shorts/C7zNHCYIfvc)
[![Demo Preview 1](/public/assets/screenshot-1.png)](https://youtube.com/shorts/C7zNHCYIfvc)
[![Demo Preview 2](/public/assets/screenshot-2.png)](https://youtube.com/shorts/C7zNHCYIfvc)

## Description

Art Wise AI is a web application that allows users to explore the rich history and details of artworks through AI-powered analysis. Simply upload an image of an artwork, and Art Wise AI will provide you with:

- The **art title**, artist name, date, and historical context.
- **Technical details** such as artistic techniques and visual highlights.
- Fun facts and additional insights to make art exploration engaging.
- A **storytelling audio version** that narrates the details in a natural tone.
- **Real-time voice and text chat** for interactive conversations about artworks.

Built with tools like **Next.js**, **Google Cloud Vertex AI**, **Text-to-Speech**, and **[openai-realtime-webrtc](https://github.com/mostafa-drz/openai-realtime-webrtc)** for seamless real-time communication.

---

## Features

- **AI-Powered Art Analysis**: Upload an image of an artwork, and the app will provide detailed information such as:

  - Title, artist, and creation date.
  - Historical significance and storytelling context.
  - Technical details highlighting artistic techniques.

- **Storytelling Audio**: Generate a natural, narrated audio version of the artwork's story using Google's Text-to-Speech API.

- **Interactive Chat**: Ask follow-up questions about the artwork and receive insightful responses powered by AI.

- **Real-Time Voice & Text Chat**: Engage in live discussions using real-time voice and text chat powered by WebRTC and OpenAI's Realtime API.

- **Multi-Language Support**: View responses and audio in your preferred language.

---

## Tech Stack

**Frontend**:

- Next.js (App Router)
- React
- TailwindCSS

**Backend**:

- Google Cloud Vertex AI (Gemini API) for AI-powered content generation
- Google Cloud Text-to-Speech for generating audio narration
- **[openai-realtime-webrtc](https://github.com/mostafa-drz/openai-realtime-webrtc)** for real-time communication

---

## Installation

3. **Set Up Environment Variables**
   Create a .env.local file in the root of the project with the following variables:

```
GCP_PROJECT_ID=your-google-cloud-project-id
GCP_VERTEX_MODEL_LOCATION=your-gcp-model-location (e.g., us-central1)
GOOGLE_APPLICATION_CREDENTIALS=path-to-your-service-account.json
GEMINI_MODEL=gemini-1.5-pro

# OpenAI Realtime WebRTC
OPEN_AI_API_KEY=your-openai-api-key
OPEN_AI_REALTIME_SESSION_URL=your-openai-realtime-session-url
OPEN_AI_MODEL_ID=your-openai-model-id
```

Replace the placeholders with actual values.

**Note:** Alternatively, you can use the gcloud CLI to configure your project, eliminating the need to create a service account manually. This method is generally recommended for its simplicity and efficiency.

For detailed instructions on setting up the gcloud CLI and initializing your project, refer to the [official Google Cloud documentation](https://cloud.google.com/sdk/docs/initializing).

## Usage

**Interactive Chat**

Use the chat interface to ask questions and receive AI-powered answers about the artwork.

**Real-Time Voice Chat**

- Click the **"Start Voice Chat"** button to initiate a real-time voice session.
- Enjoy seamless voice interactions powered by WebRTC.

---

## License

This project is provided for **learning purposes only** and is intended to demonstrate the capabilities of Generative AI and real-time communication technologies.
