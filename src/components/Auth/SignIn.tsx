"use client";
import { useState } from "react";
// import { Icons } from "../Icons";
import { toast } from "@/hooks/use-toast";
import {
  UserLoginValidator,
  UserRegisterationValidator,
} from "@/lib/validators/userCredentials";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { Button } from "../ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/Form";
import { Input } from "../ui/Input";
export type RegisterationFormData = z.infer<typeof UserRegisterationValidator>;
export type LoginFormData = z.infer<typeof UserLoginValidator>;

const UserForm = () => {
  const [formType, setFormType] = useState("login");

  const form = useForm<RegisterationFormData>({
    resolver: zodResolver(UserRegisterationValidator),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(UserLoginValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // now sending payload to backend api using react query usemutation hook and axios post request to backend api endpoint /api/auth/register and /api/auth/login respectively for register and login user respectively and then redirecting to home page on successfull login or register and showing error toast on error in login or register user respectively and also showing loading state while request is in progress using react query usemutation hook

  const { mutate: registerUser, isLoading: isRegisterLoading } = useMutation({
    // check if password and confirm password are same or not and if not then show error toast

    mutationFn: async ({
      username,
      email,
      password,
    }: RegisterationFormData) => {
      const payload: RegisterationFormData = { username, email, password };
      const { data } = await axios.post("/api/register", payload);
      return data;
    },
    onError: err => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: `User with this email  already exists.`,
            description:
              "Please use different email to register else login with existing email.",
            variant: "destructive",
          });
        }
      }
      toast({
        title: "An error occurred.",
        description: "Oops! Could not register user .",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "User registered successfully.",
        description: "You can now login.",
      });
      setFormType("login");
    },
  });

  const { mutate: loginUser, isLoading: isLoginLoading } = useMutation({
    mutationFn: async (data: LoginFormData) => {
      await signIn("credentials", {
        ...data,
        redirect: true,
        // redirect to feed page after login successfull and redirect to login page if login fails
        callbackUrl: "http://localhost:3000/feed",
      }).then(callback => {
        if (callback?.error) {
          toast({
            title: `Invalid credentials.`,
            description: "Please enter valid credentials.",
            variant: "destructive",
          });
        }

        if (callback?.ok && !callback?.error) {
          toast({
            title: "User logged in successfully.",
            description: "You can now use campusbuddy.!",
          });
        }
      });
    },
    onError: () => {
      toast({
        title: "An error occurred.",
        description: "Oops! Could not login user .",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]bg-[#262a35] text-gray-400">
      <div className="flex flex-col space-y-2 ">
        {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
        {/* <h1 className="text-2xl font-semibold tracking-tight">Welcome back!</h1> */}

        {/* <p className="text-sm max-w-xs mx-auto">
          By loging in to CampusBuddy, you agree to the User Agreement and
          Sign-in Policy, ensuring account security, responsible use, and data
          protection.
        </p> */}
        {formType === "login" && (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(loginUser)}
              className="space-y-2"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                isLoading={isLoginLoading}
                className="border-2 border-indigo-600 text-sm font-semibold uppercase tracking-tight text-indigo-600 hover:bg-indigo-600 hover:text-gray-900 rounded-none mx-auto "
              >
                Login
              </Button>
            </form>
          </Form>
        )}

        {/* Sign Up */}

        {formType === "register" && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(registerUser)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Type a nice username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                isLoading={isRegisterLoading}
                className="border-2 border-indigo-600 text-sm font-semibold uppercase tracking-tight text-indigo-600 hover:bg-indigo-600 hover:text-gray-900 rounded-none mx-auto "
              >
                Register
              </Button>
            </form>
          </Form>
        )}

        <div className="flex justify-between items-start ">
          {formType == "login" ? (
            <>
              <p className="text-indigo-500 cursor-pointer">
                New to CampusBuddy?{" "}
              </p>
              <div
                className="hover:text-indigo-600 text-sm underline underline-offset-4 cursor-pointer"
                onClick={() => setFormType("register")}
              >
                Register
                {/* </Link> */}
              </div>
            </>
          ) : (
            <>
              <p className="text-indigo-500 cursor-pointer">
                Already on CampusBuddy?{" "}
              </p>
              <div
                className="hover:text-indigo-600 text-sm underline underline-offset-4 cursor-pointer"
                onClick={() => setFormType("login")}
              >
                Sign In
                {/* </Link> */}
              </div>
            </>
          )}

          {/* <Link
            href="/sign-up" */}
        </div>
      </div>
    </div>
  );
};

export default UserForm;
