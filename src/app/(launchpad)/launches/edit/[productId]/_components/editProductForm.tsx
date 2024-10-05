"use client";

import { CheckCircle, Flag, Pencil, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import Image from "next/image";
import { ImagesUploader } from "@/components/launchpad/uploaders/images-uploader";
import { LogoUploader } from "@/components/launchpad/uploaders/logo-uploader";
import { toast } from "sonner";
import { updateProduct } from "@/lib/launchpad-server-actions/server-actions";
import { useRouter } from "next/navigation";

interface EditProductFormProps {
    product: any;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product }) => {
    const [isEditingLogo, setIsEditingLogo] = useState(false);
    const [uploadedLogoUrl, setUploadedLogoUrl] = useState("");
    const [isEditingProductImages, setIsEditingProductImages] = useState(false);
    const [uploadedProductImages, setUploadedProductImages] = useState<string[]>(
        []
    );

    const router = useRouter();

    const [name, setName] = useState(product.name);
    const [headline, setHeadline] = useState(product.headline);
    const [description, setDescription] = useState(product.description);
    const [releaseDate, setReleaseDate] = useState(product.releaseDate);
    const [website, setWebsite] = useState(product.website);
    const [twitter, setTwitter] = useState(product.twitter);
    const [discord, setDiscord] = useState(product.discord);
    const [categories, setCategories] = useState(product.categories);
    const [slug, setSlug] = useState(product.slug);

    const handleLogoUpload = (url?: string) => {
        if (url) {
            setUploadedLogoUrl(url);
            setIsEditingLogo(false);
        } else {
            setIsEditingLogo(true);
        }
    };

    const handleProductImagesUpload = (urls: string[]) => {
        setUploadedProductImages(urls);
        setIsEditingProductImages(false);
    };

    const handleNameChange = (e: any) => {
        const productName = e.target.value;
        const truncatedName = productName.slice(0, 30);
        setName(truncatedName);
    };

    // update slug when name changes and limit name to 30 characters for slug
    useEffect(() => {
        // Update slug when name changes
        const truncatedName = name.slice(0, 30);
        const slugValue = truncatedName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/\./g, "-");
        setSlug(slugValue);
    }, [name]); // Trigger effect when name changes

    const onSave = async () => {
        try {
            await updateProduct(product.id, {
                name,
                headline,
                description,
                releaseDate,
                website,
                slug,
                twitter,
                discord,
                categories: categories,
                logo: uploadedLogoUrl || product.logo,
                images:
                    uploadedProductImages.length > 0
                        ? uploadedProductImages
                        : product.images.map((image: any) => image.url),
            });
            toast(
                <>
                    <div className="flex items-center gap-4  mx-auto">
                        <CheckCircle className="text-emerald-500 text-3xl" />
                        <div className="text-md font-semibold">
                            Product updated successfully.
                        </div>
                    </div>
                </>,
                { position: "top-center" }
            );
            router.refresh();
        } catch (error: any) {
            toast(
                <>
                    <div className="flex items-center gap-4  mx-auto">
                        <XCircle className="text-red-500 text-3xl" />
                        <div className="text-md font-semibold">
                            There was an error updating the product
                            {error.message}
                        </div>
                    </div>
                </>,
                { position: "top-center" }
            );
        }
    };

    return (
        <div className="h-full ">
            <div className="flex items-center gap-4 mx-auto">
                <Pencil className="text-3xl text-emerald-500" />
                <h1 className="text-3xl font-bold">Edit Product</h1>
            </div>

            <div className="w-full rounded-md p-10 bg-gray-700 text-emerald-50 mt-10 md:flex items-center gap-x-4">
                <Flag className="text-5xl text-emerald-500 mb-4 md:mb-0" size={40} />
                <div className="">
                    This is the product form. You can update the product details here. If
                    your product is currently live, and you make changes to the product
                    details. It will delist the product from the marketplace until it is
                    reviewed and approved by the admin.
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                <div>
                    <h1 className="font-medium">Logo</h1>
                    {isEditingLogo ? (
                        <div>
                            <LogoUploader
                                endpoint="productLogo"
                                onChange={handleLogoUpload}
                            />
                            <button
                                onClick={() => setIsEditingLogo(false)}
                                className="mt-2 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <Image
                                src={uploadedLogoUrl || product.logo}
                                alt="logo"
                                width={200}
                                height={200}
                                className="w-28 md:w-60 border border-zinc-600 rounded-md cursor-pointer"
                            />
                            <button
                                onClick={() => setIsEditingLogo(true)}
                                className="text-sm text-blue-500 cursor-pointer hover:underline mt-2"
                            >
                                Change Logo
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <h1 className="font-medium">Product Name</h1>
                    <input
                        type="text"
                        className="w-full p-4 border-2 border-zinc-600 rounded-xl focus:outline-none mt-6 bg-gray-700"
                        value={name}
                        onChange={handleNameChange}
                    />
                </div>

                <div>
                    <div className="font-medium">Website</div>
                    <input
                        type="text"
                        className="w-full p-4 border-2 border-zinc-600 rounded-xl focus:outline-none mt-6 bg-gray-700"
                        value={website} // Bind value to state variable
                        onChange={(e) => setWebsite(e.target.value)} // Update state variable on change
                    />
                </div>

                <div>
                    <div className="font-medium">Release Date</div>
                    <input
                        type="text"
                        className="w-full p-4 border-2 border-zinc-600 rounded-xl focus:outline-none mt-6 bg-gray-700"
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                    />
                </div>

                <div>
                    <div className="font-medium">Headline</div>
                    <textarea
                        className="w-full p-4 border-2 border-zinc-600 rounded-xl focus:outline-none mt-6 bg-gray-700"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                    />
                </div>

                <div>
                    <div className="font-medium">Short Description</div>
                    <textarea
                        className="w-full p-4 border-2 border-zinc-600 rounded-xl focus:outline-none mt-6 bg-gray-700"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div>
                    <div className="font-medium">Twitter</div>
                    <input
                        type="text"
                        className="w-full p-4 border-2 border-zinc-600 rounded-xl focus:outline-none mt-6 bg-gray-700"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                    />
                </div>

                <div>
                    <div className="font-medium">Discord</div>
                    <input
                        type="text"
                        className="w-full p-4 border-2 border-zinc-600 rounded-xl focus:outline-none mt-6 bg-gray-700"
                        value={discord}
                        onChange={(e) => setDiscord(e.target.value)}
                    />
                </div>

                <div className="col-span-2">
                    <h1 className="font-medium">Categories</h1>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {product.categories.map((category: any) => (
                            <div key={category.id}>
                                <div
                                    className="bg-blue-600 p-2
                text-center text-sm rounded-full"
                                >
                                    {category.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-2">
                    <div className="font-medium mb-2">Product Images</div>
                    {isEditingProductImages ? null : (
                        <div className="grid grid-cols-5 gap-4">
                            {uploadedProductImages.length > 0 &&
                                uploadedProductImages.map((url: string) => (
                                    <div key={url}>
                                        <Image
                                            priority
                                            src={url}
                                            alt={product.name}
                                            width={200}
                                            height={200}
                                            className=" border-gray-200 rounded-md hover:cursor-pointer"
                                        />
                                    </div>
                                ))}
                            {/* Display uploaded images if available, else render product images */}
                            {uploadedProductImages.length === 0 &&
                                product.images &&
                                product.images.map((image: any) => (
                                    <div key={image.id}>
                                        <Image
                                            priority
                                            src={image.url}
                                            alt={product.name}
                                            width={200}
                                            height={200}
                                            className="w-40 border-gray-200 rounded-md hover:cursor-pointer"
                                        />
                                    </div>
                                ))}
                        </div>
                    )}

                    {isEditingProductImages ? (
                        <div>
                            <ImagesUploader
                                endpoint="productImages"
                                onChange={handleProductImagesUpload}
                            />
                            <button
                                className="mt-2 cursor-pointer"
                                onClick={() => setIsEditingProductImages(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditingProductImages(true)}
                            className="text-sm text-blue-500 my-2 cursor-pointer hover:underline"
                        >
                            Click to upload images
                        </button>
                    )}
                </div>
            </div>

            <div className="flex justify-end py-10">
                <button
                    onClick={onSave}
                    className="bg-emerald-500 text-white
        p-4 rounded-md w-40 text-center cursor-pointer"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default EditProductForm;
