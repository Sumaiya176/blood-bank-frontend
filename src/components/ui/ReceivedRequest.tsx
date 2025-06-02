"use client";

import { useCurrentUser } from "@/redux/features/auth/authSlice";
import { useChangeDonarRequestStatusMutation } from "@/redux/features/bloodPost/bloodPostApi";
import { useLazyReceivedRequestQuery } from "@/redux/features/donarRequest/donarRequestApi";
import { useAppSelector } from "@/redux/hooks";
import withAuth from "@/utils/withAuth";
import { useEffect } from "react";

import { toast } from "react-hot-toast";

const ReceivedRequest = () => {
  const user = useAppSelector(useCurrentUser);
  const [trigger, { data }] = useLazyReceivedRequestQuery();
  const [changeDonarRequestStatus] = useChangeDonarRequestStatusMutation();

  const handleAcceptBtn = async (requestId: string) => {
    const status = "due";
    try {
      const result = await changeDonarRequestStatus({
        status,
        requestId,
      }).unwrap();

      if (result.success === false) {
        toast.error(result.errMessage);
      } else {
        toast.success(result.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRejectBtn = async (requestId: string) => {
    const status = "rejected";
    try {
      const result = await changeDonarRequestStatus({
        status,
        requestId,
      }).unwrap();

      if (result.success === false) {
        toast.error(result.errMessage);
      } else {
        toast.success(result.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(data?.data);

  useEffect(() => {
    if (user) {
      trigger(user?.id);
    }
  }, [user, trigger]);

  return (
    <div>
      <div className="overflow-x-auto">
        {data?.data.length === 0 ? (
          <p className="text-2xl font-semibold text-center my-10 text-red-500">
            You have not received any blood donation post request.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th className="text-center">SI No.</th>
                <th className="text-center">Requested By</th>
                <th className="text-center">Blood Group</th>
                <th className="text-center">District</th>
                <th className="text-center">Location</th>
                <th className="text-center">Time</th>
                <th className="text-center">Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {data?.data?.map((request: any, i: number) => {
                return (
                  <tr key={request?._id}>
                    <th className="text-center">{i + 1}</th>
                    <td className="text-center">{request?.sender?.name}</td>
                    <td className="text-red-800 font-bold text-center">
                      {request?.post?.bloodGroup}
                    </td>
                    <td className="text-center">{request?.post?.district}</td>
                    <td className="text-center">{request?.post?.address}</td>
                    <td className="text-center">{request?.post?.time}</td>
                    <td
                      className={`text-white my-1 rounded ${
                        request?.status == "pending" ? "bg-yellow-400" : ""
                      } ${request?.status == "due" ? "bg-orange-600" : ""} ${
                        request?.status == "accepted" ? "bg-green-600" : ""
                      } ${
                        request?.status == "rejected" ? "bg-red-400" : ""
                      } font-bold text-center`}
                    >
                      {request?.status}
                    </td>
                    {request?.status === "pending" ? (
                      <td className="flex justify-center items-center gap-2 text-center">
                        <button
                          onClick={() => handleAcceptBtn(request?._id)}
                          className={`btn btn-success text-white`}
                        >
                          Accept
                        </button>

                        <button
                          onClick={() => handleRejectBtn(request?._id)}
                          className="btn btn-error text-white"
                        >
                          Reject
                        </button>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default withAuth(ReceivedRequest);
