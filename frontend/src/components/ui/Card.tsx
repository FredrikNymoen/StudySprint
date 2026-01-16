import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
};

export function Card({ padding = 'md', className = '', children, ...props }: CardProps) {
    return (
        <div
            className={`bg-white rounded-xl border border-gray-200 shadow-sm ${paddings[padding]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className = '', children }: HTMLAttributes<HTMLDivElement>) {
    return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ className = '', children }: HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>;
}

export function CardContent({ className = '', children }: HTMLAttributes<HTMLDivElement>) {
    return <div className={className}>{children}</div>;
}
