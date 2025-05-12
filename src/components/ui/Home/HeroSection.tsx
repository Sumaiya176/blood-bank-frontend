import Image from "next/image";
import React from "react";

const HeroSection = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 items-center my-14 ">
        <div>
          <p className="text-5xl font-bold text-red-500 tracking-wide">
            Donate Blood, <br /> Save Life!
          </p>
          <p className="mt-5 text-sm text-gray-400">
            Every time you donate, you&apos;re giving someone a second chance at
            life. <br />
            Your contribution could be the reason someone hugs their loved ones
            again.
          </p>
          <button className="flex gap-3 bg-red-500 p-6 text-white my-7 rounded tracking-wide">
            Donate now{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
        </div>
        <div className="flex justify-center">
          <Image
            className="border-8 border-red-500 rounded-tl-full rounded-tr-full rounded-br-full h-96 w-96 object-cover"
            src="/donation.jpg"
            alt=""
            height={500}
            width={500}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 bg-red-500 text-white p-10 border rounded-tr-[70px] my-10">
        <div className="col-span-2">
          <p className="text-3xl my-3">We are helping people from 2 years...</p>
          <p className="text-sm">
            We are helping people for 2 years, connecting donors with those in
            urgent need. In these years, we&apos;ve supported hundreds of lives
            through timely blood donations. Join our growing community of
            lifesavers.
          </p>
        </div>
        <div>
          <button className="flex gap-3 bg-white p-6 text-black my-7 rounded tracking-wide">
            Donate now{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
