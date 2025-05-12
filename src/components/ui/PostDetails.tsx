"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  //useAddPostHistoryMutation,
  useSinglePostQuery,
} from "@/redux/features/bloodPost/bloodPostApi";
//import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentUser } from "@/redux/features/auth/authSlice";
import { usePointReductionMutation } from "@/redux/features/auth/userAuth";
import { formatDistanceToNow } from "date-fns";
import { IBloodPost } from "@/types/userTypes";
import withAuth from "@/utils/withAuth";
import { useSendRequestMutation } from "@/redux/features/donarRequest/donarRequestApi";

const PostDetails = () => {
  const params = useParams<{ postId: string }>();
  const { data } = useSinglePostQuery(params?.postId);
  //const [addPostBloodHistory] = useAddPostHistoryMutation();
  const [addRequest] = useSendRequestMutation();
  const [pointReduction] = usePointReductionMutation();
  const user = useAppSelector(useCurrentUser);
  const [numberType, setNumberType] = useState<boolean>(false);
  const singlePost = data?.data;

  const handleAddPostHistory = async (historyId: string) => {
    // const postId = {
    //   id: historyId,
    // };
    // const info = {
    //   postId,
    // };
    // try {
    //   const id = user?.id;
    //   const result = await addPostBloodHistory({ id, info }).unwrap();
    //   if (result.success === false) {
    //     toast.error(result.errMessage);
    //   } else {
    //     toast.success(result.message);
    //   }
    // } catch (err) {
    //   console.log(err);
    // }

    const request = {
      post: historyId,
      receiver: user?.id,
      sender: user?.id,
      status: "accepted",
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

  const myFunction = () => {
    (document.getElementById("my_modal_5") as HTMLDialogElement).showModal();
  };

  const handleViewNumber = async (postId: string) => {
    try {
      const name = user?.name;
      const userId = user?.id;
      const requestInfo = await pointReduction({
        postId,
        userId,
        name,
      }).unwrap();
      if (requestInfo.success === false) {
        toast.error(requestInfo.errMessage);
      } else if (requestInfo.success === true) {
        setNumberType(true);
        toast.success(requestInfo.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  interface IPhoneStatus {
    user: string;
    phoneStatus: boolean;
  }

  const phoneNoHideOrOpen: [IBloodPost] = singlePost?.phoneNumberOpened?.filter(
    (data: IPhoneStatus) => data.user === user?.id
  );

  return (
    <div className="my-14">
      <p className="md:text-2xl text-xl text-center font-medium">
        Post details page
      </p>
      {singlePost && (
        <div className="flex justify-center align-middle mt-4">
          <div className="border border-cyan-500 md:py-16 px-5 md:px-32 rounded text-sm md:text-2xl">
            <h2 className="">
              <span className="text-red-600 text-base md:text-2xl font-bold">
                {singlePost?.bloodGroup}
              </span>{" "}
              Blood Group
            </h2>
            <hr className="my-4" />
            <p className="mb-3">
              District:{" "}
              <span className="text-gray-400">{singlePost?.district}</span>
            </p>
            <p className="mb-3">Address: {singlePost?.address}</p>
            <p className="mb-3">Name: {singlePost?.patientName}</p>
            <p className="mb-3">Needs {singlePost?.noOfBags} Bags of blood</p>
            <p>
              Posted: {formatDistanceToNow(new Date(singlePost.createdAt))} ago
            </p>
            <p className="mb-3">Mobile: </p>

            {phoneNoHideOrOpen && phoneNoHideOrOpen[0] ? (
              <p className="mb-3">{singlePost?.contact}</p>
            ) : (
              <div>
                <input
                  type={numberType ? "text" : "password"}
                  value={singlePost?.contact ?? ""}
                  id="myInput"
                  readOnly
                />
                <br />
                <input type="checkbox" onChange={() => myFunction()} />
                Show Number
                <dialog id="my_modal_5" className="modal sm:modal-middle">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">
                      Viewing number will cost your point!
                    </h3>
                    <p className="py-4">Are you agree?</p>
                    <div className="modal-action">
                      <form
                        className="flex justify-center gap-4"
                        method="dialog"
                      >
                        <button
                          onClick={() => handleViewNumber(singlePost?._id)}
                          className="btn btn-success text-white"
                        >
                          Yes
                        </button>

                        <button className="btn btn-error text-white">No</button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </div>
            )}
            <div className="my-3">
              <button
                onClick={() => handleAddPostHistory(singlePost?._id)}
                className="bg-green-600 text-white rounded p-3"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(PostDetails);
