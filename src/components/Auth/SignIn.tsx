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
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
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

  // const { mutate: registerUser, isLoading } = useMutation({
  //   // check if password and confirm password are same or not and if not then show error toast

  //   mutationFn: async ({ email, password }: FormData) => {
  //     const payload: FormData = { email, password };
  //     // const { data } = await axios.post("/api/auth/register", payload);
  //     // return data;
  //     console.log(payload);
  //   },
  // });

  function loginUser(data: LoginFormData) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  function registerUser(data: RegisterationFormData) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

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
