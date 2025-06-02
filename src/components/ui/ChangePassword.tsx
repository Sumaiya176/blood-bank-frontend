"use client";

import { FocusEvent, useEffect, useState } from "react";
import OtpInput from "./OtpInput";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from "@/redux/features/auth/userAuth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeRoute, useCurrentUser } from "@/redux/features/auth/authSlice";
import withAuth from "@/utils/withAuth";
import { toast } from "react-hot-toast";

const ChangePassword = () => {
  const [sendOtp, setSendOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const currentUser = useAppSelector(useCurrentUser);
  const [forgotPass] = useForgotPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();
  const dispatch = useAppDispatch();
  const [verifyOtp] = useVerifyOtpMutation();
  const [otp, setOtp] = useState("");

  const handleSendOtp = async () => {
    try {
      setSendingOtp("Sending Otp to email ...");
      const email = currentUser?.email;
      const result = await forgotPass({ email });
      if (result.data.success) {
        setSendingOtp("");
        setSendOtp(true);
      }
      console.log(result);
    } catch (err) {
      console.log("Error in sending otp", err);
    }
  };

  const handleOtpComplete = async (otp: string) => {
    console.log("OTP entered:", otp);
    setOtp(otp);
    try {
      const result = await verifyOtp(otp).unwrap();

      if (result.success === false) {
        toast.error(result.errMessage);
      } else if (result.success === true) {
        setOtpVerified(true);
        toast.success(result.message);
      }
      console.log(result);
    } catch (err) {
      console.log("Error in verifying otp", err);
    }
  };

  const handlePassword = async (e: FocusEvent<HTMLInputElement>) => {
    console.log(e.target.value, newPassword);
    if (newPassword !== e.target.value) {
      setPasswordError("Password do not match..");
      return;
    } else if (newPassword === e.target.value) {
      setPasswordError("");
    }

    try {
      const data = { otp: otp, password: newPassword };

      const result = await resetPassword({ data }).unwrap();
      if (result.success === false) {
        toast.error(result.errMessage);
      } else if (result.success === true) {
        toast.success(result.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    dispatch(removeRoute());
  }, [dispatch]);

  return (
    <div className="flex items-center justify-center h-full">
      <div>
        <p className="text-xl font-semibold">
          {" "}
          Blood Bank want to send you a OTP in your mail{" "}
        </p>
        <div className="flex justify-center mt-5">
          <button
            onClick={() => handleSendOtp()}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Send
          </button>
        </div>
        <div className="text-center my-10">
          {sendingOtp}
          {sendOtp ? (
            <div className="flex justify-center gap-5">
              <div>
                <p className="text-red-500 mb-5">
                  OTP will be valid for 5 minutes....
                </p>
                <OtpInput onComplete={handleOtpComplete} />
              </div>
            </div>
          ) : null}
          {otpVerified ? (
            <div className="space-y-5 gap-5 mt-10">
              <div>
                <p className="text-start mb-3">Password</p>
                <input
                  type="text"
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border h-14 w-full"
                />
              </div>
              <div>
                <p className="text-start mb-3">Confirm Password</p>
                <input
                  type="text"
                  onBlur={(e) => handlePassword(e)}
                  className="border h-14 w-full"
                />
                {passwordError ? (
                  <p className="text-red-400 mt-4 text-start">
                    {passwordError}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default withAuth(ChangePassword);
