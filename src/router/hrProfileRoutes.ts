import HrProfile from '@/views/hrProfile/HrProfile.vue'
import HrProfileManagement from '@/views/hrProfile/HrProfileManagement.vue'

const hrProfileRoutes = [
  {
    path: '/hrprofile/:id',
    name: 'hrprofile',
    component: HrProfile,
    props: true,
  },
  {
    path: '/hrprofilemanagement',
    name: 'hrprofilemanagement',
    component: HrProfileManagement,
  },
];

export default hrProfileRoutes
