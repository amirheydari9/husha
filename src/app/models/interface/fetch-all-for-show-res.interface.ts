export interface IFetchAllForShowRes {
  createDate: number,
  description: string,
  headDescription: string,
  headTitle: string,
  id: number,
  image: string,
  keywords: { id: number, title: string },
  modifyDate: number,
  service: {
    description: string,
    haveCycle: boolean,
    haveUnit: boolean,
    id: number,
    isActive: boolean,
    logo: string,
    menuOrder: number,
    siteShow: boolean,
    status: number,
    title: string
  },
  status: number,
  summary: string,
  title: string
}
