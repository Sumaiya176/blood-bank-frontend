"use client";

import { useCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useAllUsersQuery,
  useConnectedUsersQuery,
  useMakeConnectionMutation,
} from "@/redux/features/auth/userAuth";
import { useAppSelector } from "@/redux/hooks";

import { IUser } from "@/types/userTypes";
import withAuth from "@/utils/withAuth";
import Image from "next/image";
import React from "react";
import { toast } from "react-hot-toast";

const Connection = () => {
  const { data } = useAllUsersQuery("");
  const { data: myFriends } = useConnectedUsersQuery("");
  const user = useAppSelector(useCurrentUser);
  const connectionUsers = data?.data?.filter(
    (connectUser: IUser) => connectUser.name !== user?.name
  );
  const [makeConnection] = useMakeConnectionMutation();

  const handleConnect = async (id: string) => {
    const result = await makeConnection({ id }).unwrap();
    if (result.success === false) {
      toast.error(result.errMessage);
    } else {
      toast.success(result.message);
    }
  };

  return (
    <div>
      <p>My Friends</p>
      <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8">
        {myFriends?.data[0]?.friends?.map((user: IUser) => (
          <div className="m-4 p-2 border" key={user?._id}>
            <Image
              alt="user"
              src="https://cdn-icons-png.flaticon.com/512/21/21104.png"
              width="90"
              height="90"
            />
            <p>{user?.name}</p>
            <button
              onClick={() => handleConnect(user?._id)}
              className="bg-green-500 p-1 text-sm text-white  rounded"
            >
              Connect
            </button>
          </div>
        ))}
      </div>
      <p>Make Connections</p>
      <div className="flex">
        {connectionUsers?.map((user: IUser) => (
          <div className="m-4 p-2 border" key={user?._id}>
            <Image
              alt="user"
              src="https://cdn-icons-png.flaticon.com/512/21/21104.png"
              width="90"
              height="90"
            />
            <p>{user?.name}</p>
            <button
              onClick={() => handleConnect(user?._id)}
              className="bg-green-500 p-1 text-sm text-white  rounded"
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(Connection);
