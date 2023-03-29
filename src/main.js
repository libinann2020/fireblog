import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { getAuth, onAuthStateChanged } from "firebase/auth";

let app;
const auth = getAuth();
onAuthStateChanged(auth, () => {
    if(!app) {
        app = createApp(App).use(store).use(router).mount('#app');
    }
});