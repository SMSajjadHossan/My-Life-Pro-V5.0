import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

let db: any = null;

const initFirebase = () => {
    try {
        // 1. Priority: Check Local Storage (Dynamic Setup for iPad/Web)
        const localConfig = localStorage.getItem('firebase_config');
        if (localConfig) {
            try {
                const config = JSON.parse(localConfig);
                const app = initializeApp(config);
                db = getFirestore(app);
                console.log("🔥 Firebase Initialized from Local Settings");
                return;
            } catch (e) {
                console.error("Invalid Firebase Config JSON in Local Storage", e);
            }
        }

        // 2. Fallback: Hardcoded Config (Developer Mode)
        // ⚠️ REPLACE WITH YOUR PROJECT CONFIG IF NOT USING DYNAMIC SETUP
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY_HERE",
            authDomain: "your-app.firebaseapp.com",
            projectId: "your-project-id",
            storageBucket: "your-app.appspot.com",
            messagingSenderId: "123456789",
            appId: "1:123456789:web:abcdef"
        };

        if (firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
            const app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            console.log("🔥 Firebase Initialized from Static Config");
        } else {
            console.warn("⚠️ Firebase Config Missing. App running in OFFLINE/LOCAL mode.");
        }
    } catch (e) {
        console.error("Firebase Initialization Failed:", e);
    }
};

initFirebase();

export { db };
