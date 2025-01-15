"use client";

import { useGetMyPostsQuery } from "@/redux/features/auth/userAuth";
import {
  useDeleteBloodPostMutation,
  useUpdateBloodPostMutation,
  useUpdatePostStatusMutation,
} from "@/redux/features/bloodPost/bloodPostApi";
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";

type Inputs = {
  id: string;
  bloodGroup: string;
  address: string;
  time: string;
  patientName: string;
  contact: number;
  noOfBags: number;
  note?: string;
};

const MyPost = () => {
  const { data, refetch } = useGetMyPostsQuery("");
  const [deletePost] = useDeleteBloodPostMutation();
  const [updatePost] = useUpdateBloodPostMutation();
  const [updatePostStatus] = useUpdatePostStatusMutation();
  const [id, setPostId] = useState("");
  const router = useRouter();
  const [selectedRow, setSelectedRow] = useState<Inputs>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (post: Inputs) => {
    console.log(post);
    const info = {
      bloodPost: post,
    };

    try {
      const postRes = await updatePost({ info, id }).unwrap();
      if (postRes.success === false) {
        toast.error(postRes.errMessage);
      } else {
        refetch();
        toast.success(postRes.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteButton = async (id: string) => {
    deletePost({ id });
    try {
      const postRes = await deletePost({ id }).unwrap();
      if (postRes.success === false) {
        toast.error(postRes.errMessage);
      } else {
        refetch();
        toast.success(postRes.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateStatus = async (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => {
    const value = (e.target as HTMLSelectElement).value;

    try {
      const result = await updatePostStatus({ id, status: value }).unwrap();
      if (result.success === false) {
        toast.error(result.errMessage);
      } else {
        refetch();
        toast.success(result.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Open modal with selected row data
  const handleRowClick = (row: Inputs) => {
    setSelectedRow(row);
    console.log(row);
    reset(row); // Populate the form with selected row data
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <p className="text-2xl text-center my-10">My Post History</p>
      <div className="overflow-x-auto">
        <table
          style={{ width: "100%", borderCollapse: "collapse" }}
          className="table"
        >
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
              <th className="text-center">Update Status</th>
              <th className="text-center">Action</th>
              <th className="text-center">Requested donors</th>
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data?.data?.postHistory?.map((post: any, i: number) => {
              return (
                <tr key={post?._id}>
                  <th className="text-center">{i + 1}</th>
                  <td className="text-center">{post?.patientName}</td>
                  <td className="text-center">{post?.bloodGroup}</td>
                  <td className="text-center">{post?.address}</td>
                  <td className="text-center">{post?.time}</td>
                  <td className="text-center">{post?.noOfBags}</td>
                  <td className="text-center">{post?.contact}</td>
                  <td className="text-center">{post?.status}</td>
                  <td className="text-center">
                    <select
                      className="border text-center border-slate-300 p-3 rounded"
                      onChange={(e) => handleUpdateStatus(e, post?._id)}
                    >
                      <option value="pending">Pending</option>
                      <option value="donated">Donated</option>
                    </select>
                  </td>
                  <td className="space-x-2 text-center">
                    <button
                      className="btn bg-red-600 text-white"
                      onClick={() => handleDeleteButton(post?._id)}
                    >
                      Delete
                    </button>

                    <button
                      className="btn bg-orange-400 text-white"
                      onClick={() =>
                        handleRowClick({
                          id: post?._id,
                          bloodGroup: post?.bloodGroup,
                          address: post?.address,
                          time: post?.time,
                          patientName: post?.patientName,
                          contact: post?.contact,
                          noOfBags: post?.noOfBags,
                          note: post?.note,
                        })
                      }
                    >
                      Edit
                    </button>
                    {/* {
                      <dialog
                        id="my_modal_5"
                        className="modal modal-bottom sm:modal-middle"
                      >
                        <div className="modal-box">
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="name"
                                  className="block mb-2 text-sm font-medium"
                                >
                                  Blood Group{" "}
                                  <span className="text-red-600">*</span>
                                </label>
                                <select
                                  {...register("bloodGroup", {
                                    required: true,
                                  })}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block h-14 w-full p-2.5"
                                  defaultValue={post?.bloodGroup}
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

                                <label
                                  htmlFor="location"
                                  className="block mt-5 mb-2 text-sm font-medium"
                                >
                                  Location{" "}
                                  <span className="text-red-600">*</span>
                                </label>
                                <input
                                  type="text"
                                  {...register("address", { required: true })}
                                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full h-14 p-2.5"
                                  defaultValue={post?.address}
                                  required
                                />

                                <label
                                  htmlFor="time"
                                  className="block mt-5 mb-2 text-sm font-medium"
                                >
                                  Time <span className="text-red-600">*</span>
                                </label>
                                <input
                                  type="text"
                                  {...register("time", { required: true })}
                                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full h-14 p-2.5"
                                  defaultValue={post?.time}
                                  required
                                />
                              </div>
                              <div className="w-full">
                                <label
                                  htmlFor="contact"
                                  className="block mb-2 text-sm font-medium"
                                >
                                  No. of Bags{" "}
                                  <span className="text-red-600">*</span>
                                </label>
                                <input
                                  type="number"
                                  {...register("noOfBags", { required: true })}
                                  className="bg-gray-50 border border-gray-300 h-14 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                  defaultValue={post?.noOfBags}
                                  required
                                />
                                {errors.contact && (
                                  <span className="text-red-500 font-light">
                                    No of Bag is required
                                  </span>
                                )}
                              </div>
                              <div className="w-full">
                                <label
                                  htmlFor="patientName"
                                  className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                  Patient Name{" "}
                                  <span className="text-red-600">*</span>
                                </label>
                                <input
                                  type="text"
                                  {...register("patientName", {
                                    required: true,
                                  })}
                                  className="bg-gray-50 border border-gray-300 h-14 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                  defaultValue={post?.patientName}
                                  required
                                />
                              </div>
                              <div className="w-full">
                                <label
                                  htmlFor="contact"
                                  className="block mb-2 text-sm font-medium"
                                >
                                  Contact No.{" "}
                                  <span className="text-red-600">*</span>
                                </label>
                                <input
                                  type="number"
                                  className="bg-gray-50 border border-gray-300 h-14 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                  defaultValue={post?.contact}
                                  {...register("contact", { required: true })}
                                  required
                                />
                              </div>

                              <div className="sm:col-span-2">
                                <label
                                  htmlFor="note"
                                  className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                  Note
                                </label>
                                <textarea
                                  id="note"
                                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                  defaultValue={post?.note}
                                ></textarea>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
                              onClick={() => setPostId(post?._id)}
                            >
                              Edit post
                            </button>
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
                    } */}
                  </td>
                  <td
                    className="text-center"
                    onClick={() => router.push(`/myPost/${post?._id}`)}
                  >
                    <button className="bg-teal-600 btn text-white hover:text-black">
                      Requested Donors
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Modal */}
        {isModalOpen && selectedRow && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "white",
              padding: "20px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium"
                >
                  Blood Group <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("bloodGroup", {
                    required: true,
                  })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block h-14 w-full p-2.5"
                  defaultValue={selectedRow?.bloodGroup}
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
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block mt-5 mb-2 text-sm font-medium"
                >
                  Location <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("address", { required: true })}
                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full h-14 p-2.5"
                  defaultValue={selectedRow?.address}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="PatientName"
                  className="block mt-5 mb-2 text-sm font-medium"
                >
                  Patient Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("patientName", { required: true })}
                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full h-14 p-2.5"
                  defaultValue={selectedRow?.patientName}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block mt-5 mb-2 text-sm font-medium"
                >
                  Time <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("time", { required: true })}
                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full h-14 p-2.5"
                  defaultValue={selectedRow?.time}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="contact"
                  className="block mb-2 text-sm font-medium"
                >
                  No. of Bags <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("noOfBags", { required: true })}
                  className="bg-gray-50 border border-gray-300 h-14 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  defaultValue={selectedRow?.noOfBags}
                  required
                />
                {errors.contact && (
                  <span className="text-red-500 font-light">
                    No of Bag is required
                  </span>
                )}
              </div>
              <button
                type="submit"
                onClick={() => setPostId(selectedRow?.id)}
                style={{ marginTop: "10px" }}
              >
                Save
              </button>
            </form>
            <button onClick={handleCloseModal} style={{ marginTop: "10px" }}>
              Close
            </button>
          </div>
        )}

        {/* Modal Overlay */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleCloseModal}
          ></div>
        )}
      </div>
    </div>
  );
};

export default withAuth(MyPost);
