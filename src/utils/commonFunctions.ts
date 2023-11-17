import { Modal } from "bootstrap";
import { ACCOUNT_STATUS, PROFILE_STATUS, USER_TYPES } from "./constants";

export function fileUploadBtnClick(elementId: string) {
  const inputEl = document.getElementById(elementId);
  inputEl?.click();
}

export function getTenantStatusById(statusId: number | null) {
  if (statusId) {
    return ACCOUNT_STATUS.find((data) => data.id == statusId)?.status ?? "";
  } else {
    return "";
  }
}

export function getProfileStatusById(statusId?: number | null) {
  if (statusId) {
    return PROFILE_STATUS.find((data) => data.id == statusId)?.status ?? "";
  } else return "";
}

export function getUserStatusById(statusId: number | null) {
  if (statusId) {
    return ACCOUNT_STATUS.find((data) => data.id == statusId)?.status ?? "";
  } else {
    return "";
  }
}

export function getUserTypeById(typeId: number | null) {
  if (typeId) {
    return USER_TYPES.find((data) => data.id == typeId)?.userType ?? "";
  } else {
    return "";
  }
}

export function bsModalShow(elementId: string) {
  const myModal = new Modal(document.getElementById(elementId)!, {
    keyboard: false,
  });
  myModal.show();
}

export function bsModalHide(elementId: string) {
  const myModal = Modal.getOrCreateInstance(
    document.getElementById(elementId)!,
    {
      keyboard: false,
    }
  );
  myModal.hide();
}
