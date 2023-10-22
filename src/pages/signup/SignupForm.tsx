import React, { useState } from "react";
import { API_ENDPOINT } from "../../config/constants";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  userName: string;
  userEmail: string;
  userPassword: string;
};

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const { userName, userEmail, userPassword } = data;

    try {
      const response = await fetch(`${API_ENDPOINT}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          password: userPassword,
        }),
      });
      if (response.status === 422) {
        setError("You already have an account. Try SignIn.");
      } else if (!response.ok) {
        throw new Error("Sign-up failed");
      } else {
        const data = await response.json();
        localStorage.setItem("authToken", data.auth_token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        navigate("/");
        setError(null);
        console.log("Sign-up successful");
      }
    } catch (error) {
      setError("Sign-up failed");
      console.error("Sign-up failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-lg bg-gradient-to-br from-blue-400 to-teal-400 text-white"
    >
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label className="block text-black font-semibold mb-2">
          Your Name:
        </label>
        <input
          type="text"
          id="userName"
          autoFocus
          {...register("userName", { required: true })}
          className="w-full required border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
        />
        {errors.userName && (
          <span className="text-red-500">This field is required</span>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-black font-semibold mb-2">Email:</label>
        <input
          type="email"
          id="userEmail"
          autoFocus
          {...register("userEmail", { required: true })}
          className="w-full required border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
        />
        {errors.userEmail && (
          <span className="text-red-500">This field is required</span>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-black font-semibold mb-2">Password:</label>
        <input
          type="password"
          id="userPassword"
          autoFocus
          {...register("userPassword", { required: true })}
          className="w-full border required rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
        />
        {errors.userPassword && (
          <span className="text-red-500">This field is required</span>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue mt-4"
      >
        Sign Up
      </button>
      <p className="mt-2 text-center text-white-900 ">
        Already have an account?
        <Link className="font-bold text-blue-600 underline ml-2" to="/signin">
          Signin
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
