import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: "/country/:code",
      name: "Country Detail Page",
      component: () => import('../views/CountryView.vue'),
    },
  ],
});

export default router;
