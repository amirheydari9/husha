export interface IUserSettingRes {
  id: number,
  defaultCid: number,
  defaultSid: number,
  defaultPid: number,
  defaultUid: number,
  defaultTheme: number,
  defaultLanguage: string,
  defaultCalendar: string,
  defaultTimeZone: string,
  user: {
    id: number,
    name: string,
    family: string,
    email: string,
    username: string,
    mobile: string,
    active: boolean,
    emailActive: boolean,
    hasPassword: boolean,
    lastLoginIp: string,
    lastLoginDate: number,
    newLoginIp: number,
    newLoginDate: number,
    registerTime: number,
    roles: string[]
  }
}
