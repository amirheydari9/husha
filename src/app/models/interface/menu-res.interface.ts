export interface IMenuRes {
  id: number;
  title: string;
  priority: number;
  name: string;
  icon: string;
  subMenus: IMenuRes[]
}
