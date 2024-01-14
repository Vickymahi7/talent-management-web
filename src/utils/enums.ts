export enum UserType {
  SAD = "Super Admin",
  ADM = "Power User", // Admin / Power User
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
  INA = "Inactive",
  BLO = "Blocked",
  SUS = "Suspended",
}

export enum AccountStatusId {
  ACT = 1,
  INA = 2,
  BLO = 3,
  SUS = 4,
}

export enum ProfileStatus {
  DRAFT = 1,
  PREPARED = 2,
  VERIFIED = 3,
}
