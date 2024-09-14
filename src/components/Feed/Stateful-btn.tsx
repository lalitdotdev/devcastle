import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle, XCircle } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/Button';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

type StatefulButtonProps = ButtonProps & {
    onClickAsync: () => Promise<void>;
};

export const StatefulButton: React.FC<StatefulButtonProps> = ({
    children,
    onClickAsync,
    className,
    ...rest
}) => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleClick = async () => {
        try {
            setStatus('loading');
            await onClickAsync();
            setStatus('success');
        } catch (error) {
            setStatus('error');
            console.error('Error in StatefulButton:', error);
        }
    };

    const variants = {
        initial: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.4 } },
        hidden: { opacity: 0, y: -15, transition: { duration: 0.3 } },
    };

    return (
        <Button
            disabled={status === 'loading'}
            onClick={handleClick}
            {...rest}
            variant={status === 'error' ? 'destructive' : rest.variant}
            className={cn('w-40 rounded-lg overflow-hidden gap-2', className)}
        >
            <span key="label">
                {status === 'idle'
                    ? children
                    : status === 'loading'
                        ? 'Feed importing...'
                        : status === 'success'
                            ? 'Feed imported successfully!'
                            : 'Error'}
            </span>
            <AnimatePresence mode="wait">
                {status === 'idle' ? (
                    <motion.span
                        key="idle"
                        variants={variants}
                        initial="initial"
                        animate="show"
                        exit="hidden"
                    >
                        <ArrowUpRight className="h-4 w-4" />
                    </motion.span>
                ) : status === 'loading' ? (
                    <motion.span
                        key="loading"
                        variants={variants}
                        initial="initial"
                        animate="show"
                        exit="hidden"
                    >
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    </motion.span>
                ) : (
                    <motion.span
                        key={status}
                        variants={variants}
                        initial="initial"
                        animate="show"
                        exit="hidden"
                    >
                        {status === 'success' && <CheckCircle className="h-4 w-4" />}
                        {status === 'error' && <XCircle className="h-4 w-4" />}
                    </motion.span>
                )}
            </AnimatePresence>
        </Button>
    );
};
