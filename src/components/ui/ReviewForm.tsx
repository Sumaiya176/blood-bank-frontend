"use client";

import { removeRoute, useCurrentUser } from "@/redux/features/auth/authSlice";
import {
  useCreateReviewMutation,
  useEditReviewMutation,
  useMyReviewQuery,
} from "@/redux/features/review/reviewApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import withAuth from "@/utils/withAuth";
import { useEffect, useState } from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";

type Inputs = {
  review: string;
};

const ReviewForm = () => {
  const [selectedReview, setSelectedReview] = useState<{
    _id: string;
    review: string;
    user: string;
  } | null>(null);
  const [editedReview, setEditedReview] = useState("");
  const currentUser = useAppSelector(useCurrentUser);
  const { data } = useMyReviewQuery(currentUser?.id);
  const [editReview] = useEditReviewMutation();
  const [review] = useCreateReviewMutation();
  const myReview = data?.data;
  //console.log(myReview, data?.data, error);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const dispatch = useAppDispatch();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const sendData = {
      review: data.review,
      user: currentUser?.id,
    };
    try {
      const result = await review(sendData).unwrap();
      console.log(result);

      if (result.success === false) {
        toast.error(result.errMessage);
      } else {
        toast.success(result.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleSave = async (id: string) => {
    const data = {
      review: editedReview,
      user: currentUser?.id,
    };

    const sendData = {
      data,
      id,
    };
    try {
      const result = await editReview(sendData).unwrap();
      console.log(result);

      if (result.success === false) {
        toast.error(result.errMessage);
      } else {
        toast.success(result.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
    }
  };

  const openModal = (review: { _id: string; review: string; user: string }) => {
    setSelectedReview(review);
    setEditedReview(review.review); // initialize textarea with current review
    const modal = document.getElementById(
      "edit_modal"
    ) as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  useEffect(() => {
    dispatch(removeRoute());
  }, [dispatch]);
  return (
    <div>
      <form className="my-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <p className="text-2xl font-semibold">
            Write your Review <span className="text-red-400">*</span>
          </p>
          <textarea
            className="border-2 rounded w-full md:w-3/6 p-3 h-40"
            placeholder="Your thoughts.."
            {...register("review", { required: true })}
          />
          {errors.review && <p className="text-red-500">Review is required</p>}

          <div className="">
            <input className="block btn btn-success text-white" type="submit" />
          </div>
        </div>
      </form>
      <div>
        <p className="text-2xl mb-5 font-semibold">My Reviews</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {myReview?.map(
            (review: { _id: string; review: string; user: string }) => (
              <div className="border p-10" key={review._id}>
                <p className="text-gray-400">{review.review}</p>
                <button
                  className="block btn bg-[tomato] text-white mt-6"
                  onClick={() => openModal(review)}
                >
                  Edit Review
                </button>
              </div>
            )
          )}
        </div>

        {/* Modal rendered only once */}
        <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <div className="space-y-4">
              <p className="text-start">
                My Review <span className="text-red-600">*</span>
              </p>
              <textarea
                className="block input input-bordered input-warning w-full max-w-xs h-40"
                value={editedReview}
                onChange={(e) => setEditedReview(e.target.value)}
              />
              {editedReview === "" && (
                <span className="text-red-500 font-light">
                  Review is required
                </span>
              )}

              <div className="flex items-center justify-center">
                <button
                  className="block w-20 btn font-semibold btn-success text-white"
                  type="submit"
                  onClick={() =>
                    selectedReview && handleSave(selectedReview._id)
                  }
                >
                  Edit
                </button>
              </div>
            </div>

            <div className="modal-action">
              <form method="dialog">
                <button className="btn bg-red-500 text-white">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default withAuth(ReviewForm);
