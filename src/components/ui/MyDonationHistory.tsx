"use client";

import { useGetMyDonationHistoryQuery } from "@/redux/features/auth/userAuth";
import withAuth from "@/utils/withAuth";
import React from "react";

const MyDonationHistory = () => {
  const { data } = useGetMyDonationHistoryQuery("");

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
              <th className="text-center">Location</th>
              <th className="text-center">Time</th>
              <th className="text-center">Bags</th>
              <th className="text-center">Contact</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data?.data?.donationHistory?.map((post: any, i: number) => {
              return (
                <tr key={post?._id}>
                  <th className="text-center">{i + 1}</th>
                  <td className="text-center">{post?.patientName}</td>
                  <td className="text-center">{post?.bloodGroup}</td>
                  <td className="text-center">{post?.location}</td>
                  <td className="text-center">{post?.time}</td>
                  <td className="text-center">{post?.noOfBags}</td>
                  <td className="text-center">{post?.contact}</td>
                  <td
                    className={`${
                      post?.status === "donated"
                        ? "bg-green-600"
                        : post?.status === "canceled"
                        ? "bg-red-600"
                        : post?.status === "due"
                        ? "bg-emerald-400"
                        : "bg-yellow-600"
                    } rounded text-center text-white`}
                  >
                    {post?.status}
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
