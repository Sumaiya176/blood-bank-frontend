"use client";

import {
  logout,
  useCurrentToken,
  useCurrentUser,
} from "@/redux/features/auth/authSlice";
import {
  useAllUsersQuery,
  useLogOutMutation,
} from "@/redux/features/auth/userAuth";
import { useLazyReceivedRequestQuery } from "@/redux/features/donarRequest/donarRequestApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IUser } from "@/types/userTypes";
import Image from "next/image";
//import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
//import { useEffect } from "react";

const NavigationBar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const token = useAppSelector(useCurrentToken);
  const currentUser = useAppSelector(useCurrentUser);
  const { data: users } = useAllUsersQuery(undefined);
  const [logOutApi] = useLogOutMutation();
  const user = useAppSelector(useCurrentUser);
  const [trigger, { data }] = useLazyReceivedRequestQuery();

  //console.log(token, currentUser);
  //console.log(currentAuth);
  let myProfileData;
  if (users) {
    myProfileData = users?.data?.filter(
      (user: IUser) => user.name === currentUser?.name
    );
  }

  const handleLogoutBtn = async () => {
    try {
      await logOutApi().unwrap();
      dispatch(logout());
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (user) {
      trigger(user?.id);
    }
  }, [user, trigger]);

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
                <div className="indicator">
                  <Link
                    href="/receivedRequest"
                    className="indicator-item indicator-center"
                  >
                    Received Request
                  </Link>
                  {data?.data.count > 0 && (
                    <span className="badge badge-sm bg-red-600 text-white absolute top-0 right-[-10px]">
                      {data?.data.count}4
                    </span>
                  )}
                </div>
                <div className="indicator">
                  <Link
                    href="/receivedRequest"
                    className="indicator-item indicator-center"
                  >
                    Received Request
                  </Link>
                  <span className="badge text-base badge-sm indicator-item text-red-600">
                    {myProfileData ? myProfileData[0]?.points : ""}
                  </span>
                </div>
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
              <div className="indicator">
                {data?.data.count > 0 && (
                  <span className="indicator-item badge badge-primary">
                    12{data?.data.count}
                  </span>
                )}
                <Link href="/receivedRequest">Received Request</Link>
              </div>
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
                    <Link href="/createReview">Review</Link>
                  </li>
                  <li>
                    <p onClick={() => handleLogoutBtn()} className="btn">
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
