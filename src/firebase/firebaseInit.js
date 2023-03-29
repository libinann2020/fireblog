import { initializeApp } from "firebase/app";
// import "firebase/firestore";
import { getFirestore, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBZPXg_sQ0yhIBVKwj1cWsSaFQdaCON3tA",
    authDomain: "fireblogsyt-1d17a.firebaseapp.com",
    projectId: "fireblogsyt-1d17a",
    storageBucket: "fireblogsyt-1d17a.appspot.com",
    messagingSenderId: "442081497615",
    appId: "1:442081497615:web:708fe159d4d939d28bc97a"
};

// const app = initializeApp(firebaseConfig);
// const timestamp = firebase.firestore.FieldValue.serverTimestamp();

// export {timestamp};
// export default app.firestore()

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const timestamp = serverTimestamp();

export { timestamp, db };
// export default db;