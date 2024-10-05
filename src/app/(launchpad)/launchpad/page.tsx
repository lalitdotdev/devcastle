import ActiveProducts from "@/components/launchpad/active-products";
import { getActiveProducts } from "@/lib/launchpad-server-actions/server-actions";

const LauchPadPage = async () => {

    const activeProducts = await getActiveProducts();

    console.log(activeProducts, 'active products here')


    return (
        <>
            <div className="md:w-4/5 mx-auto py-10 px-6">
                {/* @ts-expect-error Server Component */}
                <ActiveProducts
                    activeProducts={activeProducts}

                />
            </div>
        </>
    );
}


export default LauchPadPage
