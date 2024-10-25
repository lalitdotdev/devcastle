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
    "AI"
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


    // Submit product to the server
    const submitProduct = async () => {
        setLoading(true);
        const formattedDate = date ? format(date, "MM/dd/yyyy") : "";


        try {
            await createProduct({
                name,
                slug,
                headline,
                website,
                twitter,
                discord,
                description: shortDescription,
                logo: uploadedLogoUrl,
                releaseDate: formattedDate,
                images: uploadedProductImages,
                categories: selectedCategories,
            });
            setStep(8);
            toast.success("Product submitted successfully");
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while submitting the product", {
                icon: '🔴',

            });
            setLoading(false);
        }
    };


    const prevStep = useCallback(() => {
        setStep(step - 1);
    }, [step]);

    const handleGoToProducts = () => {
        window.location.href = "/launchpad/my-products";
    };

    const submitAnotherProduct = () => {
        setStep(1);
        setName("");
        setSlug("");
        setHeadline("");
        setShortDescription("");
        setDate(new Date());
        setWebsite("");
        setTwitter("");
        setDiscord("");
        setSelectedCategories([]);
        setUploadedProductImages([]);
        setUploadedLogoUrl("");
    };
    return (
        <div className="flex items-center justify-center py-8 md:py-20 min-h-[70vh] bg-gray-800">
            <div className="px-8 md:w-3/5 md:mx-auto">
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }} // Slide in from the right
                        animate={{ opacity: 1, x: 0 }} // Slide to the center
                        exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
                        transition={{ duration: 0.3 }}
                        className="space-y-10">
                        <h1 className="text-4xl font-semibold"> 📦  Submit a New product</h1>
                        <p className="text-xl text-zinc-400 font-light mt-4 leading-8">
                            Ready to showcase your product to the world? You came to the right
                            place. Follow the steps below to get started.
                        </p>
                        <div className="mt-10">
                            <h2 className="font-medium">Name of the product</h2>
                            <input
                                type="text"
                                value={name}
                                maxLength={30}
                                className="border border-zinc-500 rounded-md p-2 w-full mt-2 focus:outline-none bg-zinc-700 focus:ring-2 ring-teal-500"
                                onChange={handleNameChange}
                            />
                            <div className="text-sm text-gray-500 mt-1">
                                {name.length} / 30

                            </div>
                        </div>
                        <div className="mt-10">
                            <h2 className="font-medium">
                                Slug (URL) - This will be used to create a unique URL for
                                your product
                            </h2>

                            <input
                                type="text"
                                value={slug}
                                className="border border-zinc-500 rounded-md p-2 w-full mt-2 focus:outline-none bg-zinc-700"
                                readOnly
                            />
                        </div>
                    </motion.div>
                )}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }} // Slide in from the right
                        animate={{ opacity: 1, x: 0 }} // Slide to the center
                        exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
                        transition={{ duration: 0.3 }}

                        className="space-y-10">
                        <h1 className="text-4xl font-semibold">
                            {" "}
                            📊 What category does your product belong to ?{" "}
                        </h1>
                        <p className="text-xl font-light mt-4 leading-8 text-zinc-300">
                            Choose at least 3 categories that best fits your product. This
                            will people discover your product
                        </p>

                        <div className="mt-10">
                            <h2 className="font-medium">Select Categories</h2>
                            <div className="grid grid-cols-4 gap-2 pt-4 items-center justify-center">
                                {categories.map((category, index) => (
                                    <motion.div
                                        key={index}
                                        className={`flex border rounded-full border-teal-600  ${selectedCategories.includes(category)
                                            ? "bg-[#9945FF] text-white border-none font-semibold rounded-full"
                                            : "text-zinc-300"
                                            } `}
                                        onClick={() => handleCategoryToggle(category)}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <div
                                            className={`text-xs md:text-sm p-2 cursor-pointer w-full text-center
                     ${selectedCategories.includes(category)
                                                    ? "bg-[#9945FF] text-white border-none font-semibold rounded-full"
                                                    : "text-zinc-300"
                                                }`}
                                        >
                                            {category}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }} // Slide in from the right
                        animate={{ opacity: 1, x: 0 }} // Slide to the center
                        exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
                        transition={{ duration: 0.3 }}

                        className="space-y-10">
                        <div className="text-4xl font-semibold">📝 Product Details</div>
                        <p className="text-xl font-light mt-4 leading-8">
                            Keep it simple and clear. Describe your product in a way that
                            makes it easy for people to understand what it does.
                        </p>

                        <div className="mt-10">
                            <h2 className="font-medium">Headline</h2>
                            <input
                                type="text"
                                value={headline}
                                className="border border-zinc-500 rounded-md p-2 w-full mt-2 focus:outline-none bg-zinc-700"
                                onChange={handleHeadlineChange}
                            />

                            <div className="text-sm text-gray-500 mt-1">
                                {headline.length} / 80
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="font-medium">Short Description</h2>
                            <textarea
                                className="border border-zinc-500 rounded-md p-2 w-full mt-2 focus:outline-none bg-zinc-700"
                                rows={8}
                                maxLength={400}
                                value={shortDescription}
                                onChange={handleShortDescriptionChange}
                            />

                            <div className="text-sm text-gray-500 mt-1">
                                {shortDescription.length} / 400
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }} // Slide in from the right
                        animate={{ opacity: 1, x: 0 }} // Slide to the center
                        exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
                        transition={{ duration: 0.3 }}

                        className="space-y-10">
                        <h1 className="text-4xl font-semibold">
                            🖼️ Add images to showcase your product
                        </h1>
                        <p className="text-xl font-light mt-4 leading-8">
                            Include images that best represent your product. This will help
                            people understand what your product looks like.
                        </p>

                        <div className="mt-10">
                            <h2 className="font-medium">Logo</h2>
                            {uploadedLogoUrl ? (
                                <div className="mt-2">
                                    <Image
                                        src={uploadedLogoUrl}
                                        alt="logo"
                                        width={1000}
                                        height={1000}
                                        className="rounded-md h-40 w-40 object-cover"
                                    />
                                </div>
                            ) : (
                                <LogoUploader
                                    endpoint="productLogo"
                                    onChange={handleLogoUpload}
                                />
                            )}
                        </div>
                        <div className="mt-4">
                            <div className="font-medium">
                                Product Images ( upload atleast 3 images )
                            </div>

                            {uploadedProductImages.length > 0 ? (
                                <div className="mt-2 md:flex gap-2 space-y-4 md:space-y-0">
                                    {uploadedProductImages.map((url, index) => (
                                        <div key={index} className="relative  md:w-40 h-40 ">
                                            <Image
                                                priority
                                                src={url}
                                                alt="Uploaded Product Image"
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-md"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <ImagesUploader
                                    endpoint="productImages"
                                    onChange={handleProductImagesUpload}
                                />
                            )}

                        </div>
                    </motion.div>
                )}
                {step === 5 && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }} // Slide in from the right
                        animate={{ opacity: 1, x: 0 }} // Slide to the center
                        exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
                        transition={{ duration: 0.3 }}

                        className="space-y-10">
                        <h1 className="text-4xl font-semibold"> 🗓️ Release Date</h1>
                        <p className="text-xl font-light mt-4 leading-8">
                            When will your product be available to the public? Select a date
                            to continue.
                        </p>

                        <div className="mt-10">
                            <div className="font-medium pb-3">Release date</div>
                            <>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"subtle"}
                                            className={cn(
                                                "w-[300px] pl-3 text-left font-normal text-teal-300 border-teal-500",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}

                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(date) => setDate(date)}
                                            initialFocus
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </>
                        </div>
                    </motion.div>
                )}
                {step === 6 && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }} // Slide in from the right
                        animate={{ opacity: 1, x: 0 }} // Slide to the center
                        exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
                        transition={{ duration: 0.3 }}

                        className="space-y-10">
                        <h1 className="text-4xl font-semibold">Additional Links </h1>
                        <p className="text-xl font-light mt-4 leading-8">
                            Add links to your product&apos;s website, social media, and other
                            platforms
                        </p>

                        <div className="mt-10">
                            <div className="font-medium flex items-center gap-x-2">
                                <Globe className="text-2xl text-teal-200 " />
                                <span>Website</span>
                            </div>

                            <input
                                type="text"
                                value={website}
                                className="border border-zinc-500 rounded-md p-2 w-full mt-2 focus:outline-none bg-zinc-700"
                                placeholder="https://www.yourdomain.com"
                                onChange={handleWebsiteChange}
                            />
                        </div>

                        <div className="mt-10">
                            <div className="font-medium flex items-center gap-x-2">
                                <Twitter className="text-2xl text-sky-400" />
                                <div>Twitter</div>
                            </div>

                            <input
                                placeholder="https://www.twitter.com"
                                type="text"
                                className="border border-zinc-500 rounded-md p-2 w-full mt-2 focus:outline-none bg-zinc-700"
                                value={twitter}
                                onChange={handleTwitterChange}
                            />
                        </div>

                        <div className="mt-10">
                            <div className="font-medium flex items-center gap-x-2">
                                <Image
                                    src="/logo/discord-logo.png"
                                    alt=""
                                    className=""
                                    width={30}
                                    height={30}
                                />

                                <div>Discord</div>
                            </div>

                            <input
                                placeholder="https://www.discord.com"
                                type="text"
                                className="border border-zinc-500 rounded-md p-2 w-full mt-2 focus:outline-none bg-zinc-700 "
                                value={discord}
                                onChange={handleDiscordChange}
                            />
                        </div>
                    </motion.div>
                )}
                {step === 7 && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }} // Slide in from the right
                        animate={{ opacity: 1, x: 0 }} // Slide to the center
                        exit={{ opacity: 0, x: "-100%" }} // Slide out to the left
                        transition={{ duration: 0.3 }}


                        className="space-y-10 ">
                        <h1 className="text-4xl font-semibold"> 🔍 Review and submit</h1>
                        <p className="text-xl font-light mt-4 leading-8">
                            Review the details of your product and submit it to the world.
                            Your product will be reviewed by our team before it goes live.
                        </p>

                        <div className="mt-10 grid grid-cols-2 gap-8">
                            <div className="">
                                <div className="font-semibold">Name of the product</div>
                                <div className=" mt-2 text-teal-200 text-lg">{name}</div>
                            </div>

                            <div className="">
                                <div className="font-semibold">Slug ( URL ) </div>
                                <div className=" mt-2 text-teal-200 text-lg">{slug}</div>
                            </div>

                            <div className="">
                                <div className="font-semibold">Category</div>
                                <div className="  mt-2 text-teal-200 text-lg">
                                    {selectedCategories.join(", ")}
                                </div>
                            </div>

                            <div>
                                <div className="font-semibold">Website URL</div>
                                <div className=" mt-2 text-teal-200 text-lg">{website}</div>
                            </div>

                            <div className="">
                                <div className="font-semibold">Headline</div>
                                <div className="  mt-2 text-teal-200 text-lg">{headline}</div>
                            </div>
                            <div className="">
                                <div className="font-semibold">Short description</div>
                                <div className=" mt-2 text-teal-200 text-lg ">{shortDescription}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Twitter</div>
                                <div className=" mt-2 text-teal-200 text-lg">{twitter}</div>
                            </div>

                            <div>
                                <div className="font-semibold">Discord</div>
                                <div className=" mt-2 text-teal-200 text-lg">{discord}</div>
                            </div>

                            <div className="">
                                <div className="font-semibold">
                                    Release date - Pending Approval
                                </div>
                                <div className=" mt-2 text-teal-200 text-lg">
                                    {date ? date.toDateString() : "Not specified"}
                                </div>
                            </div>

                            <div className="cols-span-2">
                                <div className="font-semibold">Product Images</div>
                                <div className="mt-2 md:flex gap-2 w-full">
                                    {uploadedProductImages.map((url, index) => (
                                        <div key={index} className="relative w-28 h-28">
                                            <Image
                                                priority
                                                src={url}
                                                alt="Uploaded Product Image"
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-md"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
                {step === 8 && (
                    <div className="space-y-10">
                        <div className="text-4xl font-semibold"> Congratulations 🎉 </div>
                        <div className="text-xl font-light mt-4 leading-8 ">
                            Your product has been successfully submitted. Our team will review
                            it and get back to you soon.
                        </div>

                        <div className="flex flex-col  gap-4">
                            <div
                                onClick={handleGoToProducts}
                                className="bg-[#ff6154] text-white py-2 px-4
                 rounded mt-4 flex w-60 justify-center items-center cursor-pointer"
                            >
                                Go to your products
                            </div>

                            <Separator />

                            <div
                                onClick={submitAnotherProduct}
                                className="text-teal-600 py-2 px-4 rounded mt-4
                flex w-fit justify-center items-center cursor-pointer text-lg"
                            >
                                Submit another product
                            </div>
                        </div>
                    </div>
                )}

                {step !== 8 && (
                    <>
                        <div className="flex justify-between items-center mt-10">
                            {step !== 1 && (
                                <button
                                    onClick={prevStep}

                                    className="text-gray-600">
                                    Previous
                                </button>
                            )}

                            <div className="flex items-center">
                                {step === 7 ? (
                                    <StatefulButton
                                        onClickAsync={submitProduct}
                                        statusLoading='Creating Product..'
                                        statusSuccess='Product Created'
                                        className="p-6 text-sm font-medium  text-white transition-colors duration-300 border border-slate-500 bg-[#9945FF] w-fit"
                                    >
                                        Submit Product
                                    </StatefulButton>
                                ) : (
                                    <button
                                        onClick={nextStep}
                                        className="bg-teal-600 text-white py-2 px-4 rounded-xl mt-4 items-end"
                                    >
                                        {step === 7 ? "Submit" : "Continue"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}

            </div>

        </div>
    )
}


export default NewProductPage

