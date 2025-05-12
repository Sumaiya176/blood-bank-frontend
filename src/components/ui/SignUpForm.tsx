"use client";

import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRegistrationMutation } from "@/redux/features/auth/userAuth";
import { districtData } from "@/utils/districtData";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useCurrentRoute } from "@/redux/features/auth/authSlice";
type Inputs = {
  name: string;
  email: string;
  password: string;
  age: number;
  district: string;
  bloodGroup: string;
};

const SignUpForm = () => {
  const [warningMessage, setWarningMessage] = useState("");
  const [registration] = useRegistrationMutation();
  const pathname = useAppSelector(useCurrentRoute);
  const router = useRouter();
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
      console.log(userInfo);
      if (userInfo.success === false) {
        toast.error(userInfo.message);
      } else {
        toast.success(userInfo.message);
        router.push(pathname || "/");
      }
    } catch (err) {
      console.log("Registration error", err);
    }
  };

  const userName = watch("name");

  const userNameSimilarityChecking = async (data: string) => {
    try {
      const res = await fetch(
        "https://server-blood-bank.vercel.app/api/v1/auth/similar-username-checking",
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.message);
    }
  };

  // finding geolocation function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // const getUserLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;

  //         setUserLocation({ latitude, longitude });
  //       },

  //       (error) => {
  //         console.error("Error get user location: ", error);
  //       }
  //     );
  //   } else {
  //     console.log("Geolocation is not supported by this browser");
  //   }
  // };

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
          Blood Group <span className="text-red-600">*</span>
        </p>
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
          <span className="text-red-500 text-sm">Blood Group is required</span>
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

        <label
          htmlFor="location"
          className="block mt-5 mb-2 text-sm font-medium"
        >
          District <span className="text-red-600">*</span>
        </label>
        <select
          {...register("district", { required: true })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block h-14 w-full p-2.5"
          required
        >
          {districtData?.map(
            (data: { id: number; districtTitle: string; value: string }) => (
              <option key={data?.id} value={data?.value}>
                {data?.districtTitle}
              </option>
            )
          )}
        </select>
        {errors.district && (
          <span className="text-red-500 font-light">District is required</span>
        )}

        <div className="flex items-center justify-center">
          <input
            className="block w-full btn font-semibold btn-success text-white"
            type="submit"
            //onClick={() => getUserLocation()}
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
