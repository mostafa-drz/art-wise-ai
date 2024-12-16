# Art Wise AI

Your personal AI-powered art companion – explore the story behind artworks effortlessly.

## Description

Art Wise AI is a web application that allows users to explore the rich history and details of artworks through AI-powered analysis. Simply upload an image of an artwork, and Art Wise AI will provide you with:

- The **art title**, artist name, date, and historical context.
- **Technical details** such as artistic techniques and visual highlights.
- Fun facts and additional insights to make art exploration engaging.
- A **storytelling audio version** that narrates the details in a natural tone.

Built with tools like **Next.js**, **Google Cloud Vertex AI**, and **Text-to-Speech**, Art Wise AI showcases seamless integration of AI technologies in an intuitive web experience.

---

## Features

- **AI-Powered Art Analysis**: Upload an image of an artwork, and the app will provide detailed information such as:

  - Title, artist, and creation date.
  - Historical significance and storytelling context.
  - Technical details highlighting artistic techniques.

- **Storytelling Audio**: Generate a natural, narrated audio version of the artwork's story using Google's Text-to-Speech API.

- **Interactive Chat**: Ask follow-up questions about the artwork and receive insightful responses powered by AI.

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

---

## Getting Started

Follow these instructions to set up and run the project locally.

## Prerequisites

Ensure you have the following:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- A **Google Cloud Project** with:
  - Vertex AI API enabled
  - Text-to-Speech API enabled
- **Google Cloud credentials** (Service Account JSON file) with the following roles:
  - **Vertex AI User** (`roles/aiplatform.user`)
  - **Text-to-Speech Editor** (`roles/texttospeech.editor`)

---

## Installation

1. **Clone the Repository**

```bash
git clone https://github.com/your-username/art-wise-ai.git
cd art-wise-ai
```

2. **Install Dependencies**

```bash
npm install
```

3. **Set Up Environment Variables**
   Create a .env.local file in the root of the project with the following variables:

```
GCP_PROJECT_ID=your-google-cloud-project-id
GCP_VERTEX_MODEL_LOCATION=your-gcp-model-location (e.g., us-central1)
GOOGLE_APPLICATION_CREDENTIALS=path-to-your-service-account.json
GEMINI_MODEL=gemini-1.5-pro
```

Replace the placeholders with actual values:

- your-google-cloud-project-id: Your Google Cloud project ID.
- your-gcp-model-location: The Vertex AI model location (e.g., us-central1).
- path-to-your-service-account.json: Path to the downloaded service account key JSON file.

4. **Start the Development Server**

```
npm run dev
```

## **Access the App**

Open your browser and navigate to:

```
http://localhost:3000
```

## Usage

Once the app is running:

**Upload an Image**

Use the upload form to upload an image of an artwork or take a picture directly using your device.

**View Artwork Details**

The app will analyze the image and display:

- **Title**, artist, and creation date.
- **Historical and technical insights**.
- **Fun or social facts** about the artwork.

**Generate Audio**

- Click the **"Generate Audio"** button to hear a narrated, storytelling version of the artwork’s details.
- Play the audio directly on the page or download it.

**Interactive Chat**

Use the chat interface to ask questions and receive AI-powered answers about the artwork.

## License

This project is provided for **learning purposes only** and is intended to demonstrate the capabilities of Generative AI technologies.
