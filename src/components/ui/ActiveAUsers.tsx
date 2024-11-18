"use client";
import { useActiveUsersQuery } from "@/redux/features/auth/userAuth";
import React from "react";

const ActiveAUsers = () => {
  const { data } = useActiveUsersQuery("");
  console.log(data);
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>SI No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Age</th>
              <th>Donated</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((user: any, i: number) => {
              return (
                <tr key={user?._id}>
                  <th>{i + 1}</th>
                  <td>{user?.name}</td>
                  <td>{user?.email}</td>
                  <td>{user?.location}</td>
                  <td>{user?.age}</td>
                  <td>{user?.donationHistory.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveAUsers;
