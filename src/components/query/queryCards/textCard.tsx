import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { QueryCardProps, CheckboxWithLabel, QueryCardComponent } from './queryCard';


interface TextFilterProps {
    value: string;
    onChange: (value: string) => void;
    enabled: boolean;
    isLoading?: boolean;
    placeholder?: string;
}

export const TextFilter: React.FC<TextFilterProps> = ({
    value,
    onChange,
    enabled,
    isLoading,
    placeholder
}) => {
    const [inputValue, setInputValue] = React.useState('');
    const values = value ? value.split(',').filter(Boolean) : [];

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            const newValues = new Set([...values, ...inputValue.split(',').map(v => v.trim()).filter(Boolean)]);
            onChange(Array.from(newValues).join(','));
            setInputValue('');
        }
    };

    const removeValue = (valueToRemove: string) => {
        onChange(values.filter(v => v !== valueToRemove).join(','));
    };

    return (
        <div className="space-y-3">
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!enabled || isLoading}
                placeholder={placeholder || "Enter values, separate by comma..."}
                className={cn(
                    "w-full transition-all duration-200",
                    isLoading && "opacity-70"
                )}
            />
            {values.length > 0 && (
                <ScrollArea className="h-24 w-full rounded-md border p-2">
                    <div className="space-x-1 space-y-1">
                        {values.map((v, i) => (
                            <Badge
                                key={`${v}-${i}`}
                                variant="outline"
                                className="bg-blue-50 mr-1"
                            >
                                {v}
                                <button
                                    onClick={() => removeValue(v)}
                                    className="ml-1 hover:text-red-500 focus:outline-none"
                                    disabled={!enabled || isLoading}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );
};


const TextQueryCardComponent: React.FC<QueryCardProps> = ({
    value,
    onChange,
    enabled,
    selected,
    onSelect,
    filterEnabled,
    onFilterToggle,
    isLoading,
    title,
    description,
    id,
    placeholder
}) => {
    return (
        <Card
            id={id}
            role="region"
            aria-label={title}
            className="transition-all duration-200 hover:shadow-md"
        >
            <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="pt-1">
                            <CheckboxWithLabel
                                id={`select-${id}`}
                                label=""
                                checked={selected}
                                onChange={onSelect}
                                isLoading={isLoading}
                            />
                        </div>
                        <div>
                            <h1 className="text-lg font-medium">{title}</h1>
                            <p className="text-sm text-gray-600 mt-0.5">{description}</p>
                        </div>
                    </div>
                    <div className={cn(
                        "transition-all duration-300 ease-out",
                        selected 
                            ? "opacity-100 translate-x-0" 
                            : "opacity-0 translate-x-4 pointer-events-none"
                    )}>
                        <CheckboxWithLabel
                            id={`filter-${id}`}
                            label="Enable filter"
                            checked={filterEnabled}
                            onChange={onFilterToggle}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
                
                <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-out",
                    filterEnabled ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                )}>
                    {selected && filterEnabled && (
                        <div className="pl-9 transform transition-all duration-300">
                            <TextFilter
                                value={value}
                                onChange={onChange}
                                enabled={enabled}
                                isLoading={isLoading}
                                placeholder={placeholder}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

TextQueryCardComponent.displayName = 'TextQueryCard';

export const TextQueryCard: QueryCardComponent = Object.assign(TextQueryCardComponent, { id: 'text-query-card' });
