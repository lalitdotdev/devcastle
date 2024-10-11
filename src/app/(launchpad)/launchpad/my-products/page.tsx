import { Crown, Zap } from "lucide-react";
import { getOwnerProducts, isUserPremium } from "@/lib/launchpad-server-actions/server-actions";

import Image from "next/image";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { useCustomToast } from "@/hooks/use-custom-toast";

const MyProducts = async () => {
    const session = await getAuthSession();
    const { loginToast } = useCustomToast()

    if (!session) {
        return loginToast()
    }

    const products = await getOwnerProducts();
    const isPremium = await isUserPremium();

    return (
        <div className="min-h-screen  text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                {products.length === 0 ? (
                    <div className="bg-emerald-200 rounded-md w-full p-10 ">
                        <h1 className="text-5xl font-extrabold mb-4 text-gray-900">
                            Your Product Canvas Awaits!
                        </h1>
                        <p className="text-muted-foreground  max-w-2xl mx-auto mb-4">
                            Unleash your creativity and bring your ideas to life. Start by creating your first amazing product!
                        </p>
                        <Link href="/launchpad/new-product" className="inline-block group">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-1 rounded-2xl">
                                <div className="bg-gray-900 hover:bg-opacity-80 transition-all duration-300 rounded-xl px-8 py-4 flex items-center space-x-3">
                                    <Zap className="text-yellow-400 group-hover:animate-bounce" />
                                    <span className="text-lg font-semibold">Create Your First Product</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="bg-emerald-200 rounded-md w-full p-10 ">
                            <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-black ">
                                Your Product Galaxy 🖼️
                            </h1>
                            <p className="text-xl text-gray-600">
                                Explore and manage your stellar creations
                            </p>
                        </div>

                        {isPremium ? (
                            <div className="flex items-center justify-center mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-xl shadow-lg animate-glow">
                                <Crown className="text-4xl text-white mr-4" />
                                <p className="text-xl font-bold text-white">Premium Creator Status: Unlocked</p>
                            </div>
                        ) : (
                            <div className="text-center bg-gray-800 py-4 rounded-lg ">
                                <p className="text-xl text-gray-300">
                                    {products.length} / 2 Free Products Created
                                </p>
                                <p className="text-sm text-gray-400 mt-2">
                                    Upgrade to Premium for unlimited creations!
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product, index) => (
                                <Link href={`/launches/edit/${product.id}`} key={product.id}>
                                    <div
                                        className="group bg-gray-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-102"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="relative h-48 overflow-hidden">

                                            <Image
                                                src={product.logo}
                                                alt={product.name}
                                                layout="fill"
                                                objectFit="cover"
                                                className="transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-bold text-xl mb-2   text-emerald-200 transition-all duration-300">
                                                {product.name}
                                            </h3>
                                            <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                Click to edit and manage
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default MyProducts;
