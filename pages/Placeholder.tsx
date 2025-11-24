
import React from 'react';

interface PlaceholderProps {
    title: string;
    message: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title, message }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
            <p className="text-gray-600">{message}</p>
        </div>
    );
};

export default Placeholder;
