<script lang="ts">
import type HrProfile from '@/types/HrProfile';
import type { Tenant } from '@/types/Tenant';
import { formatDateMonthYear } from '@/utils/dateFormats';
import { type PropType } from 'vue';
export default {
  props: {
    id: { type: String, default: 'resumePreviewModal' },
    hrProfile: { type: Object as PropType<HrProfile | undefined | null> },
    tenantSettings: { type: Object as PropType<Tenant | undefined | null> },
  },
  data() {
    return {
      formatDateMonthYear: formatDateMonthYear,
    }
  },
  computed: {
    emailId() {
      let _emailId = this.hrProfile!.email_id;
      if (this.tenantSettings?.is_official_contact_info) {
        _emailId = this.tenantSettings?.tenant_email_id;
      }
      return _emailId;
    },
    phoneNumber() {
      let _phone = this.hrProfile!.mobile;
      if (this.tenantSettings?.is_official_contact_info) {
        _phone = this.tenantSettings?.tenant_phone;
      }
      return _phone;
    }
  },
  methods: {
    async print() {
      const vue = this as any;
      await vue.$htmlToPaper('printMe', {
        styles: ['../../resTemplateStyle.css'],
        timeout: 10000,
        autoClose: true,
      }, () => {
        console.log('testing...')
      })
    }
  }
}
</script>
<template>
  <ModalComponent :id="id" title="Resume Preview" hide-footer hide-cancel centered size="modal-xl">
    <template #body>
      <template v-if="hrProfile">
        <div class="resume-template-header">
          <button class="btn btn-primary ms-2" type="button" @click="print">
            <font-awesome-icon class="me-2" icon="fa-solid fa-download" />
            Download
          </button>
          <!-- <button class="btn btn-primary ms-2" type="button">
            <font-awesome-icon class="me-2" icon="fa-solid fa-envelope" />
            Send Resume
          </button> -->
        </div>
        <div id="printMe" class="resume-template mx-auto">
          <div class="resume-wrapper border">
            <header :class="{ 'no-picture': !hrProfile.photo_url }">
              <div v-if="hrProfile.photo_url" class="picture-resume-wrapper">
                <div class="picture-resume">
                  <span>
                    <img :src="hrProfile.photo_url" alt="" />
                    <!-- <img v-else src="@/assets/img/user-icon.png" alt="" /> -->
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
                  <p class="bold html-content" v-html="hrProfile.summary"></p>
                </template>
                <h2><span class="heading">Contact</span></h2>
                <ul class="list-content contact-info">
                  <li v-if="emailId">{{ emailId }}</li>
                  <li v-if="phoneNumber">{{ phoneNumber }}</li>
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
                      <h6 v-if="education.degree || education.major">
                        <span v-if="education.degree">{{ education.degree }}</span>
                        <span v-if="education.degree && education.major">, </span>
                        <span v-if="education.major">{{ education.major }}</span>
                      </h6>
                      <p v-if="education.university || education.location" class="bold">
                        <span v-if="education.university">{{ education.university }}</span>
                        <span v-if="education.university && education.location">, </span>
                        <span v-if="education.location">{{ education.location }}</span>
                      </p>
                      <p v-if="education.end_date">{{ formatDateMonthYear(education.end_date) }}</p>
                    </div>
                  </div>
                </template>
                <template v-if="hrProfile.skills">
                  <h2><span class="heading">Technical Skills</span></h2>
                  <div class="badge-list">
                    <span class="badge-item" v-for="skill, index in hrProfile.skills" :key="index">{{ skill.skill
                    }}</span>
                  </div>
                  <!-- <ul class="list-content">
                                                                                  <li v-for="  skill, index   in   hrProfile.skills  " :key="index">{{ skill }}</li>
                                                                                </ul> -->
                </template>
              </section>
              <section class="right-section">
                <div v-if="hrProfile.work_experience" class="experience-wrapper">
                  <h2><span class="heading">Experience</span></h2>
                  <div v-for="  workExperience, index   in   hrProfile.work_experience  " :key="index" class="experience">
                    <h3>{{ workExperience.position }}</h3>
                    <div class="experience-company-wrapper">
                      <span class="experience-company me-2">{{ workExperience.company }} </span>
                      <span class="muted-text">
                        <span v-if="workExperience.start_date">{{ formatDateMonthYear(workExperience.start_date)
                        }}</span>
                        <span v-if="workExperience.start_date && workExperience.end_date"> - </span>
                        <span v-if="workExperience.end_date">{{ formatDateMonthYear(workExperience.end_date)
                        }}</span>
                      </span>
                    </div>
                    <p class="html-content" v-html="workExperience.description"></p>
                  </div>
                </div>
                <div v-if="hrProfile.project" class="project-wrapper">
                  <h2><span class="heading">Projects</span></h2>
                  <div v-for="  project, index   in   hrProfile.project  " :key="index" class="project">
                    <div class="project-title-wrapper">
                      <span class="project-title me-2">{{ project.title }} </span>
                      <span v-if="project.start_date" class="muted-text">{{
                        formatDateMonthYear(project.start_date)
                      }}</span>
                      <!-- <div class="project-role">Team Leader - </div> -->
                      <div v-if="project.client" class="project-role">Client - {{ project.client }}</div>
                      <div v-if="project.technology" class="project-technologies">
                        <span>Technologies - </span>
                        <span>{{ project.technology }}</span>
                      </div>
                    </div>
                    <p v-if="project.description">{{ project.description }}</p>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </template>
      <template>
        <p>No data</p>
      </template>
    </template>
  </ModalComponent>
