import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Image from "next/image";
import Link from "next/link";
import { getProductsByCategoryName } from "@/lib/launchpad-server-actions/server-actions";

interface IParams {
    category: string;
}

const CategoryPage = async ({ params }: { params: IParams }) => {
    // ----------------------- capitalized category ------------------
    const capitalizedCategory =
        params.category.charAt(0).toUpperCase() + params.category.slice(1);

    const products = await getProductsByCategoryName(capitalizedCategory);

    return (
        <div className="md:w-3/5 mx-auto pt-10 px-6 md:px-0">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/launchpad/categories">Categories</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-emerald-300">{capitalizedCategory}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-4xl font-semibold pt-10">{capitalizedCategory}</h1>
            <p className="text-gray-500 pt-2">
                Check out whats&apos;s going on in the {capitalizedCategory}! Discover
                new products
            </p>

            <div className="pt-10 space-y-4">
                {products.map((product: any) => (
                    <Link
                        href={`/launchpad/product/${product.slug}`}
                        key={product.id}
                        className="flex gap-x-4 items-center p-2 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors duration-200 bg-gray-800 "
                    >
                        <Image
                            src={product.logo}
                            alt="logo"
                            width={1000}
                            height={1000}
                            className="w-16 h-16 md:w-20 md:h-20 rounded-md cursor-pointer"
                        />
                        <div>
                            <h2 className="font-semibold text-lg">{product.name}</h2>
                            <p className="text-gray-500 text-sm md:py-2">{product.headline}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;
