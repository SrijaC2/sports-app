import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../../config/constants";

interface FormValues {
  email: string;
  password: string;
}

const SigninForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [error, setError] = useState<string | null>(null);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/users/sign_in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = "User not found or sign-in failed";
        setError(errorMessage);
        return;
      }

      setError(null);

      const responseData = await response.json();
      localStorage.setItem("authToken", responseData.auth_token);
      localStorage.setItem("userData", JSON.stringify(responseData.user));
      navigate("/");
    } catch (error) {
      console.error("Sign-in failed:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-lg bg-gray-700 text-white"
    >
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-200 font-semibold mb-2">Email:</label>
        <input
          type="email"
          id="email"
          {...register("email", { required: true })}
          className="w-full border rounded-md py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
        />
        {errors.email && <p className="text-red-500">Email is necessary</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-200 font-semibold mb-2">
          Password:
        </label>
        <input
          type="password"
          id="password"
          {...register("password", { required: true })}
          className="w-full border rounded-md py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline-blue"
        />
        {errors.password && (
          <p className="text-red-500">Password is necessary</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-br from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-gray mt-4"
      >
        Sign In
      </button>
      <p className="mt-2 text-center">
        New User?
        <Link
          className="font-bold text-gray-400 underline ml-2 hover:text-blue-600"
          to="/signup"
        >
          Signup
        </Link>
      </p>
      <p className="mt-2 text-center text-blue-400 hover:text-blue-600 font-medium ">
        <Link to="/">Go back to Home</Link>
      </p>
    </form>
  );
};

export default SigninForm;
