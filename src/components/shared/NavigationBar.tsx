"use client";

import {
  logout,
  useCurrentToken,
  useCurrentUser,
} from "@/redux/features/auth/authSlice";
import { useAllUsersQuery } from "@/redux/features/auth/userAuth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IUser } from "@/types/userTypes";
import Image from "next/image";
//import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const NavigationBar = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(useCurrentToken);
  const currentUser = useAppSelector(useCurrentUser);
  const { data: users, refetch } = useAllUsersQuery("");

  let myProfileData;
  if (users) {
    myProfileData = users?.data?.filter(
      (user: IUser) => user.name === currentUser?.name
    );
  }

  useEffect(() => {
    refetch();
  });

  return (
    <div className="sticky top-0 z-10 pb-4">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/allPosts">All Posts</Link>
              </li>
              <li>
                <Link href="/activeUsers">Active Users</Link>
              </li>
              <li>
                <Link href="/createPost">Add Post</Link>
              </li>
              <li>
                <Link href="/receivedRequest">Received Request</Link>
              </li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost text-lg md:text-xl">
            Blood Bank
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/allPosts">All Posts</Link>
            </li>
            <li>
              <Link href="/activeUsers">Active Users</Link>
            </li>
            <li>
              <Link href="/createPost">Add Post</Link>
            </li>
            <li>
              <Link href="/receivedRequest">Received Request</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle me-4"
          >
            <div className="indicator">
              <Image
                src="/medal-reward.svg"
                alt="Icon"
                width={35}
                height={35}
              />
              <span className="badge text-base badge-sm indicator-item text-red-600">
                {myProfileData ? myProfileData[0]?.points : ""}
              </span>
            </div>
          </div>

          {token ? (
            <div className="flex-none">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <Image
                    className={` border-4 ${
                      myProfileData && myProfileData[0]?.donationAvailability
                        ? "border-green-600"
                        : "border-red-600"
                    }  rounded-full`}
                    alt="Tailwind CSS Navbar component"
                    src="/gigi.jpg"
                    width="20"
                    height="20"
                  />
                  <p className="mt-[-7px]">{currentUser?.name}</p>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link href="/myPost">My Post</Link>
                  </li>
                  <li>
                    <Link href="/myDonationHistory">My Donation History</Link>
                  </li>
                  <li>
                    <Link href="/connection">Make Connection</Link>
                  </li>
                  <li>
                    <p onClick={() => dispatch(logout())} className="btn">
                      Logout
                    </p>
                    {/* {token ? (
                    <p onClick={() => dispatch(logout())} className="btn">
                      Logout
                    </p>
                  ) : (
                    <Link href="/login" className="btn">
                      Login
                    </Link>
                  )} */}
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link href="/login" className="btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
