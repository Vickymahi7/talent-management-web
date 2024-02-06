import { AccountStatus, AccountStatusId, UserType, UserTypeId } from "./enums";

export const USER_TYPES = [
  { id: UserTypeId.SAD, userType: UserType.SAD },
  { id: UserTypeId.PUS, userType: UserType.PUS },
  // { id: UserTypeId.HRU, userType: UserType.HRU },
  { id: UserTypeId.USR, userType: UserType.USR },
];

export const ACCOUNT_STATUS = [
  { id: AccountStatusId.ACT, status: AccountStatus.ACT },
  { id: AccountStatusId.INA, status: AccountStatus.INA },
  { id: AccountStatusId.BLO, status: AccountStatus.BLO },
  { id: AccountStatusId.SUS, status: AccountStatus.SUS },
];

export const PROFILE_STATUS = [
  { id: 1, status: "Draft" },
  { id: 2, status: "Prepared" },
  { id: 3, status: "Verified" },
];
