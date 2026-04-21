import { createApp } from "vue";
import "./styles/mug.scss";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import App from "./App.vue";
//import { startData } from "./firebase";

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

//const app = createApp(App).use(pinia).mount("#app");
createApp(App).use(pinia).mount("#app");


// startData().then(() => {
//     console.log("Data initialized");
//     app.mount("#app");
// });

