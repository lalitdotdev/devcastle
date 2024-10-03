"use client"

import { Ban, CalendarIcon, Globe, Hand, Twitter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React, { useCallback, useState } from 'react'

import { Button } from '@/components/ui/Button';
import { Calendar } from '@/components/ui/calendar';
import Image from 'next/image';
import { ImagesUploader } from '@/components/launchpad/uploaders/images-uploader';
import { LogoUploader } from '@/components/launchpad/uploaders/logo-uploader';
import { Separator } from '@/components/ui/separator';
import { StatefulButton } from '@/components/Feed/Stateful-btn';
import { cn } from '@/lib/utils';
import { createProduct } from '@/lib/launchpad-server-actions/server-actions';
import { format } from "date-fns";
import { motion } from 'framer-motion'
import { toast } from 'sonner';

const categories = [
    "Media",
    "Blockchain",
    "Cloud",
    "Commerce",
    "Cybersecurity",
    "Data",
    "Design",
    "Photography",
    "E-commerce",
    "Education",
    "Entertainment",
    "Video",
    "Finance",
    "Social",
    "Health",
    "Fitness",
    "Marketing",
    "Music",
    "Productivity",
    "Engineering",
    "Sales",
    "Sports",
    "Travel",
    "Bootstrapped",
    "Art",
    "Analytics",
];
const NewProductPage = () => {





    // check auth only authenticated users can submit a product

    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [headline, setHeadline] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string>("");
    const [uploadedProductImages, setUploadedProductImages] = useState<string[]>([]);
    const [website, setWebsite] = useState("");
    const [twitter, setTwitter] = useState("");
    const [discord, setDiscord] = useState("")
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);



    const nextStep = useCallback(() => {
        if (step === 1 && name.length < 4) {
            toast(
                <>
                    <div className="flex items-center gap-4  mx-auto">
                        <Hand className="text-red-500 text-3xl" />
                        <div className="text-md font-semibold">
                            Please enter at least 4 characters for the product name.
                        </div>
                    </div>
                </>,
                {
                    position: "top-center",
                }
            );

            return;
        }

        if (step === 2 && selectedCategories.length < 3) {
            console.log(selectedCategories.length)
            toast(
                <>
                    <div className="flex items-center gap-4  mx-auto">
                        <Ban className="text-red-500 text-3xl" />
                        <div className="text-md font-semibold">
                            Please select at least 3 categories for the product.
                        </div>
                    </div>
                </>,
                {
                    position: "top-center",
                }
            );
            return;
        }
        if (step === 3 && headline.length < 10) {
            toast(
                <>
                    <div className="flex items-center gap-4  mx-auto">
                        <Hand className="text-red-500 text-3xl" />
                        <div className="text-md font-semibold">
                            Please enter at least 10 characters for the headline.
                        </div>
                    </div>
                </>,
                {
                    position: "top-center",
                }
            );
            return;
        }

        if (step === 3 && shortDescription.length < 20) {
            toast(
                <>
                    <div className="flex items-center gap-4  mx-auto">
                        <Hand className="text-red-500 text-3xl" />
                        <div className="text-md font-semibold">
                            Please enter at least 20 characters for the short description.
                        </div>
                    </div>
                </>,
                {
                    position: "top-center",
                }
            );
            return;
        }

        if (step === 4 && !uploadedLogoUrl) {
            toast(
                <>
                    <div className="flex items-center gap-4  mx-auto">
                        <Hand className="text-red-500 text-3xl" />
                        <div className="text-md font-semibold">
                            Please upload a logo for the product.
                        </div>
                    </div>
                </>,
                {
                    position: "top-center",
                }
            );
            return;
        }

        if (step === 4 && uploadedProductImages.length < 1) {
            toast(
                <>
                    <div className="flex items-center gap-4  mx-auto">
                        <Hand className="text-red-500 text-3xl" />
                        <div className="text-md font-semibold">
                            Upload at least 3 images for the product.
                        </div>
                    </div>
                </>,
                {
                    position: "top-center",
                }
            );
            return;
        }

        if (step === 5 && !date) {
            toast(
                <>
                    <div className="flex items-center gap-4  mx-auto">
                        <Hand className="text-red-500 text-3xl" />
                        <div className="text-md font-semibold">
                            Please select a release date or choose the Coming soon option.
                        </div>
                    </div>
                </>,
                {
                    position: "top-center",
                }
            );
            return;
        }

        if (step == 6 && !website && !twitter && !discord) {
            toast(
                <>
                    <div className="flex items-center gap-4  mx-auto">
                        <Hand className="text-red-500 text-3xl" />
                        <div className="text-md font-semibold">
                            Please enter at least one link for the product.
                        </div>
                    </div>
                </>,
                {
                    position: "top-center",
                }
            );
            return;
        }




        setStep(step + 1);
    },
        [name,
            step, selectedCategories, headline,
            shortDescription,
            uploadedLogoUrl,
            uploadedProductImages,
            date,
            website,
            twitter,
            discord,]);




    // =====================> ALL THE HANDLERS <=====================
    const handleNameChange = (e: any) => {
        const productName = e.target.value;
        const truncatedName = productName.slice(0, 30);
        setName(truncatedName);


        // Create slug from product name by converting it to lowercase, replacing spaces with hyphens, and removing periods
        const slugValue = truncatedName
            .toLowerCase()
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/\./g, "-"); // Replace periods with hyphens in the slug
        setSlug(slugValue); // Set Slug state with new value
    };

    // Handle headline change
    const handleHeadlineChange = (e: any) => {
        const headlineText = e.target.value.slice(0, 80);
        setHeadline(headlineText);
    };

    // Handle short description change
    const handleShortDescriptionChange = (e: any) => {
        setShortDescription(e.target.value.slice(0, 400));
    };


    const handleCategoryToggle = (category: string) => {
        // If the category is already selected, remove it from the list
        if (selectedCategories.includes(category)) {
            setSelectedCategories((prevCategories) =>
                prevCategories.filter((prevCategory) => prevCategory !== category)
            );
        } else if (selectedCategories.length < 3) {
            // If the category is not selected and the selected categories are less than 3, add it to the list
            setSelectedCategories((prevCategories) => [...prevCategories, category]);
        }
    };

    const handleWebsiteChange = (e: any) => {
        setWebsite(e.target.value);
    };
    const handleTwitterChange = (e: any) => {
        setTwitter(e.target.value);
    };

    const handleDiscordChange = (e: any) => {
        setDiscord(e.target.value);
    };

    const handleLogoUpload = useCallback((url: any) => {
        setUploadedLogoUrl(url);
    }, []);

    const handleProductImagesUpload = useCallback((urls: string[]) => {
        setUploadedProductImages(urls);
    }, []);



}


export default NewProductPage

