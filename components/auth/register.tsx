"use client";

import { createAuthCookie } from "@/actions/auth.action";
import { RegisterSchema } from "@/helpers/schemas";
import { RegisterFormType } from "@/helpers/types";
import { Button, Input } from "@nextui-org/react";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react"; // Added useState
import axios from "axios"; // Import axios

export const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Add loading state

  const initialValues: RegisterFormType = {
    name: "",
    email: "",
    password: "",
  };

  const handleRegister = useCallback(
    async (values: RegisterFormType) => {
      try {
        setLoading(true); // Set loading state to true when request starts
        // Make a POST request to the backend API for registration using axios
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/admin/signUpAdmin`,
          {
            userName: values.name,
            email: values.email,
            password: values.password,
          }
        );

        if (response.status === 201) {
          // Assuming `createAuthCookie` handles setting up auth cookies after successful registration
          await createAuthCookie(response.data.token);
          router.replace("/");
        } else {
          // Handle error response
          console.error("Registration failed:", response.data.message);
          alert(response.data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false); // Reset loading state once request is done
      }
    },
    [router]
  );

  return (
    <>
      <div className="text-center text-[25px] font-bold mb-6">Register</div>

      <Formik
        initialValues={initialValues}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <>
            <div className="flex flex-col w-1/2 gap-4 mb-4">
              <Input
                variant="bordered"
                label="Name"
                value={values.name}
                isInvalid={!!errors.name && !!touched.name}
                errorMessage={errors.name}
                onChange={handleChange("name")}
              />
              <Input
                variant="bordered"
                label="Email"
                type="email"
                value={values.email}
                isInvalid={!!errors.email && !!touched.email}
                errorMessage={errors.email}
                onChange={handleChange("email")}
              />
              <Input
                variant="bordered"
                label="Password"
                type="password"
                value={values.password}
                isInvalid={!!errors.password && !!touched.password}
                errorMessage={errors.password}
                onChange={handleChange("password")}
              />
            </div>

            <Button
              onPress={() => handleSubmit()}
              variant="flat"
              color="primary"
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <span className="loader"></span> // Display a custom loader (replace with your own spinner)
              ) : (
                "Register"
              )}
            </Button>
          </>
        )}
      </Formik>

      <div className="font-light text-slate-400 mt-4 text-sm">
        Already have an account ?{" "}
        <Link href="/login" className="font-bold">
          Login here
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
