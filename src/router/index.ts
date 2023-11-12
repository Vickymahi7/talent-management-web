import { createRouter, createWebHistory, type RouteMeta } from "vue-router";
import { UserType } from "@/enums/UserType";
import LoginLayout from "@/layouts/LoginLayout.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: (() => import("@/views/HomePage.vue")),
    meta: { layout: LoginLayout },
  },

  // Tenant Routes
  {
    path: "/tenantmanagement",
    name: "tenantmanagement",
    component: (() => import("@/views/tenant/TenantManagement.vue")),
    meta: { accessedBy: [UserType.SAD] },
  },

  // User Routes
  {
    path: "/usermanagement",
    name: "usermanagement",
    component: (() => import("@/views/user/UserManagement.vue")),
    meta: { accessedBy: [UserType.SAD, UserType.ADM] },
  },

  // Hr Profile Routes
  {
    path: "/hrprofile/:id",
    name: "hrprofile",
    component: (() => import("@/views/hrProfile/HrProfile.vue")),
    props: true,
    meta: { accessedBy: [UserType.ADM] },
  },
  {
    path: "/hrprofilemanagement",
    name: "hrprofilemanagement",
    component: (() => import("@/views/hrProfile/HrProfileManagement.vue")),
    meta: { accessedBy: [UserType.ADM] },
  },
  {
    path: "/resumepreview/:id",
    name: "resumepreview",
    component: (() => import("@/views/hrProfile/ResumePreview.vue")),
    props: true,
    meta: { accessedBy: [UserType.ADM] },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const homePage = to.name === "home";
  const userTypeId = localStorage.getItem("userTypeId") ? parseInt(localStorage.getItem("userTypeId")!) : null;

  const meta: any = to.meta;
  if (!homePage) {
    if (meta.accessedBy.includes(userTypeId)) {
      next();
    } else {
      next("/");
    }
  } else {
    next();
  }
});

export default router;
