"use client";

//import Image from "next/image";
import { removeRoute, useCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useAllUsersQuery,
  useUpdateUserMutation,
} from "@/redux/features/auth/userAuth";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { IUser } from "@/types/userTypes";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { districtData } from "@/utils/districtData";
import withAuth from "@/utils/withAuth";

type Inputs = {
  name: string;
  email: string;
  password: string;
  age: number;
  district: string;
  donationAvailability: string;
  bloodGroup: string;
};

const Profile = () => {
  const currentUser = useAppSelector(useCurrentUser);
  const { data: users, isError, refetch } = useAllUsersQuery(undefined);
  const [updateUser] = useUpdateUserMutation();
  const [userId, setUserId] = useState("");
  const dispatch = useAppDispatch();

  let myProfileData = [];
  if (users) {
    myProfileData = users?.data?.filter(
      (user: IUser) => user.name === currentUser?.name
    );
  }
  console.log(users, myProfileData, currentUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const getUserId = (id: string) => {
    setUserId(id);
  };
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    let user = {};
    if (data?.donationAvailability === "true") {
      user = { ...data, donationAvailability: true };
    } else {
      user = { ...data, donationAvailability: false };
    }
    const userData = { user: user, id: userId };
    try {
      const userInfo = await updateUser(userData).unwrap();
      if (userInfo.success === false) {
        toast.error(userInfo.errMessage);
      } else {
        refetch();
        toast.success(userInfo.message);
      }
    } catch (err) {
      console.error("user update error", err);
    }

    console.log(isError, myProfileData);
  };

  useEffect(() => {
    dispatch(removeRoute());
  }, [dispatch]);

  return (
    <div className="mx-1 md:mx-32 my-16 bg-lime-100 rounded">
      <div className="p-2 md:p-16">
        {/* <Image src="" width={30} height={30} alt="user-image" /> */}
        <div>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {myProfileData?.map((user: any) => (
            <div key={user?._id}>
              <div className="md:flex md:space-x-4 mb-4">
                <p className="p-2">Name</p>
                <p className="py-2 px-2 md:px-6 rounded bg-white">
                  {user?.name}
                </p>
              </div>
              <div className="md:flex md:space-x-4 mb-4">
                <p className="p-2">Email</p>
                <p className="py-2 px-2 md:px-6 rounded bg-white">
                  {user?.email}
                </p>
              </div>
              <div className="md:flex space-x-4 mb-4">
                <p className="p-2">District</p>
                <p className="py-2 px-6 rounded bg-white">{user?.district} </p>
              </div>
              <div className="md:flex space-x-4 mb-4">
                <p className="p-2">Age</p>
                <p className="py-2 px-6 rounded bg-white">{user?.age}</p>
              </div>
              <div className="md:flex space-x-4 mb-4">
                <p className="p-2">Donation Availability</p>
                <p className="py-2 px-6 rounded bg-white">
                  {user?.donationAvailability ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-red-600">Inactive</span>
                  )}
                </p>
              </div>
              <div className="md:flex space-x-4 mb-4">
                <p className="p-2">Blood Group</p>
                <p className="py-2 px-6 rounded bg-white">{user?.bloodGroup}</p>
              </div>
              <div className="text-center mt-12">
                <button
                  className="bg-red-600 text-white py-2 px-4 rounded"
                  onClick={() => {
                    const modal = document.getElementById(
                      "my_modal_5"
                    ) as HTMLDialogElement | null;
                    if (modal) {
                      modal.showModal();
                    } else {
                      console.error("Modal element not found.");
                    }
                  }}
                >
                  Edit Profile
                </button>
                <dialog
                  id="my_modal_5"
                  className="modal modal-bottom sm:modal-middle"
                >
                  <div className="modal-box">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="space-y-4">
                        <p className="text-start">
                          User Name <span className="text-red-600">*</span>
                        </p>
                        <input
                          type="text"
                          className="block input input-bordered input-warning w-full max-w-xs"
                          defaultValue={user?.name}
                          {...register("name", { required: true })}
                        />
                        {errors.name && (
                          <span className="text-red-500 font-light">
                            Name is required
                          </span>
                        )}

                        <p className="text-start">
                          Email <span className="text-red-600">*</span>
                        </p>
                        <input
                          type="text"
                          className="block input input-bordered input-warning w-full max-w-xs"
                          defaultValue={user?.email}
                          {...register("email", { required: true })}
                        />
                        {errors.email && (
                          <span className="text-red-500 text-sm">
                            Email is required
                          </span>
                        )}

                        <p className="text-start">
                          Age <span className="text-red-600">*</span>
                        </p>
                        <input
                          className="block input input-bordered input-warning w-full max-w-xs"
                          type="number"
                          defaultValue={user?.age}
                          {...register("age", {
                            required: true,
                            valueAsNumber: true,
                          })}
                        />
                        {errors.age && (
                          <span className="text-red-500 text-sm">
                            Age is required
                          </span>
                        )}

                        <p className="text-start">
                          District <span className="text-red-600">*</span>
                        </p>
                        <select
                          defaultValue={user?.district}
                          {...register("district", { required: true })}
                          className="block input input-bordered input-warning w-full max-w-xs"
                          required
                        >
                          {districtData?.map(
                            (data: {
                              id: number;
                              districtTitle: string;
                              value: string;
                            }) => (
                              <option key={data?.id} value={data?.value}>
                                {data?.districtTitle}
                              </option>
                            )
                          )}
                        </select>
                        {errors.district && (
                          <span className="text-red-500 text-sm">
                            District is required
                          </span>
                        )}
                        <p className="text-start">
                          Blood Group <span className="text-red-600">*</span>
                        </p>
                        <select
                          defaultValue={user?.bloodGroup}
                          {...register("bloodGroup", { required: true })}
                          className="block input input-bordered input-warning w-full max-w-xs"
                          required
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                        {errors.bloodGroup && (
                          <span className="text-red-500 text-sm">
                            Blood Group is required
                          </span>
                        )}
                        <p className="text-start">
                          Donation Availability{" "}
                          <span className="text-red-600">*</span>
                        </p>
                        <select
                          defaultValue={
                            user?.donationAvailability === true
                              ? "true"
                              : "false"
                          }
                          {...register("donationAvailability", {
                            required: true,
                          })}
                          className="block input input-bordered input-warning w-full max-w-xs"
                          required
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                        {errors.donationAvailability && (
                          <span className="text-red-500 text-sm">
                            District is required
                          </span>
                        )}

                        <div className="flex items-center justify-center">
                          <input
                            onClick={() => getUserId(user?._id)}
                            className="block w-full btn font-semibold btn-success text-white"
                            type="submit"
                          />
                        </div>
                      </div>
                    </form>
                    <div className="modal-action">
                      <form method="dialog">
                        <button className="btn bg-red-500 text-white">
                          Close
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Profile);
