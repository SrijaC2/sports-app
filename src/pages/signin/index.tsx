import React from "react";
import SigninForm from "./SigninForm";

const Signin: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-400 to-teal-400">
      <div className="max-w-md w-full p-8 bg-white border rounded-lg shadow-lg text-blue-900">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Sign in
        </h1>
        <SigninForm />
      </div>
    </div>
  );
};
export default Signin;
