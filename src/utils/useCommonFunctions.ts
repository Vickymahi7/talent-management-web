import { Modal } from "bootstrap";
import { ACCOUNT_STATUS, PROFILE_STATUS, USER_TYPES } from "./constants";

export function useCommonFunctions() {
  const pluralize = (unit: string, value: number) => {
    return value === 1 ? `${unit}` : `${unit}s`;
  };

  const getExperienceString = (
    expYear?: number | null,
    expMonth?: number | null
  ) => {
    let stringVal = "";

    // check & change year & month text to plural if needed
    const yearUnit = expYear ? pluralize("year", expYear) : "";
    const monthUnit = expMonth ? pluralize("month", expMonth) : "";

    if (expYear && expMonth) {
      stringVal = `${expYear} ${yearUnit} ${expMonth} ${monthUnit}`;
    } else if (expYear) {
      stringVal = `${expYear} ${yearUnit}`;
    } else if (expMonth) {
      stringVal = `${expMonth} ${monthUnit}`;
    }
    return stringVal;
  };

  const fileUploadBtnClick = (elementId: string) => {
    const inputEl = document.getElementById(elementId);
    inputEl?.click();
  };

  const getTenantStatusById = (statusId: number | null) => {
    if (statusId) {
      return ACCOUNT_STATUS.find((data) => data.id == statusId)?.status ?? "";
    } else {
      return "";
    }
  };

  const getProfileStatusById = (statusId?: number | null) => {
    if (statusId) {
      return PROFILE_STATUS.find((data) => data.id == statusId)?.status ?? "";
    } else return "";
  };

  const getUserStatusById = (statusId: number | null) => {
    if (statusId) {
      return ACCOUNT_STATUS.find((data) => data.id == statusId)?.status ?? "";
    } else {
      return "";
    }
  };

  const getUserTypeById = (typeId: number | null) => {
    if (typeId) {
      return USER_TYPES.find((data) => data.id == typeId)?.userType ?? "";
    } else {
      return "";
    }
  };

  const bsModalShow = (elementId: string) => {
    const myModal = new Modal(document.getElementById(elementId)!, {
      keyboard: false,
    });
    myModal.show();
  };

  const bsModalHide = (elementId: string) => {
    const myModal = Modal.getOrCreateInstance(
      document.getElementById(elementId)!,
      {
        keyboard: false,
      }
    );
    myModal.hide();
  };

  return {
    getExperienceString,
    fileUploadBtnClick,
    getTenantStatusById,
    getProfileStatusById,
    getUserStatusById,
    getUserTypeById,
    bsModalShow,
    bsModalHide,
  };
}
