// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "gitflow-ai.firebaseapp.com",
  projectId: "gitflow-ai",
  storageBucket: "gitflow-ai.firebasestorage.app",
  messagingSenderId: "122027471282",
  appId: "1:122027471282:web:585f550d7920d110af74ab",
  measurementId: "G-YGWD4WEWVX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const uploadFile = async (
  file: File,
  setProgress?: (progress: number) => void,
) => {
  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, file.name || "");
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          if (setProgress) setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },()=>{
            getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
                resolve(downloadUrl as string)
            })
        }
      );
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
