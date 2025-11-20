import { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '@/utils/cn';

interface IconProps extends LucideProps {
    icon: LucideIcon;
    className?: string;
}

export const Icon = ({ icon: IconComponent, className, ...props }: IconProps) => {
    return (
        <IconComponent
            className={cn("w-6 h-6", className)}
            {...props}
        />
    );
};
