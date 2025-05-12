"use client";

import { useGetMyDonationHistoryQuery } from "@/redux/features/auth/userAuth";
import withAuth from "@/utils/withAuth";
import React from "react";

const MyDonationHistory = () => {
  const { data } = useGetMyDonationHistoryQuery("");
  console.log(data?.data?.donationHistory);

  return (
    <div>
      <p className="text-2xl text-center my-10">My Donation History</p>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th className="text-center">SI No. </th>
              <th className="text-center">Patient Name</th>
              <th className="text-center">Blood Group</th>
              <th className="text-center">District</th>
              <th className="text-center">Location</th>
              <th className="text-center">Time</th>
              <th className="text-center">Bags</th>
              <th className="text-center">Contact</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data?.data?.donationHistory?.map((item: any, i: number) => {
              return (
                <tr key={i}>
                  <th className="text-center">{i + 1}</th>
                  <td className="text-center">{item?.post?.patientName}</td>
                  <td className="text-center">{item?.post?.bloodGroup}</td>
                  <td className="text-center">{item?.post?.district}</td>
                  <td className="text-center">{item?.post?.address}</td>
                  <td className="text-center">{item?.post?.time}</td>
                  <td className="text-center">{item?.post?.noOfBags}</td>
                  <td className="text-center">{item?.post?.contact}</td>
                  <td
                    className={`${
                      item?.post?.status === "donated"
                        ? "bg-green-600"
                        : item?.post?.status === "canceled"
                        ? "bg-red-600"
                        : item?.post?.status === "due"
                        ? "bg-emerald-400"
                        : "bg-yellow-600"
                    } rounded text-center text-white`}
                  >
                    {item?.status}
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

export default withAuth(MyDonationHistory);
