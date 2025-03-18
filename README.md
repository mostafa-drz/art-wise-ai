# Art Wise AI

Your personal AI-powered art companion – explore the story behind artworks effortlessly.

[![Watch Demo](https://img.youtube.com/vi/zNVE2IIE3a0/maxresdefault.jpg)](https://youtu.be/zNVE2IIE3a0)

## Screenshots

![Main Interface](/public/assets/screenshot-1.png)
![Art Analysis](/public/assets/screenshot-2.png)
![Interactive Chat](/public/assets/screenshots-3.png)
![Live Voice Chat](/public/assets/screenshots-4.png)

## Description

Art Wise AI is a web application that allows users to explore the rich history and details of artworks through AI-powered analysis. Simply upload an image of an artwork, and Art Wise AI will provide you with:

- The **art title**, artist name, date, and historical context.
- **Technical details** such as artistic techniques and visual highlights.
- Fun facts and additional insights to make art exploration engaging.
- A **storytelling audio version** that narrates the details in a natural tone.
- **Real-time voice and text chat** for interactive conversations about artworks.

Built with **Next.js**, **Google Cloud Vertex AI (Gemini)**, **Firebase**, and **WebRTC** for seamless real-time communication.

---

## Features

- **AI-Powered Art Analysis**: Upload an image of an artwork, and the app will provide detailed information such as:

  - Title, artist, and creation date.
  - Historical significance and storytelling context.
  - Technical details highlighting artistic techniques.

- **Storytelling Audio**: Generate a natural, narrated audio version of the artwork's story using Google's Text-to-Speech API.

- **Interactive Chat**: Ask follow-up questions about the artwork and receive insightful responses powered by AI.

- **Real-Time Voice & Text Chat**: Engage in live discussions using real-time voice and text chat powered by WebRTC.

- **Multi-Language Support**: View responses and audio in your preferred language.

- **User Management**:
  - Secure email-based authentication
  - Personal credits system for feature usage
  - Protected user data and history

---

## Tech Stack

**Frontend**:

- Next.js 14 (App Router)
- React 18
- TailwindCSS with custom design system
- React Query for data management

**Backend & Services**:

- Google Cloud Vertex AI (Gemini) for AI-powered content generation
- Google Cloud Text-to-Speech for audio narration
- Firebase Authentication & Firestore
- WebRTC for real-time communication
- Sentry for error monitoring

**Development**:

- TypeScript
- ESLint & Prettier
- Husky for git hooks
- Jest for testing

---

## Educational Purpose

This project serves as a learning resource for developers interested in AI integration and modern web development. Key learning aspects include:

### Learning Objectives

- Building AI-powered applications with Next.js and Google Cloud
- Implementing real-time voice interactions with WebRTC
- Working with modern authentication and database systems
- Creating accessible and responsive user interfaces

### Live Demo

Experience the application at [art-wise-ai.mostafa.xyz](https://art-wise-ai.mostafa.xyz)

### Contributing

This is an educational project and contributions are welcome! Whether you're fixing bugs, improving documentation, or adding new features, please feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/art-wise-ai.git
cd art-wise-ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Set Up Environment Variables**
   Create a .env.local file in the root of the project with the following variables:

```env
# Google Cloud
GCP_PROJECT_ID=your-google-cloud-project-id
GCP_VERTEX_MODEL_LOCATION=your-gcp-model-location
GOOGLE_APPLICATION_CREDENTIALS=path-to-your-service-account.json
GEMINI_MODEL=gemini-1.5-pro

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Sentry
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# WebRTC Configuration
WEBRTC_ICE_SERVERS=your-ice-servers-config
```

4. **Set up Firebase**

- Create a Firebase project
- Enable Authentication with email link
- Set up Firestore database
- Deploy Firestore security rules:

```bash
npm run firestore:rules:deploy
```

5. **Development**

```bash
npm run dev
```

## Usage

**Authentication**

- Sign up/in using email link authentication
- Manage your credits in the user dashboard

**Art Analysis**

1. Upload an artwork image
2. View detailed analysis and insights
3. Generate audio narration
4. Chat about the artwork

**Interactive Chat**

- Use text chat for quick questions
- Start voice chat for natural conversations
- Switch between push-to-talk and live modes

---

## Error Handling & Monitoring

The application uses Sentry for error tracking and monitoring. All errors are automatically logged and tracked in the Sentry dashboard.

## Security

- Secure authentication with email links
- Rate limiting for API calls
- Protected user data with Firestore rules
- Credits system for feature usage control

---

## License

This project is provided for **learning purposes only** and is intended to demonstrate the capabilities of Generative AI and real-time communication technologies.
