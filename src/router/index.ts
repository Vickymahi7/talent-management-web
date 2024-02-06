import { useRouteCheck } from "@/composables/useRouteCheck";
import BlankLayout from "@/layouts/BlankLayout.vue";
import FullscreenLayout from "@/layouts/FullscreenLayout.vue";
import StandardLayout from "@/layouts/StandardLayout.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomePage.vue"),
  },

  // Tenant Routes
  {
    path: "/tenantmanagement",
    name: "tenantmanagement",
    component: () => import("@/views/tenant/TenantManagement.vue"),
    meta: { layout: StandardLayout, requiresAuth: true },
    // accessedBy: [UserTypeId.PUS, UserTypeId.USR],
  },

  // User Routes
  {
    path: "/usermanagement",
    name: "usermanagement",
    component: () => import("@/views/user/UserManagement.vue"),
    meta: {
      layout: StandardLayout,
      requiresAuth: true,
    },
  },
  {
    path: "/userregistration/:token",
    name: "userregistration",
    component: () => import("@/views/user/InvitedUserRegistration.vue"),
    props: true,
  },
  {
    path: "/useractivation/:token",
    name: "useractivation",
    component: () => import("@/views/user/UserActivation.vue"),
    props: true,
  },
  {
    path: "/resetpassword/:token",
    name: "resetpassword",
    component: () => import("@/views/user/ResetPassword.vue"),
    props: true,
  },

  // Hr Profile Routes
  {
    path: "/hrprofile/:id",
    name: "hrprofile",
    component: () => import("@/views/hrProfile/HrProfile.vue"),
    props: true,
    meta: {
      // layout: StandardLayout,
      layout: BlankLayout,
      requiresAuth: false,
    },
  },
  {
    path: "/userhrprofile",
    name: "userhrprofile",
    component: () => import("@/views/hrProfile/HrProfile.vue"),
    props: true,
    meta: {
      layout: StandardLayout,
      requiresAuth: true,
    },
  },
  {
    path: "/resumeattachmentpreview/:id",
    name: "resumeattachmentpreview",
    component: () => import("@/views/hrProfile/ResumeAttachmentPreview.vue"),
    props: true,
    meta: {
      layout: FullscreenLayout,
      requiresAuth: true,
    },
  },
  {
    path: "/hrprofilemanagement",
    name: "hrprofilemanagement",
    component: () => import("@/views/hrProfile/HrProfileManagement.vue"),
    meta: {
      layout: StandardLayout,
      requiresAuth: true,
    },
  },
  {
    path: "/talentpool",
    name: "talentpool",
    component: () => import("@/views/hrProfile/TalentPool.vue"),
    meta: {
      layout: StandardLayout,
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

const routeCheck = useRouteCheck();

router.beforeEach(async (to, from, next) => {
  const homePage = to.name === "home";
  const meta: any = to.meta;
  if (!homePage && meta.requiresAuth) {
    // const canAccess = await routeCheck.canUserAccess(to.name);
    const canAccess = true;
    console.log("canAccess: ", canAccess);
    if (!canAccess) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
