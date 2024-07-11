# Art-Wise AI

Art-Wise AI is an intelligent assistant designed to educate users about various artworks. By leveraging Google Generative AI, the app provides detailed information about artwork based on user-provided image URLs. This project is built with Next.js, Firebase, and various modern development tools.

## Features
- **Artwork Information**: Get comprehensive details about any artwork, including title, artist, date, history, technical details, and fun facts.
- **Recommendations**: Discover other artworks by the same artist with images and links.
- **Personalization**: Responses are tailored based on user information like language, location, and age.

## Technology Stack
- **Next.js**: For server-side rendering and building the web application.
- **Firebase**: For backend services and database management.
- **Google Generative AI**: To generate detailed artwork descriptions.
- **Tailwind CSS**: For styling the UI.
- **TypeScript**: For type safety and modern JavaScript development.
- **ESLint and Prettier**: For maintaining code quality and formatting.

## Getting Started

### Prerequisites
- Node.js and npm installed on your local machine.
- Firebase account and project setup.

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/mostafa-drz/art-wise-ai.git
   cd art-wise-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Add a web app to your Firebase project and get the configuration.
   - Set up Firebase Admin SDK and generate a service account key.
   - Copy the Firebase configuration and service account key to your project.

4. **Configure environment variables**:
   Create a `.env.local` file in the root of the project and add the following variables:
   ```bash
   GEMINI_API_KEY={{YOUR GEMINI API KEY}}
   GOOGLE_APPLICATION_CREDENTIALS=./firebase-admin-service-account.json
   ```

### Running the Application
1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage
- **Upload an artwork image**: Provide an image URL of the artwork you want to learn about.
- **Receive detailed information**: The app will use Google Generative AI to generate and display detailed information about the artwork.
- **Explore recommendations**: Discover other artworks by the same artist.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code follows the established code style and passes all linting checks.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact
For any inquiries or feedback, please contact [Mostafa DRZ](https://github.com/mostafa-drz).