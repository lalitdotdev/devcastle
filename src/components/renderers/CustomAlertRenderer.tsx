import React from 'react';

interface AlertProps {
    type: string;
    message: string;
}

const CustomAlertRenderer: React.FC<AlertProps> = ({ type, message }) => {
    const getAlertStyle = (alertType: string) => {
        const baseStyle = 'p-4 mb-4 rounded-lg';
        switch (alertType) {
            case 'primary':
                return `${baseStyle} bg-blue-100 text-blue-800`;
            case 'secondary':
                return `${baseStyle} bg-gray-100 text-gray-800`;
            case 'success':
                return `${baseStyle} bg-green-100 text-green-800`;
            case 'danger':
                return `${baseStyle} bg-red-100 text-red-800`;
            case 'warning':
                return `${baseStyle} bg-yellow-100 text-yellow-800`;
            case 'info':
                return `${baseStyle} bg-indigo-100 text-indigo-800`;
            case 'light':
                return `${baseStyle} bg-gray-50 text-gray-800`;
            case 'dark':
                return `${baseStyle} bg-gray-800 text-white`;
            default:
                return `${baseStyle} bg-blue-100 text-blue-800`;
        }
    };

    return (
        <div className={getAlertStyle(type)} role="alert">
            <p className="font-medium">{message}</p>
        </div>
    );
};

export default CustomAlertRenderer;
