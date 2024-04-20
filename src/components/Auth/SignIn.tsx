"use client";

import { Eye, EyeOff } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/Form";
import {
    UserLoginValidator,
    UserRegisterationValidator,
} from "@/lib/validators/userCredentials";
import axios, { AxiosError } from "axios";

import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { signIn } from "next-auth/react";
// import { Icons } from "../Icons";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
    const [show_input, setShowInput] = useState(false);
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
                        title: `User with this email already exists.`,
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

    const { mutate: loginUser, isLoading: isLoginLoading } = useMutation<
        void,
        unknown,
        LoginFormData
    >({
        mutationFn: async (data: LoginFormData) => {
            try {
                const callback = await signIn("credentials", {
                    ...data,
                    redirect: true,
                    callbackUrl: "https://devcastle.vercel.app/feed", // callbackUrl: "http://localhost:3000/feed", for development
                });

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
                        description: "You can now use campusbuddy!",
                    });
                }
            } catch (error) {
                // Handle error from signIn or other async operations
                toast({
                    title: "An error occurred.",
                    description: "Oops! Could not login user.",
                    variant: "destructive",
                });
            }
        },
        onError: () => {
            // If there's an error during the mutationFn (e.g., from signIn), this will handle it
            toast({
                title: "An error occurred.",
                description: "Oops! Could not login user.",
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
                            onSubmit={loginForm.handleSubmit(loginUser as any)}
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
                                            {/* add span here to hide or show password */}
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

                {/* add functionality of show or hide password */}

                {formType === "register" && (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(registerUser as any)}
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
                                            <div className="flex justify-end items-center relative ">
                                                <Input
                                                    placeholder="Your password"
                                                    {...field}
                                                    type={show_input ? "text" : "password"}
                                                />

                                                <div
                                                    className="text-indigo-600 hover:text-indigo-500 cursor-pointer absolute px-3 "
                                                    onClick={() => setShowInput(!show_input)}
                                                >
                                                    {show_input ? (
                                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                                    ) : (
                                                        <Eye className="h-5 w-5 text-indigo-500" />
                                                    )}
                                                </div>
                                            </div>
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
