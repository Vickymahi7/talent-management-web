import { PROFILE_STATUS } from "./constants";

export function fileUploadBtnClick(elementId: string) {
  const inputEl = document.getElementById(elementId);
  inputEl?.click();
}

export function getProfileStatusById(statusId?: number) {
  if (statusId) {
    return PROFILE_STATUS.find((data) => data.id == statusId)?.status ?? "";
  } else return "";
}
