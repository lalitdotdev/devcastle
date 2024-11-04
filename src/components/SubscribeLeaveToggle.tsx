'use client';

import { FC, startTransition } from 'react';
import axios, { AxiosError } from 'axios';

import { Button } from './ui/Button';
import { SubscribeCommunityPayload } from '../lib/validators/community';
import { toast } from 'sonner';
import { useCustomToast } from '@/hooks/use-custom-toast';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface SubscribeLeaveToggleProps {
    isSubscribed: boolean;
    communityId: string;
    communityName: string;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
    isSubscribed,
    communityId,
    communityName,
}) => {
    //   const isSubscribed = false;

    const { loginToast } = useCustomToast();
    const router = useRouter();

    //   react query using useMutation hook
    const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeCommunityPayload = {
                communityId,
            };

            const { data } = await axios.post('/api/community/subscribe', payload);
            return data as string;
        },

        onError: err => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast();
                }
            }

            return toast.error('There was a problem ', {
                description: 'Could not subscribe to community, please try again.',

            });
        },

        //* onSuccess just refresh the page without loosing any state

        onSuccess: () => {
            startTransition(() => {
                router.refresh();
            });
            return toast.success('Subscribed', {
                description: `You are now subscribed to cb/${communityName}`,
            });
        },
    });

    const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeCommunityPayload = {
                communityId,
            };

            const { data } = await axios.post('/api/community/unsubscribe', payload);
            return data as string;
        },

        onError: err => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast();
                }
            }

            return toast.error('There was a problem ', {
                description: 'Could not unsubscribe from community, please try again.',

            });
        },

        //* onSuccess just refresh the page without loosing any state

        onSuccess: () => {
            startTransition(() => {
                router.refresh();
            });
            return toast.success('Unsubscribed', {
                description: `You are now unsubscribed from cb/${communityName}`,
            });
        },
    });

    return isSubscribed ? (
        <Button
            isLoading={isUnsubLoading}
            className="w-full  text-gray-400 bg-[#79bdd8]px-4 py-2 rounded-md mb-4 mt-1"
            onClick={() => unsubscribe()}
        >
            Leave community
        </Button>
    ) : (
        <Button
            isLoading={isSubLoading}
            onClick={() => subscribe()}
            className="w-full  text-white px-4 py-2 rounded-md mb-4 mt-1"
        >
            Join to post
        </Button>
    );
};

export default SubscribeLeaveToggle;
