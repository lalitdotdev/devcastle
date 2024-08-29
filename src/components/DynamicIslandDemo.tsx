"use client"

import {
    ArrowUpLeftSquareIcon,
    Loader,
    Mail,
    MessageCircle,
    MousePointerClickIcon,
    User,
    Waves,
} from "lucide-react"
import {
    DynamicContainer,
    DynamicDescription,
    DynamicDiv,
    DynamicIsland,
    DynamicIslandProvider,
    DynamicTitle,
    SizePresets,
    useDynamicIslandSize,
    useScheduledAnimations,
} from "@/components/ui/DynamicActionIsland"
import { createContext, useContext } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "./ui/Button"
import { useRouter } from "next/navigation"

const DynamicAction = () => {
    const { state: blobState, setSize } = useDynamicIslandSize()
    const router = useRouter()
    const blobStates: SizePresets[] = [
        "compact",
        "large",
        "tall",
        "long",
        "medium",
    ]

    const cycleBlobStates = () => {
        const currentIndex = blobStates.indexOf(blobState.size)
        const nextIndex = (currentIndex + 1) % blobStates.length
        setSize(blobStates[nextIndex])
    }

    useScheduledAnimations([
        { size: "compact", delay: 1000 },
        { size: "large", delay: 1200 },
        { size: "tall", delay: 1600 },
        { size: "long", delay: 1800 },
        { size: "medium", delay: 2200 },
    ])

    // Provide dynamic detail in such a beautiful small place :)
    const renderCompactState = () => (
        <DynamicContainer className="flex items-center justify-center h-full w-full">
            <div className="relative w-full flex items-center">
                <DynamicDescription className="absolute left-4  my-auto text-lg font-medium tracking-tighter text-white ">
                    <MessageCircle className=" h-3 w-3 fill-cyan-400 text-cyan-400" />
                </DynamicDescription>

                <DynamicDescription className="absolute text-indigo-600 right-4  my-auto text-lg font-bold tracking-tighter ">
                    devcastle.co
                </DynamicDescription>
            </div>
        </DynamicContainer>
    )

    // Great for call to action, popping up in users face :)
    const renderLargeState = () => (
        <DynamicContainer className="flex items-center justify-center h-full w-full">
            <div className="relative  flex w-full items-center justify-between gap-6 px-4">
                <Loader className="animate-spin h-6 w-6  text-yellow-300" />

                <DynamicTitle className="my-auto text-2xl font-black tracking-tighter text-white ">
                    Building dev communities..
                </DynamicTitle>
            </div>
        </DynamicContainer>
    )

    // Great for user onboarding, forms, etc
    const renderTallState = () => (
        <DynamicContainer className="  flex flex-col mt-6 w-full items-start  gap-1 px-8 font-semibold">
            <DynamicDescription className="bg-gray-600 rounded-2xl tracking-tight leading-5 text-white  p-2">
                DevCastle Community 🥳
            </DynamicDescription>
            <DynamicDescription className="bg-gray-600 text-white rounded-2xl tracking-tight leading-5  p-2 text-left">
                Connect, collaborate, and learn with like-minded developers, designers and makers.
            </DynamicDescription>

            <DynamicTitle className=" text-3xl font-black tracking-tighter text-cyan-100 ">
                any cool dev communities?
            </DynamicTitle>
        </DynamicContainer>
    )

    const renderLongState = () => (
        <DynamicContainer className="flex items-center justify-center h-full w-full">
            <DynamicDiv className="relative  flex w-full items-center justify-between gap-6 px-4">
                <div>
                    <Waves className=" text-cyan-400 h-6 w-6" />
                </div>

                <DynamicTitle className="my-auto text-xl font-black tracking-tighter text-white ">
                    Empowering Developers
                </DynamicTitle>
            </DynamicDiv>
        </DynamicContainer>
    )

    const renderMediumState = () => (
        <DynamicContainer className="flex flex-col justify-between px-2 pt-4 text-left text-white h-full  rounded-2xl ">
            <DynamicTitle className="text-2xl pl-3 font-black tracking-tighter ">
                Join the DevCastle

            </DynamicTitle>
            <DynamicDescription className="leading-5 text-neutral-500 pl-3">
                A step towards building a vibrant developer community.
            </DynamicDescription>

            <DynamicDiv className="flex flex-col mt-auto space-y-1 mb-2 bg-indigo-500 p-2 rounded-b-2xl">
                <Button variant={"link"} className="mt-1 " onClick={() => router.push("/sign-in")}>
                    <Mail className="mr-2 h-4 w-4 fill-cyan-400 text-neutral-900" /> Sign in
                </Button>

                <Button className="mt-1 text-white">
                    <User className="mr-2 h-4 w-4 fill-cyan-400 text-cyan-400" /> Join the
                    community now
                </Button>
            </DynamicDiv>
        </DynamicContainer>
    )

    // Render function for other states
    const renderOtherStates = () => (
        <div className="flex items-center justify-center h-full w-full ">
            <div>
                <ArrowUpLeftSquareIcon className="text-white" />
            </div>
            <p className="text-white">
                Actively building 🏗
            </p>
        </div>
    )

    // Main render logic based on size
    function renderState() {
        switch (blobState.size) {
            case "compact":
                return renderCompactState()
            case "large":
                return renderLargeState()
            case "tall":
                return renderTallState()
            case "medium":
                return renderMediumState()
            case "long":
                return renderLongState()
            // Optionally add cases for other states as necessary
            default:
                return renderOtherStates()
        }
    }

    return (
        <div className=" h-full">
            <div className="flex flex-col gap-4  h-full">
                <div className="absolute top-4 right-2">
                    {/* {!blobState.isAnimating ? ( */}
                    <Button
                        onClick={cycleBlobStates}
                        variant="default"
                        disabled={blobState.isAnimating}
                        className="mt-4 p-2  rounded-lg max-w-[200px] "
                    >
                        Click
                        <MousePointerClickIcon className="ml-2 h-4 w-4" />
                    </Button>
                    {/* ) : null} */}
                </div>
                <div className="absolute top-1 right-2">
                    <div>
                        <Badge variant="outline">prev - {blobState.previousSize}</Badge>
                        <Badge variant="outline">cur -{blobState.size}</Badge>
                    </div>
                </div>

                <DynamicIsland id="dynamic-blob">{renderState()}</DynamicIsland>
            </div>
        </div>
    )
}

export function DynamicIslandDemo() {
    return (
        <DynamicIslandProvider initialSize={"default"}>
            <div>
                <DynamicAction />
            </div>
        </DynamicIslandProvider>
    )
}

const FadeInStaggerContext = createContext(false)

const viewport = { once: true, margin: "0px 0px -200px" }

export function FadeIn(props: any) {
    let shouldReduceMotion = useReducedMotion()
    let isInStaggerGroup = useContext(FadeInStaggerContext)

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
            {...(isInStaggerGroup
                ? {}
                : {
                    initial: "hidden",
                    whileInView: "visible",
                    viewport,
                })}
            {...props}
        />
    )
}

export function FadeInStagger({ faster = false, ...props }) {
    return (
        <FadeInStaggerContext.Provider value={true}>
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                transition={{ staggerChildren: faster ? 0.12 : 0.2 }}
                {...props}
            />
        </FadeInStaggerContext.Provider>
    )
}
