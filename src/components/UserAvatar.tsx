import { Avatar, AvatarFallback } from "./ui/Avatar";

import { AvatarProps } from "@radix-ui/react-avatar";
import { FC } from "react";
import Image from "next/image";
import { User } from "next-auth";
import UserAvatarFallback from "./Avatars/UserAvatarFallback";

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
    return (
        <Avatar {...props}>
            {user.image ? (
                <div className="relative aspect-square h-full w-full">
                    <AvatarFallback>
                        <span className="sr-only">{user.name}</span>
                        <UserAvatarFallback seed={user.name ?? 'fallback'} classNames="rounded-full" />
                    </AvatarFallback>

                </div>
            ) : (
                <Image
                    fill
                    src={user?.image ?? '/images/avatars/default.png'}
                    alt="profile picture"
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                />
            )
            }
        </Avatar >
    );
};

export default UserAvatar;
