"use client";

import { logout, useCurrentToken } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Link from "next/link";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(useCurrentToken);
  return (
    <div>
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
          <Link href="/" className="btn btn-ghost text-xl">
            Blood Bank
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/dashboard">Dashboard</Link>
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
          {token ? (
            <p onClick={() => dispatch(logout())} className="btn">
              Logout
            </p>
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

export default Navbar;