</template>

<style lang="scss" scoped>
// @import url(https://fonts.googleapis.com/css?family=Varela+Round);
// @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700);

$res-template-width: 1000px;
$res-template-height: 1350px;

$text-color: #000;
$header-bg: #1f7e6c;
$header-text-color: #fff;
$heading-color: #000;
$sub-heading-color: $header-bg;
$muted-color: #777777;
$profile-title-color: $header-text-color;
$profile-title-size: 14px;
$content-padding: 15px;
$heading-size: 18px;
$profile-name-color: #fff;
$left-section-color: #7a7a7a;
$right-section-color: #000;
$left-section-bg: #e9e9e9;
$right-section-bg: #fff;
$std-margin-bottom: 5px;
$heading-margin-top: 10px;
$heading-margin-bottom: 10px;

$boldColor: #4a4e51;

*,
*::after,
*::before {
  box-sizing: border-box;
}

.ms-2 {
  margin-left: 0.5rem !important;
}

.me-2 {
  margin-right: 0.5rem !important;
}

.bold {
  color: #4a4e51;
  font-weight: 400;
}

.resume-wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  font-size: 12px;
  line-height: 1.5em;
  width: $res-template-width;
  min-height: $res-template-height;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
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
  margin-top: 0;
  margin-bottom: 0;
}

h2 {
  font-size: $heading-size;
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 1px;
  color: $heading-color;
  position: relative;
  margin-top: $heading-margin-top;
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
  margin-top: 0;
}

h5 {
  font-size: 12px;
  margin-bottom: $std-margin-bottom;
  margin-top: 0;
}

h6 {
  font-size: 12px;
  margin-bottom: 3px;
  margin-top: 0;
}

p {
  margin-bottom: $std-margin-bottom;
  margin-top: 0;
}

// .html-content>p {
//   margin: 0;
// }

header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 50px;
  background-color: $header-bg;
  color: $header-text-color;

  &.no-picture {
    justify-content: left;
    padding: $content-padding;
    height: 200px;
  }

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
  flex: 1;
  display: flex;
  text-align: left;
  height: 100%;
}

.left-section {
  flex: 40%;
  color: $left-section-color;
  background-color: $left-section-bg;
  padding: $content-padding;

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
    color: $text-color;
  }

  .badge-list {

    .badge-item {
      padding: 2px 5px;
      color: $header-text-color;
      background-color: $header-bg;
      border-radius: 5px;
      display: inline-block;
      margin-right: 3px;
      margin-bottom: 3px;
    }
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
      margin-bottom: 3px;
      color: $text-color;
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
  padding: $content-padding;

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