import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "bootstrap";
import "vue-toastification/dist/index.css";
import "./assets/css/main.scss";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Toast from "vue-toastification";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faCog,
  faUser,
  faTrash,
  faPlusCircle,
  faUpload,
  faDownload,
  faPaperclip,
  faPencilAlt,
  faEnvelope,
  faPhone,
  faCheck,
  faXmark,
  faRepeat,
  faUserCheck,
  faUserXmark,
  faCamera,
  faShareFromSquare,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import DialogComponent from "./components/modals/DialogComponent.vue";
import LoadingOverlay from "./components/LoadingOverlay.vue";

library.add(
  faXmarkCircle,
  faXmark,
  faCog,
  faUser,
  faPlusCircle,
  faTrash,
  faUpload,
  faDownload,
  faPaperclip,
  faPencilAlt,
  faEnvelope,
  faPhone,
  faLinkedin,
  faCheck,
  faUserCheck,
  faRepeat,
  faUserXmark,
  faCamera,
  faShareFromSquare,
  faEnvelope,
  faEye
);
const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("loading-overlay", LoadingOverlay);
app.component("dialog-component", DialogComponent);
app.use(router);
app.use(Toast);

app.mount("#app");
