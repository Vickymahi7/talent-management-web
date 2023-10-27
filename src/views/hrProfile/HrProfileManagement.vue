<script>
import axios from '@/plugins/axios.js'
export default {
  data() {
    return {
      hrProfileList: [],
    }
  },
  mounted() {
    this.grtHrProfileList();
  },
  methods: {
    grtHrProfileList: function () {
      let data = {
        email_id: '',
        skills: '',
      }
      axios.get('/hrprofile/list', data)
        .then((response) => {
          let result = response.data;
          this.hrProfileList = result.hrProfileList;
        })
    },
  }
}
</script>
<template>
  <div class="content-card content-header">
    <label>Manage HR Profile</label>
  </div>
  <div class="content-body content-card">
    <div class="row py-2">
      <div class="col-3">
        <input type="text" class="form-control" placeholder="Type Something" aria-label="Search">
      </div>
      <div class="col-2">
        <select class="form-select" aria-label="Default select example">
          <option value="">Resource Type</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <div class="col-2">
        <select class="form-select" aria-label="Default select example">
          <option value="">Resource Type</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </select>
      </div>
      <div class="col text-end">
        <button class="btn btn-dark mx-2" type="submit">
          <font-awesome-icon class="me-2" :icon="['fas', 'plus-circle']" />
          New Resource
        </button>
        <button class="btn btn-dark" type="submit">
          <font-awesome-icon class="me-2" :icon="['fas', 'upload']" />
          Resource Excel Import
        </button>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-borderless custom-table-style">
        <thead class="table-dark">
          <tr>
            <th scope="col">
              <input class="form-check-input" type="checkbox">
            </th>
            <th scope="col">ID</th>
            <th scope="col">Resource Name</th>
            <th scope="col">Position</th>
            <th scope="col">Resource Type</th>
            <th scope="col">Email ID</th>
            <th scope="col">Profile Status</th>
            <th scope="col">Last Updated</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody class="custom-tbody-style">
          <tr v-for="(hrProfile, index) in hrProfileList" :key="hrProfile.id">
            <td>
              <input class="form-check-input" type="checkbox">
            </td>
            <td>{{ index + 1 }}</td>
            <td>{{ hrProfile.first_name }} {{ hrProfile.last_name }}</td>
            <td>{{ hrProfile.position }}</td>
            <td>{{ hrProfile.resource_type }}</td>
            <td>{{ hrProfile.email_id }}</td>
            <td>{{ hrProfile.active ? 'Active' : 'Inactive' }}</td>
            <td>{{ hrProfile.last_updated_dt }}</td>
            <td>
              <div class="icon-btn me-3">
                <font-awesome-icon :icon="['fas', 'paperclip']" />
              </div>
              <div class="icon-btn me-3">
                <font-awesome-icon :icon="['fas', 'download']" />
              </div>
              <div class="icon-btn me-3">
                <font-awesome-icon :icon="['fas', 'trash']" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>