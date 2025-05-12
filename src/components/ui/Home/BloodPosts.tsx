"use client";

import {
  removeRoute,
  useCurrentToken,
  useCurrentUser,
} from "@/redux/features/auth/authSlice";
import {
  useAllUsersQuery,
  useConnectedUsersQuery,
} from "@/redux/features/auth/userAuth";
import {
  useAddPostHistoryMutation,
  useGetBloodPostsQuery,
} from "@/redux/features/bloodPost/bloodPostApi";
import { useSendRequestMutation } from "@/redux/features/donarRequest/donarRequestApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IBloodPost, IUser } from "@/types/userTypes";
import { formatDistanceToNow } from "date-fns";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const BloodPosts = () => {
  const [selectedPostValue, setSelectedPostValue] = useState("");
  const [selectedReceiverValue, setSelectedReceiverValue] = useState("");
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const { data } = useGetBloodPostsQuery("");
  const { data: connectUser } = useConnectedUsersQuery("");
  const [addRequest] = useSendRequestMutation();
  const [addDonationHistory] = useAddPostHistoryMutation();
  const { data: users } = useAllUsersQuery(undefined);
  const currentUser = useAppSelector(useCurrentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  //Helper function to determine compatible blood groups
  const getCompatibleBloodGroups = (bloodGroup: string) => {
    switch (bloodGroup) {
      case "AB+":
        return ["AB+"];
      case "A+":
        return ["A+", "AB+"];
      case "B+":
        return ["B+", "AB+"];
      case "O+":
        return ["O+", "A+", "B+", "AB+"];
      case "A-":
        return ["A-", "A+", "AB+", "AB-"];
      case "B-":
        return ["B-", "B+", "AB+", "AB-"];
      case "AB-":
        return ["AB+", "AB-"];
      default:
        return null;
    }
  };

  //Memoize filtered posts
  const posts = useMemo(() => {
    console.log(data?.data);

    let filteredPosts: IBloodPost[] = [];
    if (data?.data) {
      filteredPosts = [...data?.data];
    }
    if (!token) return filteredPosts;

    console.log(filteredPosts);

    // Filter by district if user is logged in
    if (currentUser && users?.data) {
      const myProfileData = users.data.find(
        (user: IUser) => user.name === currentUser.name
      );

      if (myProfileData) {
        filteredPosts = filteredPosts.filter(
          (post: IBloodPost) => post.district === myProfileData.district
        );

        // Filter by blood group compatibility
        const compatibleGroups = getCompatibleBloodGroups(
          myProfileData.bloodGroup
        );
        console.log(compatibleGroups);
        if (compatibleGroups) {
          filteredPosts = filteredPosts.filter((post: IBloodPost) =>
            compatibleGroups.includes(post.bloodGroup)
          );
        }
      }
    }

    return filteredPosts;
  }, [currentUser, data?.data, token, users?.data]);

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
      console.log("requestInfo", requestInfo);
      const userId = requestInfo?.data?.receiver;
      const info = { requestId: requestInfo?.data?._id };
      const donationInfo = await addDonationHistory({
        userId,
        info,
      }).unwrap();
      console.log(donationInfo);
      if (requestInfo.success === false) {
        toast.error(requestInfo.errMessage);
      } else {
        toast.success(requestInfo.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Handle the select change
  const handleSelectChange = (
    e: { target: { value: SetStateAction<string> } },
    id: string
  ) => {
    console.log(e.target.value, id);
    setSelectedPostValue(id);
    setSelectedReceiverValue(e.target.value);
  };

  const handleRefer = () => {
    if (!user) {
      router.push("/login");
    } else {
      (document.getElementById("my_modal_1") as HTMLDialogElement).showModal();
    }
  };

  // const x = connectUser?.data[0]?.friends;
  // console.log(
  //   x,
  //   x?.map((item: IUser) => console.log(item?.name))
  // );

  useEffect(() => {
    dispatch(removeRoute());
  }, [dispatch]);

  return (
    <div className="mb-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts?.slice(0, 6)?.map((post: IBloodPost) => (
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
                  onClick={() => handleRefer()}
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

                        {connectUser?.data[0]?.friends?.map((users: IUser) => {
                          return (
                            <option key={users?._id} value={users?._id}>
                              {users?.name}
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
