"use client";

import { useCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useAddPostCancelHistoryMutation,
  useAddPostHistoryMutation,
} from "@/redux/features/bloodPost/bloodPostApi";
import {
  useReceivedRequestQuery,
  useStatusAcceptedMutation,
} from "@/redux/features/donarRequest/donarRequestApi";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import { toast } from "react-hot-toast";

const ReceivedRequest = () => {
  const user = useAppSelector(useCurrentUser);
  const { data } = useReceivedRequestQuery(user?.id);
  const [addPostBloodHistory] = useAddPostHistoryMutation();
  const [addPostCancelHistory] = useAddPostCancelHistoryMutation();
  const [statusAccepted] = useStatusAcceptedMutation();
  const [statusRejected] = useStatusAcceptedMutation();

  const handleAcceptBtn = async (historyId: string, requestId: string) => {
    console.log(requestId);
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

      const updatedStatus = await statusAccepted(requestId).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRejectBtn = async (historyId: string, requestId: string) => {
    console.log(requestId);
    const postId = {
      id: historyId,
    };
    const info = {
      postId,
    };
    try {
      const id = user?.id;
      const result = await addPostCancelHistory({ id, info }).unwrap();
      if (result.success === false) {
        toast.error(result.errMessage);
      } else {
        toast.success(result.message);
      }

      const updatedStatus = await statusRejected(requestId).unwrap();
    } catch (err) {
      console.log(err);
    }
  };
  console.log(data);
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="text-center">SI No.</th>
              <th className="text-center">Requested By</th>
              <th className="text-center">Blood Group</th>
              <th className="text-center">Location</th>
              <th className="text-center">Time</th>
              <th className="text-center">Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((request: any, i: number) => {
              return (
                <tr key={request?._id}>
                  <th className="text-center">{i + 1}</th>
                  <td className="text-center">{request?.sender?.name}</td>
                  <td className="text-red-800 font-bold text-center">
                    {request?.post?.bloodGroup}
                  </td>
                  <td className="text-center">{request?.post?.location}</td>
                  <td className="text-center">{request?.post?.time}</td>
                  <td
                    className={`${
                      request?.status == "pending" ? "text-yellow-400" : ""
                    } ${
                      request?.status == "accepted" ? "text-green-600" : ""
                    } ${
                      request?.status == "rejected" ? "text-red-400" : ""
                    } font-bold text-center`}
                  >
                    {request?.status}
                  </td>
                  <td className="flex justify-center items-center gap-2 text-center">
                    <button
                      onClick={() =>
                        handleAcceptBtn(request?.post?._id, request?._id)
                      }
                      className="btn btn-success text-white"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleRejectBtn(request?.post?._id, request?._id)
                      }
                      className="btn btn-error text-white"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceivedRequest;
