import React, { useEffect, useRef, useState } from 'react'

import Image from 'next/image';
import { SearchIcon } from 'lucide-react'
import { searchProducts } from '@/lib/launchpad-server-actions/server-actions';
import { useRouter } from 'next/navigation';

type Props = {}

interface Product {
    id: string;
    name: string;
    slug: string;
    headline: string;
    description: string;
    logo: string;
    releaseDate: string;
    website: string;
    twitter: string;
    discord: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    status: string;
}
const Search = (props: Props) => {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setQuery(inputValue);
        if (inputValue.trim() !== "") {
            const products: Product[] = await searchProducts(inputValue);
            //filter out the only active products
            const activeProducts = products.filter(
                (product) => product.status === "ACTIVE"
            );
            setSearchResults(activeProducts);
            setIsDropdownVisible(true);
        } else {
            setSearchResults([]);
            setIsDropdownVisible(false);
        }
    };

    const handleItemClick = (slug: string, productName: string) => {
        setQuery(productName);
        setIsDropdownVisible(false);
        router.push(`/launchpad/product/${slug}`);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target as Node)
            ) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div
            className="
        ease relative flex h-10 w-full items-center rounded-[30px] bg-zinc-700 pl-3 pr-3 duration-500 before:absolute before:bottom-0 before:left-0 before:h-[3px] before:w-full before:origin-center before:scale-x-0 before:rounded-[1px] before:bg-orange-100 before:transition-all before:duration-500 before:content-[''] focus-within:rounded-[1px] focus-within:before:scale-100 dark:bg-gray-800 dark:before:bg-teal-500 z-[999]"
        >
            <SearchIcon className='text-zinc-500 mr-2' />
            <input
                type="text"
                placeholder="Search..."
                className="h-full w-full bg-transparent text-[0.9rem]  focus:outline-none text-white [&:not(:placeholder-shown)~button]:visible [&:not(:placeholder-shown)~button]:opacity-100"
                value={query}
                onChange={handleSearch}
                ref={searchInputRef}
            />

            {isDropdownVisible && searchResults.length > 0 && (
                <ul className="absolute top-full bg-gray-100 rounded-md border mt-2 w-full text-black">
                    {searchResults.map((product) => (
                        <li
                            key={product.id}
                            className="p-2
            cursor-pointer text-sm
            flex items-center gap-x-2  hover:bg-gradient-to-bl
    from-[#ffe6d3]
    via-[#fdfdfd]
    to-white"
                            onClick={() => handleItemClick(product.slug, product.name)}
                        >
                            <Image
                                src={product.logo}
                                alt="logo"
                                width={50}
                                height={50}
                                className="rounded-md h-8 w-8"
                            />
                            {product.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Search
