"use server";

import { IUser } from "../types/userTypes";

export const userSignUp = async (user: IUser) => {
  const data = { user };
  console.log("data in action file", data, JSON.stringify(data));
  const res = await fetch(
    "http://localhost:5000/api/v1/users/user-registration",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    }
  );

  const userInfo = await res.json();
  return userInfo;
};
