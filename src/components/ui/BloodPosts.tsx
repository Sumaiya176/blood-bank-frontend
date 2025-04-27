"use client";

import { useGetBloodPostsQuery } from "@/redux/features/bloodPost/bloodPostApi";
import { IBloodPost, IUser } from "@/types/userTypes";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useCurrentUser,
  useCurrentToken,
  removeRoute,
} from "@/redux/features/auth/authSlice";
import {
  useAllUsersQuery,
  useConnectedUsersQuery,
} from "@/redux/features/auth/userAuth";
import { useSendRequestMutation } from "@/redux/features/donarRequest/donarRequestApi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const BloodPosts = () => {
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const { data, refetch } = useGetBloodPostsQuery();
  const { data: connectUser } = useConnectedUsersQuery("");
  //const [addPostBloodHistory] = useAddPostHistoryMutation();
  const [addRequest] = useSendRequestMutation();
  //const { data: activeUsers } = useActiveUsersQuery("");
  const [selectedPostValue, setSelectedPostValue] = useState("");
  const [selectedReceiverValue, setSelectedReceiverValue] = useState("");
  // const [isDisable, setIsDisable] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(useCurrentUser);
  const { data: users } = useAllUsersQuery("");

  let myProfileData;
  if (users) {
    myProfileData = users?.data?.filter(
      (user: IUser) => user.name === currentUser?.name
    );
  }

  console.log(data);
  let posts = data?.data;

  if (token) {
    console.log(posts);
    if (myProfileData) {
      posts = posts?.filter(
        (post: IBloodPost) => post?.district === myProfileData[0]?.district
      );
      if (myProfileData[0]?.bloodGroup === "AB+") {
        posts = posts?.filter((post: IBloodPost) => post?.bloodGroup === "AB+");
      } else if (myProfileData[0]?.bloodGroup === "A+") {
        posts = posts?.filter((post: IBloodPost) =>
          ["A+", "AB+"].includes(post?.bloodGroup)
        );
      } else if (myProfileData[0]?.bloodGroup === "B+") {
        posts = posts?.filter((post: IBloodPost) =>
          ["B+", "AB+"].includes(post?.bloodGroup)
        );
      } else if (myProfileData[0]?.bloodGroup === "O+") {
        posts = posts?.filter((post: IBloodPost) =>
          ["O+", "A+", "B+", "AB+"].includes(post?.bloodGroup)
        );
      } else if (myProfileData[0]?.bloodGroup === "A-") {
        posts = posts?.filter((post: IBloodPost) =>
          ["A-", "A+", "AB+", "AB-"].includes(post?.bloodGroup)
        );
      } else if (myProfileData[0]?.bloodGroup === "B-") {
        posts = posts?.filter((post: IBloodPost) =>
          ["B-", "B+", "AB+", "AB-"].includes(post?.bloodGroup)
        );
      } else if (myProfileData[0]?.bloodGroup === "AB-") {
        posts = posts?.filter((post: IBloodPost) =>
          ["AB+", "AB-"].includes(post?.bloodGroup)
        );
      }
    }
  }

  // Handle the select change
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectChange = (e: { target: { value: any } }, id: string) => {
    setSelectedPostValue(id);
    setSelectedReceiverValue(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const request = {
      post: selectedPostValue,
      receiver: selectedReceiverValue,
      sender: user?.id,
    };

    const requestData = { request };
    try {
      const requestInfo = await addRequest(requestData).unwrap();
      if (requestInfo.success === false) {
        toast.error(requestInfo.errMessage);
      } else {
        toast.success(requestInfo.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(posts);

  // useEffect(() => {
  //   dispatch(removeRoute());
  // }, []);

  return (
    <div className="mb-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts?.map((post: IBloodPost) => (
          <div key={post._id} className="card bg-base-100 w-76 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                <span className="text-red-600 font-bold">
                  {post?.bloodGroup}
                </span>{" "}
                Blood Group
              </h2>
              <hr className="my-4 text-red-500" />
              <p className="text-gray-600">
                District:{" "}
                <span className="text-gray-600">{post?.district}</span>
              </p>
              <p className="text-gray-600">
                Address: <span className="text-gray-600">{post?.address}</span>
              </p>
              <p className="text-gray-600">Name: {post?.patientName}</p>
              <p className="text-gray-600">
                Need {post?.noOfBags} {post?.noOfBags === 1 ? "Bag" : "Bags"} of
                blood
              </p>
              <p className="text-gray-600">Time: {post?.time}</p>
              <p className="text-gray-600">
                Posted: {formatDistanceToNow(new Date(post.createdAt))} ago
              </p>
              <hr className="my-4 text-red-500" />
              <div className="card-actions justify-center">
                <button
                  onClick={() =>
                    (
                      document.getElementById("my_modal_1") as HTMLDialogElement
                    ).showModal()
                  }
                  className="btn bg-cyan-200"
                >
                  Refer
                </button>
                {/* ------------ start modal ---------------- */}
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box">
                    <form method="dialog">
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                        ✕
                      </button>
                    </form>

                    <form onSubmit={handleSubmit}>
                      <label htmlFor="options">Choose a receiver:</label>
                      <br />
                      <select
                        id="options"
                        value={selectedPostValue}
                        onChange={(e) => handleSelectChange(e, post._id)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block h-14 w-full p-2.5"
                      >
                        <option value="" disabled>
                          Select a donar
                        </option>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {connectUser?.data[0]?.friends
                          ?.filter(
                            (user: IUser) =>
                              user?.bloodGroup === post?.bloodGroup
                          )
                          .map((user: IUser) => {
                            return (
                              <option key={user?._id} value={user?._id}>
                                {user?.name}
                              </option>
                            );
                          })}
                      </select>
                      <br />

                      <button
                        type="submit"
                        className="text-white mt-4 inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </dialog>
                {/* -------------- end modal ---------------- */}
                <button
                  onClick={() => router.push(`/bloodPost/${post?._id}`)}
                  //onClick={() => router.push(`/bloodPost/${post?._id}`)}
                  className="btn btn-primary"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BloodPosts;
