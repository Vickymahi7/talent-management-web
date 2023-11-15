// Enums
export enum UserType {
  SAD = "Super Admin",
  ADM = "Admin",
  HRU = "Hr User",
  USR = "User",
}

export enum UserTypeId {
  SAD = 1,
  ADM = 2,
  HRU = 3,
  USR = 4,
}

export enum AccountStatus {
  ACT = "Active",
  BLO = "Blocked",
  SUS = "Suspended",
}

export enum AccountStatusId {
  ACT = 1,
  BLO = 2,
  SUS = 3,
}

// Constants
export const USER_TYPES = [
  { id: UserTypeId.SAD, userType: UserType.SAD },
  { id: UserTypeId.ADM, userType: UserType.ADM },
  // { id: UserTypeId.HRU, userType: UserType.HRU },
  // { id: UserTypeId.USR, userType: UserType.USR },
];

export const ACCOUNT_STATUS = [
  { id: AccountStatusId.ACT, status: AccountStatus.ACT },
  { id: AccountStatusId.BLO, status: AccountStatus.BLO },
  { id: AccountStatusId.SUS, status: AccountStatus.SUS },
];
