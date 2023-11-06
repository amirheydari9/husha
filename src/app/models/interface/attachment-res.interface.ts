interface IUserModel {
  id: string;
  name: string;
  family: string;
  username: string;
}

export interface AttachmentRes {
  id: string;
  data: string;
  name: string;
  desc: string;
  type: string;
  createBy: IUserModel;
  createdAt: string
}
