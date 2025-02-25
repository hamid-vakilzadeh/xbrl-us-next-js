import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

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

interface Endpoint {
    label: string;
    description: string;
    endpoint: string;
}

interface EndpointTabsProps {
    endpoints: Record<string, Endpoint>;
    selectedEndpoint: string;
    onEndpointChange: (endpointId: string) => void;
}

export const EndpointTabs: React.FC<EndpointTabsProps> = ({
    endpoints,
    selectedEndpoint,
    onEndpointChange,
}) => {
    return (
        <Tabs value={selectedEndpoint} onValueChange={onEndpointChange} className="w-full">
            <TabsList className="grid w-full" style={{ 
                gridTemplateColumns: `repeat(${Object.keys(endpoints).length}, minmax(0, 1fr))` 
            }}>
                {Object.entries(endpoints).map(([id, endpoint]) => (
                    <TabsTrigger key={id} value={id}>
                        {endpoint.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            {Object.entries(endpoints).map(([id, endpoint]) => (
                <TabsContent key={id} value={id}>
                    <Card>
                        <CardHeader>
                            <CardDescription>
                                {endpoint.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <code className="px-2 py-1 text-xs bg-gray-100 rounded text-gray-700">
                                {endpoint.endpoint}
                            </code>
                        </CardContent>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
    );
};


