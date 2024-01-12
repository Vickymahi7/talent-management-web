import { useRouteCheck } from "@/composables/useRouteCheck";
import StandardLayout from "@/layouts/StandardLayout.vue";
import { UserTypeId } from "@/utils/enums";
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
    meta: { layout: StandardLayout, accessedBy: [UserTypeId.SAD] },
  },

  // User Routes
  {
    path: "/usermanagement",
    name: "usermanagement",
    component: () => import("@/views/user/UserManagement.vue"),
    meta: {
      layout: StandardLayout,
      accessedBy: [UserTypeId.SAD, UserTypeId.ADM, UserTypeId.USR],
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
      layout: StandardLayout,
      accessedBy: [UserTypeId.ADM, UserTypeId.USR],
    },
  },
  {
    path: "/userhrprofile",
    name: "userhrprofile",
    component: () => import("@/views/hrProfile/HrProfile.vue"),
    props: true,
    meta: {
      layout: StandardLayout,
      accessedBy: [UserTypeId.SAD, UserTypeId.ADM, UserTypeId.USR],
    },
  },
  {
    path: "/hrprofilemanagement",
    name: "hrprofilemanagement",
    component: () => import("@/views/hrProfile/HrProfileManagement.vue"),
    meta: {
      layout: StandardLayout,
      accessedBy: [UserTypeId.ADM, UserTypeId.USR],
    },
  },
  {
    path: "/talentpool",
    name: "talentpool",
    component: () => import("@/views/hrProfile/TalentPool.vue"),
    meta: {
      layout: StandardLayout,
      accessedBy: [UserTypeId.ADM, UserTypeId.USR],
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
  const userTypeId = localStorage.getItem("userTypeId")
    ? parseInt(localStorage.getItem("userTypeId")!)
    : null;

  const meta: any = to.meta;
  console.log(meta.accessedBy);
  console.log(to.name);
  if (!homePage && meta.accessedBy) {
    const canAccess = await routeCheck.canUserAccess(to.name);
    console.log("hasAccess: ", canAccess);
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
