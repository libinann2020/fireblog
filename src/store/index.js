import { createStore } from 'vuex';
import { getAuth } from "firebase/auth";
import { doc, collection, getDoc, updateDoc } from "firebase/firestore";
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
    profileUserName: null,
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
      state.user = payload;
    },
    setProfileInfo(state, doc) {
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
    },
    changeFirstName(state, payload) {
      state.profileFirstName = payload;
    },
    changeLastName(state, payload) {
      state.profileLastName = payload;
    },
    changeUserName(state, payload) {
      state.profileUserName = payload;
    },
  },
  actions: {
    async getCurrentUser({commit}) {
      // const database = await db.collection("users").doc(firebase.auth().currentUser.uid);
      // const dbResults = await database.get();
      // commit("setProfileInfo", dbResults);
      // commit("setProfileInitials")
      const auth = getAuth();
      const database = doc(collection(db, "users"), auth.currentUser.uid);
      const dbResults = await getDoc(database);
      if (dbResults.exists()) {
        commit("setProfileInfo", dbResults);
        commit("setProfileInitials");
      } else {
        console.error('Document does not exist');
      }
    },
    async updateUserSettings({commit,state}) {
      // const auth = getAuth();
      const database = doc(collection(db, "users"), state.profileId);
      await updateDoc(database, {
        firstName: state.profileFirstName,
        lastName: state.profileLastName,
        username: state.profileUserName
      });
      commit("setProfileInitials");
    },
  },
  modules: {
  }
})
