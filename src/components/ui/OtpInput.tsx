"use client";

import React, { useRef } from "react";

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
}

export default function OtpInput({ length = 6, onComplete }: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = value;

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (index === length - 1) {
      const otp = inputsRef.current.map((input) => input?.value || "").join("");
      if (otp.length === length && typeof onComplete === "function") {
        onComplete(otp);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    if (paste.length !== length) return;

    paste.split("").forEach((char, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i]!.value = char;
      }
    });

    inputsRef.current[length - 1]?.focus();

    if (typeof onComplete === "function") {
      onComplete(paste);
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          className="w-14 h-14 border border-gray-400 rounded-md text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
        />
      ))}
    </div>
  );
}
