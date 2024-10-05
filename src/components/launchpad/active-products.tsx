import { Pin } from "lucide-react";
import ProductItem from "./product-item";
import { getAuthSession } from "@/lib/auth";

interface ActiveProductsProps {
    activeProducts: any;
}

const ActiveProducts = async ({
    activeProducts,
}: ActiveProductsProps) => {
    const authenticatedUser = await getAuthSession();

    console.log(authenticatedUser)
    console.log(activeProducts, 'activeProducts')


    const formattedActiveProducts = activeProducts?.map((product: any) => {
        const {
            id,
            name,
            slug,
            headline,
            description,
            logo,
            releaseDate,
            website,
            twitter,
            discord,
            createdAt,
            updatedAt,
            userId,
            status,
            images,
            categories,
            comments,
            upvotes
        } = product;



        const imageUrls = images.map((image: any) => image.url); // Get the URLs of the images from the images array
        const categoryNames = categories.map((category: any) => category.name); // Get the names of the categories from the categories array
        const commentsCount = comments ? comments.length : 0; // Get the number of comments for the product

        const commentText = comments ? comments.map((comment: any) => ({
            id: comment.id,
            profile: comment.profilePicture,
            body: comment.body,
            user: comment.user.name,
            timestamp: comment.createdAt,
            userId: comment.user.id,
            name: comment.user.name.toLowerCase().replace(/\s/g, '_'),

        })) : [];


        const upvotesCount = upvotes ? upvotes.length : 0;
        const upvotesData = upvotes.map((upvote: any) => upvote.user.id)

        return {
            id,
            name,
            slug,
            headline,
            description,
            logo,
            releaseDate,
            website,
            twitter,
            discord,
            createdAt,
            updatedAt,
            userId,
            status,
            images: imageUrls,
            categories: categoryNames,
            commentsLength: commentsCount,
            commentData: commentText,
            upvoters: upvotesData,
            upvotes: upvotesCount,
        };
    });

    console.log(formattedActiveProducts, 'formattedActiveProducts')


    return (
        <div className="w-full">
            <div className="w-full rounded-md p-8 bg-emerald-200   mt-10 md:flex items-center gap-x-4 sm:mb-8">
                <Pin className="text-5xl text-green-600 mb-4 md:mb-0" size={40} />
                <div className="">
                    <h1 className="text-2xl font-medium text-gray-800">
                        Welcome to the LaunchPad 🚀
                    </h1>
                    <p className="text-gray-700 text-sm">
                        Place where you find products that people are building in tech ecosystem.
                    </p>


                </div>
            </div>
            <div className="flex items-center border-b border-gray-800 pb-3">
                <h1 className="text-2xl font-medium">All Products</h1>
            </div>

            <div className="space-y-3 py-6 flex flex-col">
                {formattedActiveProducts?.map((product: any) => (
                    <ProductItem
                        key={product.id}
                        product={product}
                        authenticatedUser={authenticatedUser}
                    />
                ))}

            </div>
        </div>
    );
};

export default ActiveProducts;
