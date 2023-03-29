import { createStore } from 'vuex';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";

export default createStore({
  state: {
    sampleBlogCards: [
      {blogTitle: "Blog Card #1", blogCoverPhoto: "stock-1", blogDate: "May 1,2021"},
      {blogTitle: "Blog Card #2", blogCoverPhoto: "stock-2", blogDate: "May 1,2021"},
      {blogTitle: "Blog Card #3", blogCoverPhoto: "stock-3", blogDate: "May 1,2021"},
      {blogTitle: "Blog Card #4", blogCoverPhoto: "stock-4", blogDate: "May 1,2021"},
    ],
    editPost: null,
    user: null,
    profileEmail: null,
    profileFirstName: null,
    profileLastName: null,
    profileUsername: null,
    profileId: null,
    profileInitials: null
  },
  getters: {
  },
  mutations: {
    toggleEditPost(state, payload) {
      state.editPost = payload;
    },
    updateUser(state, payload) {
      state.user = payload
    },
    setProfileInfo(state, doc) {
      console.log("doc:",doc)
      console.log("data:",doc.data())
      console.log("state:",state)
      if (doc && doc.data) {
        state.profileId = doc.id;
        state.profileEmail = doc.data().email || '';
        state.profileFirstName = doc.data().firstName || '';
        state.profileLastName = doc.data().lastName || '';
        state.profileUserName = doc.data().username || '';
      }
    },
    setProfileInitials(state) {
      state.profileInitials = state.profileFirstName.match(/(\b\S)?/g).join("") + state.profileLastName.match(/(\b\S)?/g).join("")
    }
  },
  actions: {
    async getCurrentUser({commit}) {
    console.log(commit)
    const auth = getAuth();
      // const database = await db.collection("users").doc(auth.currentUser.uid);
      // const dbResults = await database.get();
      // commit("setProfileInfo", dbResults);
      // commit("setProfileInitials")
      onAuthStateChanged(auth, async (user) => {
        console.log('user:', user);
        if (user) {
          console.log('db:', db);
          const database = doc(db, "users", user.uid);
          console.log('database:', database); 
          const dbResults = await getDoc(database);
          console.log('dbResults:', dbResults);
          if (dbResults.exists()) {
            commit("setProfileInfo", dbResults);
            commit("setProfileInitials");
          } else {
            console.error('Document does not exist');
          }
          // commit("setProfileInfo", dbResults);
          // commit("setProfileInitials");
          // console.log(dbResults);
        }
      });
    },
  },
  modules: {
  }
})
