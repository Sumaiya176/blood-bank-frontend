"use client";

import {
  useAddPostHistoryMutation,
  useGetBloodPostsQuery,
} from "@/redux/features/bloodPost/bloodPostApi";
import { IBloodPost, IUser } from "@/types/userTypes";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import { useActiveUsersQuery } from "@/redux/features/auth/userAuth";
import { useSendRequestMutation } from "@/redux/features/donarRequest/donarRequestApi";
import { toast } from "react-hot-toast";

// type Inputs = {
//   id: string;
//   gender: string;
// };

const BloodPosts = () => {
  const user = useAppSelector(useCurrentUser);
  const { data } = useGetBloodPostsQuery("");
  const [addPostBloodHistory] = useAddPostHistoryMutation();
  const [addRequest] = useSendRequestMutation();
  const { data: activeUsers } = useActiveUsersQuery("");
  const [selectedPostValue, setSelectedPostValue] = useState("");
  const [selectedReceiverValue, setSelectedReceiverValue] = useState("");
  // const [isDisable, setIsDisable] = useState(false);

  let activeUsersWithoutMe: IUser[];
  if (activeUsers) {
    activeUsersWithoutMe = activeUsers?.data?.filter(
      (activeUser: IUser) => activeUser.name != user?.name
    );

    console.log(activeUsersWithoutMe);
  }

  // Handle the select change
  const handleSelectChange = (e: { target: { value: any } }, id: string) => {
    console.log();
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
    console.log("Form submitted with value:", requestData);
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

  const posts = data?.data;

  const handleAddPostHistory = async (historyId: string) => {
    const postId = {
      id: historyId,
    };
    const info = {
      postId,
    };
    try {
      const id = user?.id;
      const result = await addPostBloodHistory({ id, info }).unwrap();
      if (result.success === false) {
        toast.error(result.errMessage);
      } else {
        toast.success(result.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mb-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts?.map((post: IBloodPost) => (
          <div key={post._id} className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">
                <span className="text-red-600 font-bold">
                  {post?.bloodGroup}
                </span>{" "}
                Blood Group
              </h2>
              <hr className="my-4 text-red-500" />
              <p>
                Location:{" "}
                <span className="text-gray-400">{post?.location}</span>
              </p>
              <p>Name: {post?.patientName}</p>
              <p>Mobile: {post?.contact}</p>
              <p>Posted: {formatDistanceToNow(new Date(post.createdAt))} ago</p>
              <hr className="my-4 text-red-500" />
              <div className="card-actions justify-center">
                <button
                  onClick={() =>
                    (
                      document.getElementById("my_modal_1") as HTMLDialogElement
                    ).showModal()
                  }
                  className="btn btn-primary"
                >
                  Send Request
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
                        {activeUsersWithoutMe?.map((user: any, i: number) => {
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
                  onClick={() => handleAddPostHistory(post._id)}
                  className="btn btn-primary"
                >
                  Accept
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
