"use client";

import { setUser, useCurrentRoute } from "@/redux/features/auth/authSlice";
import { useLoginMutation } from "@/redux/features/auth/userAuth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { verifyToken } from "@/utils/verifyToken";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";

type Inputs = {
  name: string;
  password: string;
};

const LoginForm = () => {
  const router = useRouter();
  const pathname = useAppSelector(useCurrentRoute);
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    try {
      const loginInfo = await login(data).unwrap();
      console.log(loginInfo);
      const user = verifyToken(loginInfo.data.accessToken);
      dispatch(setUser({ user, token: loginInfo.data.accessToken }));

      if (loginInfo.success === false) {
        toast.error(loginInfo.errMessage);
      } else {
        toast.success(loginInfo.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      if (err?.data?.success === false) {
        toast.error(err?.data?.errMessage);
      }
    }

    router.push(pathname || "/");
  };

  return (
    <form
      className="flex items-center justify-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-4">
        <p>User Name</p>
        <input
          className="block input input-bordered input-warning w-full max-w-xs"
          placeholder="Mr. Abc"
          autoComplete="userName"
          {...register("name", { required: true })}
        />
        {errors.name && <span>Name is required</span>}

        <p>Password</p>
        <input
          className="block input input-bordered input-warning w-full max-w-xs"
          type="password"
          autoComplete="current-password"
          placeholder="abc123456789"
          {...register("password", { required: true })}
        />
        {errors.password && <span>Password is required</span>}

        <div className="flex items-center justify-center">
          <input
            className="block w-full btn btn-success text-white"
            type="submit"
          />
        </div>

        <p className="block w-full pt-4">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Don't have any account?{" "}
          <Link className="text-red-500" href="/signup">
            SignUp
          </Link>{" "}
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
