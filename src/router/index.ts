import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import LoginLayout from "@/layouts/LoginLayout.vue";
import hrProfileRoutes from "@/router/hrProfileRoutes.js";
import tenantRoutes from "./tenantRoutes";
import userRoutes from "@/router/userRoutes.js";

const baseRoutes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: { layout: LoginLayout },
  },
];

const routes = baseRoutes.concat(hrProfileRoutes, tenantRoutes, userRoutes);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;
