"use client";

import { useRequestedDonorQuery } from "@/redux/features/auth/userAuth";
import {
  useCancelRequestedDonorMutation,
  useDonatedRequestedDonorMutation,
  useDueRequestedDonorMutation,
} from "@/redux/features/bloodPost/bloodPostApi";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import React from "react";
import withAuth from "@/utils/withAuth";

const RequestedDonors = () => {
  const params = useParams<{ requestedPostId: string }>();
  const { data } = useRequestedDonorQuery(params?.requestedPostId);
  const [cancelRequestedDonor] = useCancelRequestedDonorMutation();
  const [dueRequestedDonor] = useDueRequestedDonorMutation();
  const [donatedRequestedDonor] = useDonatedRequestedDonorMutation();
  const donors = data?.data?.donar;

  console.log(donors);

  const handleDonorStatus = async (data: string, donorId: string) => {
    if (data === "canceled") {
      try {
        const result = await cancelRequestedDonor({
          postId: params?.requestedPostId,
          donorId: donorId,
        }).unwrap();

        if (result.success === false) {
          toast.error(result.errMessage);
        } else {
          toast.success(result.message);
        }
      } catch (err) {
        console.log(err);
      }
    } else if (data === "due") {
      try {
        const result = await dueRequestedDonor(
          params?.requestedPostId
        ).unwrap();

        if (result.success === false) {
          toast.error(result.errMessage);
        } else {
          toast.success(result.message);
        }
      } catch (err) {
        console.log(err);
      }
    } else if (data === "donated") {
      try {
        const result = await donatedRequestedDonor({
          postId: params?.requestedPostId,
          userId: donorId,
        }).unwrap();

        if (result.success === false) {
          toast.error(result.errMessage);
        } else {
          toast.success(result.message);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
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
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              donors?.map((donor: any, i: number) => {
                return (
                  <tr key={donor?._id}>
                    <th className="text-center">{i + 1}</th>
                    <td className="text-center">{donor?.name}</td>
                    <td className="text-center">{donor?.bloodGroup}</td>
                    <td className="text-center">{donor?.district}</td>
                    <td className="text-center">{donor?.email}</td>
                    <td className="text-center">{donor?.age}</td>
                    <td className="text-center">
                      <select
                        className="border p-3 rounded border-gray-400 "
                        onChange={(e) =>
                          handleDonorStatus(e.target.value, donor?._id)
                        }
                      >
                        <option>Change Status</option>
                        <option value="due">Due</option>
                        <option value="canceled">Cancel</option>
                        <option value="donated">Donated</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(RequestedDonors);
