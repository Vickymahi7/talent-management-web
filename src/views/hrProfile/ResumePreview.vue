<script lang="ts">
import axios from '@/plugins/axios';
import type { Education } from '@/types/Education';
import type { Project } from '@/types/Project';
import type { WorkExperience } from '@/types/WorkExperience';
import { useToast } from 'vue-toastification';

export default {
  props: ['id'],

  data() {
    return {
      toast: useToast(),

      hrProfile: {
        id: '',
        hr_profile_id: '',
        tenant_id: '',
        hr_profile_type_id: '',
        first_name: '',
        last_name: '',
        middle_name: '',
        profile_title: '',
        email_id: '',
        alternate_email_id: '',
        mobile: '',
        alternate_mobile: '',
        phone: '',
        office_phone: '',
        location: '',
        ctc: '',
        objective: '',
        summary: '',
        note: '',
        gender: '',
        date_of_birth: null,
        resume_url: '',
        photo_url: '',
        buiding_number: '',
        street_name: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        website: '',
        facebook_id: '',
        twitter_id: '',
        linkedin_id: '',
        skype_id: '',
        status: '',
        status_id: '',
        user_id: '',
        active: true,
        created_by_id: '',
        created_dt: '',
        last_updated_dt: '',
        skills: [] as string[],
        work_experience: [] as WorkExperience[],
        project: [] as Project[],
        education: [] as Education[],
        docs: [],
      },
    }
  },
  mounted() {
    this.getHrProfile();
  },
  methods: {
    async getHrProfile() {
      try {
        const response: any = await axios.get('/hrprofile/view/' + this.id);
        this.hrProfile = response.hrProfile;
      } catch (error: any) {
        this.toast.error(error.message);
      }
    },
  }
}
</script>
<template>
  <div class="resume-template">
    <div class="resume-wrapper">
      <header>
        <div class="picture-resume-wrapper">
          <div class="picture-resume">
            <span>
              <img v-if="hrProfile.photo_url" :src="hrProfile.photo_url" alt="" />
              <img v-else src="@/assets/img/user-icon.jpg" alt="" />
            </span>
          </div>
        </div>
        <div class="name-wrapper">
          <h1>{{ hrProfile.first_name }} {{ hrProfile.last_name }}</h1>
          <p v-if="hrProfile.profile_title" class="profile-title">{{ hrProfile.profile_title }}</p>
          <p v-if="hrProfile.objective" class="about">
            {{ hrProfile.objective }}
          </p>
        </div>
      </header>
      <main class="resume-body">
        <section class="left-section">
          <template v-if="hrProfile.summary">
            <h2><span class="heading">Summary</span></h2>
            <p class="">
              {{ hrProfile.summary }}
            </p>
          </template>
          <h2><span class="heading">Contact</span></h2>
          <ul class="list-content contact-info">
            <li v-if="hrProfile.email_id">{{ hrProfile.email_id }}</li>
            <li v-if="hrProfile.mobile">{{ hrProfile.mobile }}</li>
            <li v-if="hrProfile.website">{{ hrProfile.website }}</li>
            <li v-if="hrProfile.city">
              {{ hrProfile.city }}
              <span v-if="hrProfile.city && hrProfile.country">, </span>
              <span v-if="hrProfile.country">{{ hrProfile.country }}</span>
            </li>
          </ul>
          <template v-if="hrProfile.education">
            <h2><span class="heading">Education</span></h2>
            <div class="education-info">
              <div v-for="  education, index in hrProfile.education" :key="index" class="education-detail">
                <h6 v-if="education.start_date">{{ education.start_date }}</h6>
                <p v-if="education.degree || education.major">
                  <span v-if="education.degree">{{ education.degree }}</span>
                  <span v-if="education.major">{{ education.major }}</span>
                </p>
                <p v-if="education.university || education.location">
                  <span v-if="education.university">{{ education.university }}</span>
                  <span v-if="education.location">{{ education.location }}</span>
                </p>
              </div>
            </div>
          </template>
          <template v-if="hrProfile.skills">
            <h2><span class="heading">Technical Skills</span></h2>
            <ul class="list-content">
              <li v-for="  skill, index   in   hrProfile.skills  " :key="index">{{ skill }}</li>
            </ul>
          </template>
        </section>
        <section class="right-section">
          <div v-if="hrProfile.work_experience" class="experience-wrapper">
            <h2><span class="heading">Experience</span></h2>
            <div v-for="  workExperience, index   in   hrProfile.work_experience  " :key="index" class="experience">
              <h3>{{ workExperience.position }}</h3>
              <div class="experience-company-wrapper">
                <span class="experience-company me-2">{{ workExperience.company }} </span>
                <span class="muted-text">{{ workExperience.start_date }} - {{ workExperience.end_date }},
                  {{ workExperience.location }}</span>
              </div>
              <p>{{ workExperience.description }}</p>
            </div>
          </div>
          <div v-if="hrProfile.project" class="project-wrapper">
            <h2><span class="heading">Projects</span></h2>
            <div v-for="  project, index   in   hrProfile.project  " :key="index" class="project">
              <div class="project-title-wrapper">
                <span class="project-title me-2">{{ project.title }} </span>
                <span class="muted-text">{{ project.start_date }}</span>
                <!-- <div class="project-role">Team Leader - </div> -->
                <div class="project-role">Client - {{ project.client }}</div>
                <div class="project-technologies">
                  <span>Technologies - </span>
                  <span>{{ project.technology }}</span>
                </div>
              </div>
              <p>{{ project.description }}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import url(https://fonts.googleapis.com/css?family=Varela+Round);
@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700);

