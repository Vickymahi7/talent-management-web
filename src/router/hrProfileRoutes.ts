import HrProfile from "@/views/hrProfile/HrProfile.vue";
import HrProfileManagement from "@/views/hrProfile/HrProfileManagement.vue";
import ResumePreview from "@/views/hrProfile/ResumePreview.vue";

const hrProfileRoutes = [
  {
    path: "/hrprofile/:id",
    name: "hrprofile",
    component: HrProfile,
    props: true,
  },
  {
    path: "/hrprofilemanagement",
    name: "hrprofilemanagement",
    component: HrProfileManagement,
  },
  {
    path: "/resumepreview/:id",
    name: "resumepreview",
    component: ResumePreview,
    props: true,
  },
];

export default hrProfileRoutes;
