import { db, storage } from "./libs/firebase/firebaseConfig";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { ref as databaseRef, get, remove } from "firebase/database";

console.log(db, storage, storageRef, deleteObject, databaseRef, get, remove);
