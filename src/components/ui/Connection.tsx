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
  //const { data } = useAllUsersQuery("");
  const { data: users } = useAllUsersQuery(undefined);
  const { data } = useConnectedUsersQuery("");
  const user = useAppSelector(useCurrentUser);
  const connectionUsers = users?.data?.filter(
    (connectUser: IUser) => connectUser.name !== user?.name
  );

  const usersToRemove: string[] = [];
  data?.data[0]?.friends.forEach((item: IUser) => {
    usersToRemove.push(item?.name);
  });

  const connectionUsersWithoutFriends = connectionUsers?.filter(
    (item: IUser) => !usersToRemove.includes(item?.name)
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
    <div className="my-10">
      <p className="text-2xl font-semibold">My Friends</p>
      <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8">
        {data?.data[0]?.friends?.map((user: IUser, i: number) => (
          <div
            className="m-4 flex justify-center flex-col items-center"
            key={i}
          >
            <Image
              alt="user"
              src="/gigi-hadid.jpg"
              className="object-cover rounded-full"
              width="90"
              height="90"
            />
            <p className="font-semibold text-gray-500 my-2">{user?.name}</p>
            <button
              //onClick={() => handleConnect(user?._id)}
              className="bg-green-500 p-1 text-sm text-white  rounded"
            >
              Connected
            </button>
          </div>
        ))}
      </div>
      <hr className="my-10" />
      <p className="text-2xl font-semibold">Make Connections</p>
      <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8">
        {connectionUsersWithoutFriends?.map((user: IUser) => (
          <div
            className="m-4 flex justify-center flex-col items-center"
            key={user?._id}
          >
            <Image
              alt="user"
              src="/gigi.jpg"
              className="object-cover rounded-full"
              width="90"
              height="90"
            />
            <p className="font-semibold text-gray-500 my-2">{user?.name}</p>
            <button
              onClick={() => handleConnect(user?._id)}
              className="bg-red-500 p-1 text-sm text-white  rounded"
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
