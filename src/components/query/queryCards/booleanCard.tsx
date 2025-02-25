import React from 'react';
import {
    Card,
} from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { CheckboxWithLabel } from "@/components/query/queryCards/queryCard";
import type { QueryCardProps } from '@/components/query/queryCards/queryCard';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";



interface BooleanFieldConfig {
    label?: string;
    definition: string;
    searchable: boolean;
    type: string;
    database_field: string;
    format: string;
  }
  

interface BooleanQueryCardProps extends QueryCardProps {
    field: BooleanFieldConfig;
  }
  

export const BooleanFilter = ({ value, onChange, enabled, isLoading = false }: { value: string; onChange: (value: string) => void; enabled: boolean; isLoading?: boolean }) => {
    const options = [
        { value: 'true', label: 'True', ariaLabel: 'Filter by true values' },
        { value: 'false', label: 'False', ariaLabel: 'Filter by false values' },
        { value: 'any', label: 'Any', ariaLabel: 'Show all values' }
    ];

    return (
        <div 
            className={cn(
                "transform transition-all duration-300 ease-out",
                "opacity-0 translate-y-[-8px] scale-95",
                "data-[show=true]:opacity-100 data-[show=true]:translate-y-0 data-[show=true]:scale-100"
            )}
            data-show="true"
            role="group" 
            aria-label="Filter options"
        >
            <ToggleGroup 
                type="single" 
                value={value} 
                onValueChange={v => v && onChange(v)} 
                disabled={!enabled || isLoading}
                className={cn(
                    "inline-flex rounded-md border p-0.5 bg-gray-50 shadow-sm",
                    "transition-opacity duration-200",
                    isLoading && "opacity-70"
                )}
            >
                {options.map(option => (
                    <ToggleGroupItem 
                        key={option.value}
                        value={option.value} 
                        size="sm" 
                        aria-label={option.ariaLabel}
                        className={cn(
                            "px-3 py-1.5 text-sm rounded-sm font-medium relative",
                            "data-[state=on]:bg-white data-[state=on]:text-primary",
                            "data-[state=on]:shadow-sm hover:bg-gray-100",
                            "transition-all duration-150 ease-in-out",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
                            isLoading && "cursor-not-allowed"
                        )}
                        disabled={isLoading}
                    >
                        {option.label}
                        {isLoading && value === option.value && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-sm">
                                <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                            </div>
                        )}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    );
};


export const BooleanQueryCard = ({ 
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
    field
}: BooleanQueryCardProps) => {
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
                        field.searchable && selected 
                            ? "opacity-100 translate-x-0" 
                            : "opacity-0 translate-x-4 pointer-events-none"
                    )}>
                        {field.searchable && (
                            <CheckboxWithLabel
                                id={`filter-${id}`}
                                label="Enable filter"
                                checked={filterEnabled}
                                onChange={onFilterToggle}
                                isLoading={isLoading}
                            />
                        )}
                    </div>
                </div>
                
                <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-out",
                    filterEnabled ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                )}>
                    {field.searchable && selected && filterEnabled && (
                        <div className="pl-9 transform transition-all duration-300">
                            <BooleanFilter
                                value={value}
                                onChange={onChange}
                                enabled={enabled}
                                isLoading={isLoading}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

BooleanQueryCard.id = 'boolean-query-card';

export type { BooleanFieldConfig, BooleanQueryCardProps };
