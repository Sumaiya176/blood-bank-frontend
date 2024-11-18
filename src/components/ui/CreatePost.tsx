"use client";

import { useCurrentUser } from "@/redux/features/auth/authSlice";
import { useCreateBloodPostMutation } from "@/redux/features/bloodPost/bloodPostApi";
import { useAppSelector } from "@/redux/hooks";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";

type Inputs = {
  bloodGroup: string;
  location: string;
  time: string;
  patientName: string;
  contact: number;
  note?: string;
  postCreator: string;
};

const CreatePost = () => {
  const [createPost] = useCreateBloodPostMutation();
  const user = useAppSelector(useCurrentUser);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (post: Inputs) => {
    console.log(post);
    post.postCreator = user?.id as string;

    const postData = {
      bloodPost: post,
    };
    try {
      const postRes = await createPost(postData).unwrap();
      if (postRes.success === false) {
        toast.error(postRes.errMessage);
      } else {
        toast.success(postRes.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <section className="bg-white">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
          <h2 className="mb-4 text-xl font-bold">Add a new post</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium"
                >
                  Blood Group <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("bloodGroup", { required: true })}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block h-14 w-full p-2.5"
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
                  <span className="text-red-500 font-light">
                    Blood Group is required
                  </span>
                )}
                <label
                  htmlFor="location"
                  className="block mt-5 mb-2 text-sm font-medium"
                >
                  Location <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("location", { required: true })}
                  className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full h-14 p-2.5"
                  placeholder="Type product name"
                  required
                />
                {errors.location && (
                  <span className="text-red-500 font-light">
                    Location is required
                  </span>
                )}
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
                  placeholder="Type product name"
                  required
                />
                {errors.time && (
                  <span className="text-red-500 font-light">
                    Time is required
                  </span>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="patientName"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Patient Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("patientName", { required: true })}
                  className="bg-gray-50 border border-gray-300 h-14 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Product brand"
                  required
                />
                {errors.patientName && (
                  <span className="text-red-500 font-light">
                    Patient Name is required
                  </span>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="contact"
                  className="block mb-2 text-sm font-medium"
                >
                  Contact No. <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("contact", { required: true })}
                  className="bg-gray-50 border border-gray-300 h-14 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="$2999"
                  required
                />
                {errors.contact && (
                  <span className="text-red-500 font-light">
                    Contact No is required
                  </span>
                )}
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
                  placeholder="Your note here"
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center bg-blue-600 text-white px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
            >
              Add post
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CreatePost;
