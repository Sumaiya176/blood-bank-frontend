"use client";

import { IUser } from "@/types/userTypes";
import { useRef } from "react";
import { useAllReviewQuery } from "@/redux/features/review/reviewApi";
import Image from "next/image";

export default function AllReviews() {
  const { data } = useAllReviewQuery("");

  const sliderRef = useRef<HTMLDivElement>(null);
  console.log(data);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.offsetWidth;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full px-4 py-10 my-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold mb-8">Reviews</h2>
        <div className="space-x-8">
          <button className="" onClick={() => scroll("left")}>
            {/* ⬅️ */}
            <Image src={"/leftArrows.png"} alt="" height={25} width={25} />
          </button>
          <button className="  " onClick={() => scroll("right")}>
            {/* ➡️ */}
            <Image src={"/rightArrows.png"} alt="" height={25} width={25} />
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="flex overflow-hidden space-x-4 scrollbar-hide scroll-smooth"
      >
        {data?.data?.map(
          (review: { _id: string; review: string; user: IUser }) => (
            <div
              key={review?._id}
              className="min-w-[250px] max-w-[250px] sm:min-w-[300px] sm:max-w-[300px] md:min-w-[300px] md:max-w-[300px] gap-6
             bg-white border p-6 flex-shrink-0"
            >
              <div className="overflow-y-auto max-h-[200px]">
                <h3 className="text-gray-400 text-lg mb-2 break-words">
                  {review?.review}
                </h3>
              </div>
              <p className="text-gray-500 font-semibold mt-8 flex justify-end items-end">
                {review?.user?.name}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
