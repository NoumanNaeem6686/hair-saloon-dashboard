"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { LoginSchema } from "@/helpers/schemas";
import { LoginFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react"; // Removed Loading
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios"; // Import axios

export const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Add loading state

  const initialValues: LoginFormType = {
    email: "",
    password: "",
  };

  const handleLogin = useCallback(
    async (values: LoginFormType) => {
      try {
        setLoading(true); // Set loading state to true when request starts
        // Make a POST request to the backend API for login
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/admin/signInAdmin`,
          {
            email: values.email,
            password: values.password,
          }
        );

        console.log("login response", response);

        // Assuming the response contains a token or some authentication data
        if (response.status === 200) {
          console.log("Login successful:", response.data);
          await createAuthCookie(response.data.token);
          router.replace("/");
        } else {
          console.error("Login failed:", response.data.message);
          alert(response.data.message || "Login failed");
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false); // Reset loading state once request is done
      }
    },
    [router]
  );

  return (
    <>
      <div className="text-center text-[25px] font-bold mb-6">Login</div>

      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <>
            <div className="flex flex-col w-1/2 gap-4 mb-4">
              <Input
                variant="bordered"
                label="Email"
                type="email"
                value={values.email}
                placeholder="Enter your email"
                isInvalid={!!errors.email && !!touched.email}
                errorMessage={errors.email}
                onChange={handleChange("email")}
              />
              <Input
                variant="bordered"
                label="Password"
                type="password"
                value={values.password}
                placeholder="Enter your password"
                isInvalid={!!errors.password && !!touched.password}
                errorMessage={errors.password}
                onChange={handleChange("password")}
              />
            </div>

            <Button
              type="submit"
              variant="flat"
              color="primary"
              onPress={() => handleSubmit()}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <span className="loader"></span> // Display a custom loader (replace with your own spinner)
              ) : (
                "Login"
              )}
            </Button>
          </>
        )}
      </Formik>

      <div className="font-light text-slate-400 mt-4 text-sm">
        Don&apos;t have an account ?{" "}
        <Link href="/register" className="font-bold">
          Register here
        </Link>
      </div>

      {/* Custom Loader Styling */}
      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3; /* Light grey */
          border-top: 4px solid #3498db; /* Blue */
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};
