// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap";
import "element-plus/dist/index.css";
import "vue-toastification/dist/index.css";
import "./assets/css/main.scss";

import { EventType, type AuthenticationResult } from "@azure/msal-browser";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faCopy, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faCamera,
  faCheck,
  faCog,
  faDownload,
  faEllipsisVertical,
  faEnvelope,
  faEye,
  faPaperclip,
  faPencilAlt,
  faPhone,
  faPlusCircle,
  faRepeat,
  faRightFromBracket,
  faShareFromSquare,
  faTrash,
  faUpload,
  faUser,
  faUserCheck,
  faUserXmark,
  faXmark,
  faToolbox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ElementPlus from "element-plus";
import { createApp } from "vue";
import Toast from "vue-toastification";
import App from "./App.vue";
import LoadingOverlay from "./components/LoadingOverlay.vue";
import DialogComponent from "./components/modals/DialogComponent.vue";
import VueHtmlToPaper from "./plugins/VueHtmlToPaper";
import { msalPlugin } from "./plugins/msalPlugin";
import router from "./router";
import { msalInstance } from "./utils/authConfig";

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
  faEye,
  faEllipsisVertical,
  faCopy,
  faRightFromBracket,
  faToolbox
);
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("loading-overlay", LoadingOverlay);
app.component("dialog-component", DialogComponent);
app.use(ElementPlus);
app.use(VueHtmlToPaper);
app.use(router);
app.use(msalPlugin, msalInstance);
app.use(Toast);

app.mount("#app");
