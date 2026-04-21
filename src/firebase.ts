import { getFirestore, doc, collection, addDoc, setDoc  } from "firebase/firestore";
import { initializeApp } from "firebase/app";
//import { sortAndDeduplicateDiagnostics } from "typescript";

const firebaseConfig = {
  apiKey: "AIzaSyCMjUI-zw-6rad7ZXxUxu8vYWpzgs2sbkI",
  authDomain: "homework5-38cfd.firebaseapp.com",
  projectId: "homework5-38cfd",
  storageBucket: "homework5-38cfd.firebasestorage.app",
  messagingSenderId: "764705213117",
  appId: "1:764705213117:web:126f069e5bc69f121845d4",
  measurementId: "G-8PRHLMGTY6"
};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;

const baseArr = [
  { "id": "b1", "name": "Black Tea", "color": "#8B4513" },
  { "id": "b2", "name": "Green Tea", "color": "#C8E6C9" },
  { "id": "b3", "name": "Coffee", "color": "#6F4E37" }
]

const creamerArr = [
  { "id": "c1", "name": "No Cream", "color": "transparent" },
  { "id": "c2", "name": "Milk", "color": "AliceBlue" },
  { "id": "c3", "name": "Cream", "color": "#F5F5DC" },
  { "id": "c4", "name": "Half & Half", "color": "#FFFACD" }
]

const syrupArr = [
  { "id": "s1", "name": "No Syrup", "color": "transparent" },
  { "id": "s2", "name": "Vanilla", "color": "#FFEFD5" },
  { "id": "s3", "name": "Caramel", "color": "#DAA520" },
  { "id": "s4", "name": "Hazelnut", "color": "#6B4423" }
]

//How I wrote the data to the database

// export async function startData() {
//   baseArr.forEach(async (bs: any) => {
//     const baseDoc = doc(db, "bases", bs.id);
//     await setDoc(baseDoc, {name: bs.name, color: bs.color});
//   })

//   creamerArr.forEach(async (cr: any) => {
//     const creamerDoc = doc(db, "creamers", cr.id);
//     await setDoc(creamerDoc, {name: cr.name, color: cr.color});
//   })

//   syrupArr.forEach(async (sy: any) => {
//     const syrupDoc = doc(db, "creamers", sy.id);
//     await setDoc(syrupDoc, {name: sy.name, color: sy.color});
//   })
// } 
