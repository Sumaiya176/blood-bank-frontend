"use client";

import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRegistrationMutation } from "@/redux/features/auth/userAuth";
type Inputs = {
  name: string;
  email: string;
  password: string;
  age: number;
  location: string;
};

const SignUpForm = () => {
  const [warningMessage, setWarningMessage] = useState("");
  const [registration] = useRegistrationMutation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (user) => {
    const data = { user };
    try {
      const userInfo = await registration(data).unwrap();
      if (userInfo.success === false) {
        toast.error(userInfo.errMessage);
      } else {
        toast.success(userInfo.message);
      }
      //console.log("Registration successful", userInfo);
    } catch (err) {
      console.error("Registration error", err);
    }
  };

  const userName = watch("name");

  const userNameSimilarityChecking = async (data: string) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/auth/similar-username-checking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: data }),
          cache: "no-store",
        }
      );
      const userInfo = await res.json();
      if (userInfo?.success === true) {
        setWarningMessage(userInfo.message);
      } else {
        setWarningMessage("");
      }

      console.log(userInfo);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (userName?.length < 3) {
      setWarningMessage("UserName must be at least 3 characters long");
    } else {
      setWarningMessage("");
      userNameSimilarityChecking(userName);
    }
  }, [userName]);

  return (
    <form
      className="flex items-center justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <p>
          User Name <span className="text-red-600">*</span>
        </p>
        <input
          type="text"
          className="block input input-bordered input-warning w-full max-w-xs"
          placeholder="Mr. Abc"
          {...register("name", { required: true })}
        />
        {errors.name && (
          <span className="text-red-500 font-light">Name is required</span>
        )}
        {warningMessage && (
          <p className="text-red-500 text-sm">{warningMessage}</p>
        )}

        <p>
          Email <span className="text-red-600">*</span>
        </p>
        <input
          type="text"
          className="block input input-bordered input-warning w-full max-w-xs"
          placeholder="abc@gmail.com"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">Email is required</span>
        )}

        <p>
          Password <span className="text-red-600">*</span>
        </p>
        <input
          className="block input input-bordered input-warning w-full max-w-xs"
          type="password"
          placeholder="abc123456789"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">Password is required</span>
        )}

        <p>
          Age <span className="text-red-600">*</span>
        </p>
        <input
          className="block input input-bordered input-warning w-full max-w-xs"
          type="number"
          placeholder="25"
          {...register("age", { required: true, valueAsNumber: true })}
        />
        {errors.age && (
          <span className="text-red-500 text-sm">Age is required</span>
        )}

        <p>
          Location <span className="text-red-600">*</span>
        </p>
        <input
          className="block input input-bordered input-warning w-full max-w-xs"
          placeholder="Uttara"
          {...register("location", { required: true })}
        />
        {errors.location && (
          <span className="text-red-500 text-sm">Location is required</span>
        )}

        <div className="flex items-center justify-center">
          <input
            className="block w-full btn font-semibold btn-success text-white"
            type="submit"
          />
        </div>

        <p className="block w-full pt-4">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Already have an account?{" "}
          <Link className="text-red-500" href="/login">
            Login
          </Link>{" "}
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;