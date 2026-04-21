<template>
  <div>
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />
    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :id="`r${b.id}`"
              :value="b"
              v-model="beverageStore.currentBase"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :id="`r${s.id}`"
              :value="s"
              v-model="beverageStore.currentSyrup"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>
    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :id="`r${c.id}`"
              :value="c"
              v-model="beverageStore.currentCreamer"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>
    <input type="text" placeholder="Beverage Name" v-model="beverageStore.currentName" />
    <button :disabled="!beverageStore.user" @click="makeBeverage()">🍺 Make Beverage</button>
    <p v-if="message">{{ message }}</p>

    <ul>
      <button v-if="beverageStore.user == null" @click="withGoogle()">Sign in with Google</button>
      <li v-else>
        Signed in as {{ beverageStore.user.displayName || beverageStore.user.email }}
        <button @click="signOut()">Sign out</button>
      </li>
    </ul>

    <ul v-if="beverageStore.user != null && beverageStore.beverages.length > 0">
      <li>
        <label>Your Saved Beverages:</label>
        <select v-model="beverageStore.currentBeverage" @change="beverageStore.showBeverage()">
          <option v-for="b in beverageStore.beverages" :key="b.id" :value="b">
            {{ b.name }}
          </option>
        </select>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";

const beverageStore = useBeverageStore();
const message = ref("");

onMounted(async () => {
  await beverageStore.init();

  onAuthStateChanged(auth, (user) => {
    beverageStore.setUser(user);
  });
});

async function withGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(getAuth(), provider);
  } catch (error: any) {
    message.value = "Error signing in: " + error.message;
  }
}

async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    message.value = "Error signing out: " + error.message;
  }
}

function makeBeverage() {
  message.value = beverageStore.makeBeverage();
}
</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}
ul {
  list-style: none;
}
</style>