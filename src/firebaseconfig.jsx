// Import the functions you need from the Firebase SDK
import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRUtZ4kh7xiuvq-vS5wj-CEnvzP7fOydo",
  authDomain: "give-away-a58b2.firebaseapp.com",
  projectId: "give-away-a58b2",
  storageBucket: "give-away-a58b2.appspot.com",
  messagingSenderId: "445864961054",
  appId: "1:445864961054:web:cfe372a123148cfe0a7a0f",
  measurementId: "G-CLER2X4QQF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

// Export the storage instance for use in other parts of your application
export { storage };