$header-bg: #1f7e6c;
$header-text-color: #fff;
$heading-color: #000;
$sub-heading-color: $header-bg;
$muted-color: #777777;
$profile-title-color: header-text-color;
$profile-title-size: 14px;
$heading-size: 18px;
$profile-name-color: #fff;
$left-section-color: #7a7a7a;
$right-section-color: #000;
$left-section-bg: #e9e9e9;
$right-section-bg: #fff;
$std-margin-bottom: 8px;
$heading-margin-bottom: 12px;

$boldColor: #4a4e51;

*,
*::after,
*::before {
  box-sizing: border-box;
}

.resume-wrapper {
  // font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  line-height: 1.5em;
  height: 100%;
}

a {
  text-decoration: none;
}

.muted-text {
  color: $muted-color;
}

.bold {
  color: $boldColor;
  font-weight: 400;
}

h1 {
  font-size: 3.5em;
  // font-family: 'Varela Round', sans-serif;
  text-transform: uppercase;
  line-height: 1em;
  letter-spacing: 2px;
  color: $profile-name-color;
}

h2 {
  font-size: $heading-size;
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 1px;
  color: $heading-color;
  position: relative;
  margin-bottom: $heading-margin-bottom;

  .heading {
    position: relative;
  }

  .heading::before {
    position: absolute;
    content: "";
    width: 70%;
    height: 3px;
    background-color: $header-bg;
    bottom: -2px;
  }
}

h3 {
  color: $sub-heading-color;
  text-transform: uppercase;
  font-size: 16px;
  margin-bottom: 0;
  font-weight: 500;
}

h5 {
  font-size: 12px;
  margin-bottom: $std-margin-bottom;
}

p {
  margin-bottom: $std-margin-bottom;
}

header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 50px;
  background-color: $header-bg;
  color: $header-text-color;

  .picture-resume-wrapper {
    display: block;
    float: left;

    .picture-resume {
      width: 200px;
      height: 200px;
      background-size: cover;
      border-radius: 50%;
      margin-right: 0px;
      display: table;
      position: relative;
      vertical-align: middle;

      span {
        display: table-cell;
        vertical-align: middle;
        position: relative;
        margin: 0 auto;
        z-index: 10;
        text-align: center
      }

      img {
        border-radius: 50%;
        width: 150px;
        height: 150px;
      }
    }
  }

  .name-wrapper {
    text-align: left;

    .profile-title {
      font-size: $profile-title-size;
      color: $profile-title-color;
    }
  }

  .about {
    font-style: italic;
  }

}

.resume-body {
  display: flex;
  text-align: left;
  height: 100%;
}

.left-section {
  flex: 40%;
  color: $left-section-color;
  background-color: $left-section-bg;
  padding: 25px 20px;

  ul {
    margin: 0;
  }

  li {
    // margin-bottom: 8px;
    margin-bottom: $std-margin-bottom;

  }

  .contact-info {
    font-weight: bold;
    font-style: italic;
  }

  .list-content {
    text-align: left;
    margin-top: 13px;
    // font-weight: 300;
  }

  .education-info {
    // margin-bottom: $std-margin-bottom;

    h6 {
      font-size: 12px;
      font-style: italic;
      margin-bottom: $std-margin-bottom;
    }

    p {
      margin: 0;
    }

    .education-detail {
      margin-bottom: $std-margin-bottom;
    }
  }

}


.right-section {
  flex: 70%;
  color: $right-section-color;
  background-color: $right-section-bg;
  padding: 25px 20px;

  .experience {

    .experience-company-wrapper {
      margin-bottom: $std-margin-bottom;
    }

    .experience-company {
      font-weight: bold;
      text-transform: uppercase;
    }
  }

  .project-title-wrapper {
    margin-bottom: $std-margin-bottom;
  }

  .project-title {
    text-transform: uppercase;
    font-weight: bold;
  }

  .project-role,
  .project-technologies {
    font-style: italic;
  }
}
</style>