"use client";

import { useRequestedDonorQuery } from "@/redux/features/auth/userAuth";
import { useChangeDonarRequestStatusMutation } from "@/redux/features/bloodPost/bloodPostApi";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import React from "react";
import withAuth from "@/utils/withAuth";
import { IUser } from "@/types/userTypes";

type TDonorRequest = {
  _id: string;
  sender: IUser;
  receiver: IUser;
  post: string;
  status: "pending" | "accepted" | "rejected" | "due";
};

const RequestedDonors = () => {
  const params = useParams<{ requestedPostId: string }>();
  const { data } = useRequestedDonorQuery(params?.requestedPostId);
  const [changeDonarRequestStatus] = useChangeDonarRequestStatusMutation();
  const donors = data?.data?.donarRequest?.filter(
    (item: TDonorRequest) => item?.status === "due"
  );
  console.log(donors);

  const handleRequestStatus = async (status: string, requestId: string) => {
    console.log(status);
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
  return (
    <div>
      {donors?.length === 0 ? (
        <p className="text-center text-2xl font-semibold text-red-400">
          No requested donor is found
        </p>
      ) : (
        <div>
          <p className="text-2xl text-center my-10">Requested Donor</p>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center">SI No. </th>
                  <th className="text-center">Donor Name</th>
                  <th className="text-center">Blood Group</th>
                  <th className="text-center">District</th>
                  <th className="text-center">Email</th>
                  <th className="text-center">Age</th>
                  <th className="text-center">Request Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {donors?.map((donor: TDonorRequest, i: number) => {
                  return (
                    <tr key={i}>
                      <th className="text-center">{i + 1}</th>
                      <td className="text-center">{donor?.receiver?.name}</td>
                      <td className="text-center">
                        {donor?.receiver?.bloodGroup}
                      </td>
                      <td className="text-center">
                        {donor?.receiver?.district}
                      </td>
                      <td className="text-center">{donor?.receiver?.email}</td>
                      <td className="text-center">{donor?.receiver?.age}</td>
                      <td className="text-center">
                        <p
                          className={`p-3 rounded text-white ${
                            donor?.status === "rejected"
                              ? "bg-red-500"
                              : donor?.status === "pending"
                              ? "bg-orange-500"
                              : "bg-green-500"
                          }`}
                        >
                          {donor?.status}
                        </p>
                      </td>
                      <td className="text-center">
                        <select
                          className="border p-3 rounded border-gray-400 "
                          onChange={(e) =>
                            handleRequestStatus(e.target.value, donor?._id)
                          }
                        >
                          <option>Change Status</option>
                          <option value="rejected">Reject</option>
                          <option value="accepted">Accept</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(RequestedDonors);
