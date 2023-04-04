import { createStore } from 'vuex';
import { getAuth } from "firebase/auth";
import { doc, collection, getDoc, updateDoc, orderBy, getDocs, query, deleteDoc  } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";

export default createStore({
  state: {
    // sampleBlogCards: [
    //   {blogTitle: "Blog Card #1", blogCoverPhoto: "stock-1", blogDate: "May 1,2021"},
    //   {blogTitle: "Blog Card #2", blogCoverPhoto: "stock-2", blogDate: "May 1,2021"},
    //   {blogTitle: "Blog Card #3", blogCoverPhoto: "stock-3", blogDate: "May 1,2021"},
    //   {blogTitle: "Blog Card #4", blogCoverPhoto: "stock-4", blogDate: "May 1,2021"},
    // ],
    blogPosts: [],
    postLoaded: null,
    blogHTML: "write your blog title here...",
    blogTitle: "",
    blogPhotoName:"",
    blogPhotoFileURL: null,
    blogPhotoPreview:null,
    editPost: null,
    user: null,
    profileAdmin:null,
    profileEmail: null,
    profileFirstName: null,
    profileLastName: null,
    profileUserName: null,
    profileId: null,
    profileInitials: null
  },
  getters: {
    blogPostsFeed(state) {
      return state.blogPosts.slice(0, 2);
    },
    blogPostsCards(state){
      return state.blogPosts.slice(2, 6);
    }
  },
  mutations: {
    newBlogPost(state, payload) {
      state.blogHTML = payload;
    },
    updateBlogTitle(state, payload) {
      state.blogTitle = payload;
    },
    fileNameChange(state, payload) {
      state.blogPhotoName = payload;
    },
    createFileURL(state, payload) {
      state.blogPhotoFileURL = payload;
    },
    openPhotoPreview(state) {
      state.blogPhotoPreview = !state.blogPhotoPreview;
    },
    toggleEditPost(state, payload) {
      state.editPost = payload;
    },
    setBlogState(state, payload) {
      state.blogTitle = payload.blogTitle;
      state.blogHTML = payload.blogHTML;
      state.blogPhotoFileURL = payload.blogCoverPhoto;
      state.blogPhotoName = payload.blogCoverPhotoName;
    },
    filterBlogPost(state, payload){
      state.blogPosts = state.blogPosts.filter(post => post.blogID !== payload);
    },
    updateUser(state, payload) {
      state.user = payload;
    },
    setProfileAdmin(state, payload) {
      state.profileAdmin = payload;
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
    async getCurrentUser({commit}, user) {
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
        const token = await user.getIdTokenResult();
        const admin= await token.claims.admin;
        commit('setProfileAdmin', admin);
      } else {
        console.error('Document does not exist');
      }
    },
    async getPost({state}){
      const dataBase = query(collection(db, "blogPosts"), orderBy("date", "desc"));
      const dbResults = await getDocs(dataBase);
      dbResults.forEach((doc) => {
        if(!state.blogPosts.some((post) => post.blogID === doc.id)) {
          const data = {
            blogID : doc.data().blogID,
            blogHTML: doc.data().blogHTML,
            blogCoverPhoto: doc.data().blogCoverPhoto,
            blogTitle: doc.data().blogTitle,
            blogDate: doc.data().date,
            blogCoverPhotoName: doc.data().blogCoverPhotoName,
          };
          state.blogPosts.push(data);
        }
      });
      state.postLoaded = true;
    },
    async updatePost({commit, dispatch}, payload) {
      commit("filterBlogPost", payload);
      await dispatch("getPost");
    },
    async deletePost({commit}, payload){
      const getPost = await doc(collection(db, "blogPosts"), payload);
      await deleteDoc(getPost);
      commit('filterBlogPost', payload);
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
