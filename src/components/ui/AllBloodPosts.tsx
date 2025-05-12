"use client";

import { removeRoute, useCurrentUser } from "@/redux/features/auth/authSlice";
import { useConnectedUsersQuery } from "@/redux/features/auth/userAuth";
import {
  useAddPostHistoryMutation,
  useGetBloodPostsQuery,
} from "@/redux/features/bloodPost/bloodPostApi";
import { useSendRequestMutation } from "@/redux/features/donarRequest/donarRequestApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IBloodPost, IUser } from "@/types/userTypes";
import { formatDistanceToNow } from "date-fns";
import { ChangeEvent, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { districtData } from "@/utils/districtData";

const bloodGroups = ["A+", "B+", "A-", "B-", "AB+", "AB-", "O+", "O-"];

const AllBloodPosts = () => {
  const [selectedPostValue, setSelectedPostValue] = useState("");
  const [selectedReceiverValue, setSelectedReceiverValue] = useState("");
  const [posts, setPosts] = useState<IBloodPost[]>();
  const user = useAppSelector(useCurrentUser);
  const { data } = useGetBloodPostsQuery("");
  const { data: connectUser } = useConnectedUsersQuery("");
  const [addRequest] = useSendRequestMutation();
  const [addDonationHistory] = useAddPostHistoryMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

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
      console.log("requestInfo", requestInfo?.data?._id);
      const userId = requestInfo?.data?.receiver;
      const info = { requestId: requestInfo?.data?._id };
      const donationInfo = await addDonationHistory({
        userId,
        info,
      }).unwrap();
      console.log("donationInfo", donationInfo);
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

  const handleBloodGroupSearch = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    const group = e.target.value;
    setPosts(
      data?.data?.filter((post: IBloodPost) => post?.bloodGroup === group)
    );
  };

  const handleDistrictSearch = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    const district = e.target.value;
    setPosts(
      data?.data?.filter((post: IBloodPost) => post?.district === district)
    );
  };

  console.log(connectUser?.data[0]?.friends);
  useEffect(() => {
    setPosts(data?.data);
    dispatch(removeRoute());
  }, [dispatch, data?.data]);
  return (
    <div className="mb-14">
      <div className="md:flex md:gap-10">
        <div className="w-4/12">
          <p className="my-3 text-gray-500 font-semibold">
            Search by Blood Group
          </p>
          <select
            className="border border-red-400 rounded h-11 pl-3 w-full"
            onChange={(e) => handleBloodGroupSearch(e)}
          >
            {bloodGroups?.map((group: string, i: number) => (
              <option value={group} key={i}>
                {group}
              </option>
            ))}
          </select>
        </div>
        <div className="w-4/12">
          <p className="my-3 text-gray-500 font-semibold">Search by District</p>
          <select
            className="border border-red-400 rounded h-11 pl-3 w-full"
            onChange={(e) => handleDistrictSearch(e)}
          >
            {districtData?.map(
              (
                group: { id: number; districtTitle: string; value: string },
                i: number
              ) => (
                <option value={group?.value} key={i}>
                  {group?.districtTitle}
                </option>
              )
            )}
          </select>
        </div>
      </div>
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

                        {connectUser?.data[0]?.friends?.map((user: IUser) => {
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

export default AllBloodPosts;
