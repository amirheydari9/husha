export interface IGetPeriodRes {
  id: number,
  title: string,
  isActive: boolean,
  priority: number,
  codingSeriesId: number,
  codingSeriesTitle: string,
  startDate: string,
  endDate: string,
  isEditable: boolean,
  detailCount: number,
  seriesParameters: {
    id: number,
    bankDetailId: number,
    codingSeries: {
      id: number,
      title: string,
      isActive: boolean,
      cid: number
    }
  }
}
