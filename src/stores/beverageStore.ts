import { defineStore } from "pinia";
import {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";
import tempretures from "../data/tempretures.json";
import type { User } from "firebase/auth";
import db from "../firebase.ts";
import {
  collection,
  getDocs,
  addDoc,
  Unsubscribe,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  onSnapshot,
  where,
} from "firebase/firestore";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: [] as BaseBeverageType[],
    currentBase: null as BaseBeverageType | null,
    syrups: [] as SyrupType[],
    currentSyrup: null as SyrupType | null,
    creamers: [] as CreamerType[],
    currentCreamer: null as CreamerType | null,
    beverages: [] as BeverageType[],
    currentBeverage: null as BeverageType | null,
    currentName: "",
    user: null as User | null,
    beverageListener: null as Unsubscribe | null,
    initialized: false,
  }),

  actions: {
    async init() {
      const [basesSnap, creamersSnap, syrupsSnap] = await Promise.all([
        getDocs(collection(db, "bases")),
        getDocs(collection(db, "creamers")),
        getDocs(collection(db, "syrups")),
      ]);

      this.bases = basesSnap.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      })) as BaseBeverageType[];

      this.creamers = creamersSnap.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      })) as CreamerType[];

      this.syrups = syrupsSnap.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      })) as SyrupType[];

      if (this.bases.length > 0) this.currentBase = this.bases[0];
      if (this.creamers.length > 0) this.currentCreamer = this.creamers[0];
      if (this.syrups.length > 0) this.currentSyrup = this.syrups[0];

      this.initialized = true;
    },

    setUser(user: User | null) {
      this.user = user;

      if (this.beverageListener) {
        this.beverageListener();
        this.beverageListener = null;
      }

      this.beverages = [];
      this.currentBeverage = null;
      this.currentBase = this.bases[0] || null;
      this.currentCreamer = this.creamers[0] || null;
      this.currentSyrup = this.syrups[0] || null;
      this.currentTemp = this.temps[0];
      this.currentName = "";

      if (!user) return;

      const q = query(collection(db, "beverages"), where("userId", "==", user.uid));

      this.beverageListener = onSnapshot(q, (snapshot: QuerySnapshot) => {
        this.beverages = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            name: data.name,
            temp: data.temperature,
            base: this.bases.find((b) => b.id === data.base) || this.bases[0],
            creamer: this.creamers.find((c) => c.id === data.creamer) || this.creamers[0],
            syrup: this.syrups.find((s) => s.id === data.syrup) || this.syrups[0],
          } as BeverageType;
        });

        if (this.beverages.length > 0 && !this.currentBeverage) {
          this.currentBeverage = this.beverages[0];
          this.showBeverage();
        }
      });
    },

    makeBeverage() {
      if (!this.user) {
        return "No user logged in, please sign in first.";
      }

      if (
        !this.currentName.trim() ||
        !this.currentBase ||
        !this.currentCreamer ||
        !this.currentSyrup ||
        !this.currentTemp
      ) {
        return "Please complete all beverage options and the name before making a beverage.";
      }

      const beverageData = {
        userId: this.user.uid,
        name: this.currentName,
        temperature: this.currentTemp,
        base: this.currentBase.id,
        creamer: this.currentCreamer.id,
        syrup: this.currentSyrup.id,
        createdAt: new Date(),
      };

      addDoc(collection(db, "beverages"), beverageData).catch((error) => {
        console.error(error);
      });

      return `Beverage ${this.currentName} made successfully!`;
    },

    showBeverage() {
      if (this.currentBeverage != null) {
        this.currentBase = this.currentBeverage.base;
        this.currentCreamer = this.currentBeverage.creamer;
        this.currentSyrup = this.currentBeverage.syrup;
        this.currentTemp = this.currentBeverage.temp;
        this.currentName = this.currentBeverage.name;
      }
    },
  },
});