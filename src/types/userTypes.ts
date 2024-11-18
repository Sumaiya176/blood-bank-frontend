export interface IUser {
  name: string;
  email: string;
  password: string;
  age: number;
  location: string;
}

export interface IBloodPost {
  _id: string;
  bloodGroup: "A+" | " A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  location: string;
  time: string;
  contact: string;
  patientName: string;
  description: string;
  donar: string;
  postCreator: string;
  createdAt: string;
}
