import Clipboard from '@/lib/clipboard';
import Link from 'next/link';

export const metadata = {
    metadataBase: new URL('https://devcastle.vercel.app'),
    alternates: {
        canonical: '/about',
        languages: {
            'en-US': '/en-US',
        },
    },
    title: 'Devcastle — About',
    description: 'Learn more about Devcastle and the rationale behind its creation.',
    robots: {
        index: true,
        follow: true,
        nocache: true,
    },
};

export default function About() {

    return (
        <>
            <div className="py-12 flex-col flex lg:grid lg:grid-cols-12 px-8 overflow-hidden">
                <div className="text-5xl md:text-7xl col-span-4 font-bold">
                    <h1 className="mb-8 lg:pl-8 text-color-accentBlue">
                        About <span className="text-light-gray">Devcastle</span>
                    </h1>
                </div>
                <div className=" col-start-6 col-span-5 max-w-xl lg:max-w-none text-sm  md:text-2xl  leading-[130%] text-light-gray font-sm space-y-7 tracking-wide leading-5">
                    <p className="space-y-8 flex flex-col">
                        <span>
                            <strong>DevCastle</strong> is a platform by the developers and for the developers to connect talents with opportunities. We are a community of developers, designers, and creators who are passionate about building and creating things.
                        </span>

                        {/* write one liner also */}
                        <span className="">
                            Cultivating Connections for Coders Designers and Creators.
                        </span>
                    </p>
                    <div className="flex items-center gap-x-3">
                        {/* <div className="w-10 h-10 rounded-full overflow-hidden">
                            <Image
                                src={avatar}
                                width={40}
                                height={40}
                                alt="Lalit Sharma"
                                className="rounded-full object-center object-cover"
                                layout="responsive"
                            />
                        </div> */}
                        <div className="text-primary text-base xl:text-h6 2xl:text-h5 font-medium flex flex-col">
                            <p className="  text-color-5 font-semibold ">Lalit Sharma</p>
                            <Clipboard />
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="mt-8 font-light text-sm md:text-2xl self-start mx-5 xs:mx-10 sm:mx-12 md:mx-16 lg:mx-20 text-n-14 dark:text-light dark:font-normal ">
                Have a project in mind? Reach out to me 📞 from{' '}
                <Link href="https://litsharmadev.tech/" rel="noopener noreferrer" target="_blank" className="!underline underline-offset-2" >
                    here
                </Link>{' '}
                and let&apos;s make it happen.
            </h2>
        </>
    );
}
