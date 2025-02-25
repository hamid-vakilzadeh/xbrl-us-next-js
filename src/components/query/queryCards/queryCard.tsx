import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";



export interface QueryCardProps {
    value: string;
    onChange: (value: string) => void;
    enabled: boolean;
    selected: boolean;
    onSelect: (selected: boolean) => void;
    filterEnabled: boolean;
    onFilterToggle: (enabled: boolean) => void;
    isLoading?: boolean;
    title?: string;
    description?: string;
    id?: string;
    placeholder?: string;
}

export interface QueryCardComponent extends React.FC<QueryCardProps> {
    id: string;
}

export const CheckboxWithLabel = ({ 
    id, 
    label, 
    checked, 
    onChange,
    isLoading
}: { 
    id: string; 
    label: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
    isLoading?: boolean;
}) => (
    <div className="flex items-center space-x-2">
        <div className="relative">
            <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={onChange}
                disabled={isLoading}
                className={cn(
                    "focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                    "transition-opacity duration-200",
                    isLoading && "opacity-70"
                )}
            />
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                </div>
            )}
        </div>
        <Label 
            htmlFor={id} 
            className={cn(
                "text-sm whitespace-nowrap cursor-pointer hover:text-blue-600 transition-colors",
                isLoading && "opacity-70 cursor-not-allowed"
            )}
        >
            {label}
        </Label>
    </div>
);