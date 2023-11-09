import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/views/HomePage.vue";
import LoginLayout from "@/layouts/LoginLayout.vue";
import HrProfile from "@/views/hrProfile/HrProfile.vue";
import HrProfileManagement from "@/views/hrProfile/HrProfileManagement.vue";
import ResumePreview from "@/views/hrProfile/ResumePreview.vue";
import TenantManagement from "@/views/tenant/TenantManagement.vue";
import UserManagement from "@/views/user/UserManagement.vue";
import { UserType } from "@/enums/UserType";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: { layout: LoginLayout },
  },

  // Tenant Routes
  {
    path: "/tenantmanagement",
    name: "tenantmanagement",
    component: TenantManagement,
    meta: { accessedBy: [UserType.SAD] },
  },

  // User Routes
  {
    path: "/usermanagement",
    name: "usermanagement",
    component: UserManagement,
    meta: { accessedBy: [UserType.SAD, UserType.ADM] },
  },

  // Hr Profile Routes
  {
    path: "/hrprofile/:id",
    name: "hrprofile",
    component: HrProfile,
    props: true,
    meta: { accessedBy: [UserType.ADM] },
  },
  {
    path: "/hrprofilemanagement",
    name: "hrprofilemanagement",
    component: HrProfileManagement,
    meta: { accessedBy: [UserType.ADM] },
  },
  {
    path: "/resumepreview/:id",
    name: "resumepreview",
    component: ResumePreview,
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
  const userTypeId = parseInt(localStorage.getItem("userTypeId"));

  console.log(to.path, userTypeId, to.meta.accessedBy);

  if (!homePage) {
    if (to.meta.accessedBy.includes(userTypeId)) {
      next();
    } else {
      next("/");
    }
  } else {
    next();
  }
});

export default router;
