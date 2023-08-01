export interface IGetServicesRes {
  id: number,
  title: string,
  serviceType: {
    "id": number,
    "title": string,
    "isActive": boolean
  },
  logo: string,
  description: string,
  menuOrder: number,
  status: number,
  siteShow: boolean,
  isActive: boolean,
  haveUnit: boolean,
  haveCycle: boolean,
  baseApi: string,
  isActiveForCustomer: boolean,
  expireDate: number,
  startDate: number
}
