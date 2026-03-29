import React from 'react';

interface AlertProps {
    type: string;
    message: string;
}

const CustomAlertRenderer: React.FC<{ data: AlertProps }> = ({ data }) => {
    const { type, message } = data;
    const getAlertStyle = (alertType: string) => {
        const baseStyle = 'p-5 my-6 rounded-2xl border flex items-start gap-4 transition-all duration-300 ';
        switch (alertType) {
            case 'primary':
                return `${baseStyle} bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.05)]`;
            case 'secondary':
                return `${baseStyle} bg-zinc-500/10 border-zinc-500/20 text-zinc-400`;
            case 'success':
                return `${baseStyle} bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]`;
            case 'danger':
                return `${baseStyle} bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.05)]`;
            case 'warning':
                return `${baseStyle} bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.05)]`;
            case 'info':
                return `${baseStyle} bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.05)]`;
            case 'light':
                return `${baseStyle} bg-white/5 border-white/10 text-zinc-200`;
            case 'dark':
                return `${baseStyle} bg-zinc-900 border-zinc-800 text-zinc-100`;
            default:
                return `${baseStyle} bg-blue-500/10 border-blue-500/20 text-blue-400`;
        }
    };

    return (
        <div className={`not-prose ${getAlertStyle(type)}`} role="alert">
            <div className="mt-1 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse" />
            </div>
            <p className="text-[14px] leading-relaxed font-medium">{message}</p>
        </div>
    );
};

export default CustomAlertRenderer;
