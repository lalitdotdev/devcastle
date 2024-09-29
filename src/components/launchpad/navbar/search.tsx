import React from 'react'
import { SearchIcon } from 'lucide-react'

type Props = {}

const Search = (props: Props) => {
    return (
        <div
            className="
        ease relative flex h-10 w-full items-center rounded-[30px] bg-zinc-700 pl-3 pr-3 duration-500 before:absolute before:bottom-0 before:left-0 before:h-[3px] before:w-full before:origin-center before:scale-x-0 before:rounded-[1px] before:bg-teal-600 before:transition-all before:duration-500 before:content-[''] focus-within:rounded-[1px] focus-within:before:scale-100 dark:bg-gray-800 dark:before:bg-teal-500 z-[999]"
        >
            <SearchIcon className='text-zinc-500' />
            <input
                type="text"
                placeholder="Search..."
                className="h-full w-full bg-transparent text-[0.9rem] text-black focus:outline-none dark:text-white [&:not(:placeholder-shown)~button]:visible [&:not(:placeholder-shown)~button]:opacity-100"
            // value={query}
            // onChange={handleSearch}
            // ref={searchInputRef}
            />
        </div>
    )
}

export default Search
