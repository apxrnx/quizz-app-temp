// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function getQuestions(level, limit = 10) {
  const q = query(collection(db, "questions"), where("level", "==", level));
  const querySnapshot = await getDocs(q);
  const allQuestions = querySnapshot.docs.map((doc) => doc.data());

  // Shuffle allQuestions array
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
  }

  // Select first `limit` questions
  return allQuestions.slice(0, limit);
}

async function getLeaderboard() {
  const currentUser = auth.currentUser;

  const leaderboardQuery = query(
    collection(db, "users"),
    orderBy("score", "desc")
  );

  const querySnapshot = await getDocs(leaderboardQuery);
  const allPlayers = querySnapshot.docs.map((doc, index) => ({
    id: doc.id,
    rank: index + 1,
    ...doc.data(),
  }));

  let topPlayers = allPlayers.slice(0, 10);

  if (currentUser) {
    const currentUserDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (currentUserDoc.exists()) {
      const currentUserData = currentUserDoc.data();
      const currentUserRank =
        allPlayers.findIndex((player) => player.id === currentUser.uid) + 1;
      const currentUserDetails = {
        ...currentUserData,
        rank: currentUserRank,
        id: currentUser.uid,
      };

      const isUserInTop10 = topPlayers.some(
        (player) => player.id === currentUser.uid
      );
      if (!isUserInTop10) {
        topPlayers.push(currentUserDetails);
      }
    }
  }

  return topPlayers;
}

export { auth, db, app, getQuestions, getLeaderboard };
