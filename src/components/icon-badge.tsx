import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

import { LucideIcon } from 'lucide-react'


const backgroundVariant = cva("rounded-full flex items-center justify-center", {
    variants: {
        variant: {
            default: "bg-purple-100",
            success: "bg-emerald-100"
        },
        size: {
            default: "p-2",
            sm: "p-1"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
})


const iconVariants = cva("", {
    variants: {
        variant: {
            default: "text-purple-700",
            success: "text-emerald-700"
        },
        size: {
            default: "h-8 w-8",
            sm: "h-4 w-4"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }


})

type BackgroundVariantProps = VariantProps<typeof backgroundVariant>
type IconVariantProps = VariantProps<typeof iconVariants>

interface IconBadgeProps extends BackgroundVariantProps, IconVariantProps {
    icon: LucideIcon
}



const IconBadge = ({ icon: Icon, variant, size }: IconBadgeProps) => {
    return (
        <div className={cn(backgroundVariant({ variant, size }))}>
            <Icon className={cn(iconVariants({ variant, size }))} />
        </div>
    )
}

export default IconBadge
