import HrProfile from '@/views/HrProfile/HrProfile.vue'
import HrProfileManagement from '@/views/HrProfile/HrProfileManagement.vue'

const hrProfileRoutes = [
  {
    path: '/hrprofile',
    name: 'hrprofile',
    component: HrProfile,
  },
  {
    path: '/hrprofilemanagement',
    name: 'hrprofilemanagement',
    component: HrProfileManagement,
  },
];

export default hrProfileRoutes
