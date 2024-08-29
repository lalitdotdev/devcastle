"use client"

import * as React from "react"

import { TweetGrid } from "./ui/TweetGridSection"

// Grab tweet ids
const exampleTweets = [
    "1742983975340327184",
    "1743049700583116812",
    "1754067409366073443",
    "1753968111059861648",
    "1754174981897118136",
    "1743632296802988387",
    "1754110885168021921",
    "1760248682828419497",
    "1760230134601122153",
    "1760184980356088267",
]

export function TweetGridDemo({ }) {
    return (
        <div className="md:max-w-6xl py-20 items-center justify-center w-full md:mx-auto md:pl-20 ">
            <div className="flex w-full justify-center pb-12">
                <div className="text-center text-6xl font-bold gradient-text animate-gradient">
                    Join the club
                </div>
                <span className="text-6xl">
                    🥳
                </span>
            </div>
            <div className="flex items-center justify-center w-full">
                <TweetGrid
                    className="w-90 md:w-full"
                    tweets={exampleTweets}
                    columns={3}
                    spacing="lg"
                />
            </div>
        </div>
    )
}
