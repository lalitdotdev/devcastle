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
                    <Image
                        fill
                        src={user.image}
                        alt="profile picture"
                        referrerPolicy="no-referrer"
                        className="rounded-full"
                    />
                </div>
            ) : (
                <AvatarFallback>
                    <span className="sr-only">{user.name}</span>
                    <UserAvatarFallback seed={user.name ?? 'fallback'} classNames="rounded-full" />
                </AvatarFallback>
            )
            }
        </Avatar >
    );
};

export default UserAvatar;
