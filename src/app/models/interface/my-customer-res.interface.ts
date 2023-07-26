export interface IMyCustomerRes {
  id: number,
  title: string,
  logo: string,
  parentId: number,
  customerSetting: {
    id: number,
    mainLanguage: string,
    generalCodingSerialId: number
  }
}
