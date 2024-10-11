import { CalendarIcon, CreditCardIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

import ManageBilling from "./_components/manage-billing";
import React from 'react';
import { authOptions } from "@/lib/auth";
import { getNextPaymentDetails } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { isUserPremium } from "@/lib/launchpad-server-actions/server-actions";
import { redirect } from "next/navigation";

const Settings = async () => {
    const authenticatedUser = await getServerSession(authOptions);

    if (!authenticatedUser) {
        redirect("/");
    }

    const isPremium = await isUserPremium();
    const subscriptionDetails = await getNextPaymentDetails();

    return (
        <div className=" max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-gray-500 mb-8">Manage your account settings and preferences</p>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border border-blue-400">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Next Payment Date
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">
                            {subscriptionDetails ? subscriptionDetails.nextPaymentDate : "No upcoming payment"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="border border-blue-400">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CreditCardIcon className="mr-2 h-4 w-4" />
                            Next Payment Amount
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-semibold">
                            {subscriptionDetails ? subscriptionDetails.amount : "N/A"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-10">
                {isPremium ? (
                    <ManageBilling />
                ) : (
                    <Card>
                        <CardContent className="pt-6">
                            <h2 className="text-xl font-semibold mb-2">Membership Info</h2>
                            <p className="text-gray-500">
                                Upgrade to our premium plan to access exclusive features and benefits.
                            </p>
                            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                                Upgrade Now
                            </button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Settings;
