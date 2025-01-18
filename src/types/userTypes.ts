export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  location: string;
  bloodGroup: string;
}

export interface IBloodPost {
  address: string;
  _id: string;
  bloodGroup: "A+" | " A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  district: string;
  time: string;
  contact: string;
  patientName: string;
  description: string;
  donar: string;
  postCreator: string;
  createdAt: string;
  noOfBags: number;
}
