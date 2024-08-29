import Image from 'next/image'
import React from 'react'
import { createAvatar } from '@dicebear/core'
import { notionists } from '@dicebear/collection'

const UserAvatarFallback = ({ seed, classNames }: { seed: string, classNames?: string }) => {
    try {

        const avatar = createAvatar(notionists, {
            seed: seed.toString(),
            // .. other options
        });
        if (!avatar) {
            return null;
        }
        const svg = avatar.toString();
        const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
        return (
            <Image
                className={classNames}
                src={dataUrl}
                alt="Avatar"
                width={40}
                height={40}
            />
        );
    } catch (error) {
        return null;
    }
}

export default UserAvatarFallback
