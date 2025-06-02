export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  district: string;
  bloodGroup: string;
}

export interface IBloodPost {
  address: string;
  _id: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  district: string;
  time: string;
  contact: string;
  patientName: string;
  description: string;
  donar: string;
  postCreator: string;
  createdAt: string;
  noOfBags: number;
  status: "pending" | "donated" | "cancelled";
}
export interface IBloodPostData {
  data: IBloodPost;
}
export interface IBloodPostRequest {
  _id: string;
  sender: string;
  status: string;
  receiver: string;
  post: IBloodPost;
}
