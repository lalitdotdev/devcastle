'use client'

import { CreditCard, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import React from 'react';
import { createCustomerLink } from "@/lib/stripe";
import { toast } from "sonner";

const ManageBilling = () => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleManageBilling = async () => {
        setIsLoading(true);
        try {
            const result = await createCustomerLink();
            if (result) {
                window.location.href = result;
            } else {
                throw new Error("Error creating customer portal link");
            }
        } catch (error: any) {
            toast.error("Could not create checkout session. Please try again", {
                position: "top-center",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleManageBilling}
            disabled={isLoading}
            className="w-full sm:w-auto"
        >
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <CreditCard className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Processing..." : "Manage Billing"}
        </Button>
    );
};

export default ManageBilling;
