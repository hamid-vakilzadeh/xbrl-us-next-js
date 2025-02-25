import React from 'react';
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { CheckboxWithLabel, BooleanFilter, QueryCardComponent, EndpointTabs } from "@/components/query/base";

const FACT_ENDPOINTS = {
    "1": {
        label: 'Search Facts',
        description: 'Search for facts based on various criteria',
        endpoint: '/fact/search',
    },
    "2": {
        label: 'Get Fact by ID',
        description: 'Retrieve a fact by its unique identifier',
        endpoint: '/fact/{fact.id}'
    },
}


const FACT_FIELDS = {
      "fact.accuracy-index": {
        "searchable": true,
        "type": "int",
        "database_field": "accuracy_index",
        "format": "integer"
      },
      "fact.decimals": {
        "searchable": false,
        "type": "text",
        "database_field": "decimals_value",
        "definition": "The decimal value associated with a fact. This can be either a number representing decimal places or be infinite. There are two values returned for this field the first is a decimal and the second is a boolean. The first indicates the decimal places if applicable and the second identifies if the value is infinite(t) or not (f)."
      },
      "fact.has-dimensions": {
        "searchable": true,
        "type": "boolean",
        "database_field": "specifies_dimensions",
        "label": "Fact Has Dimensions",
        "definition": "This boolean field indicates if the fact has any dimensions associated with it.",
        "format": "boolean"
      },
      "fact.hash": {
        "searchable": true,
        "type": "text",
        "database_field": "fact_hash",
        "definition": "The fact hash is derived from the aspect properties of the fact. Each fact will have a different hash in a given report. Over time however different facts may have the same hash if they are identical. The hash does not take into account the value reported for the fact. the fact hash is used to determine the ultimus index. By searching on the hash you can identify all identical facts that were reported.",
        "format": "hex_hash"
      },
      "fact.id": {
        "searchable": true,
        "type": "int",
        "database_field": "fact_id",
        "definition": "The unique identifier used to identify a fact.",
        "format": "integer"
      },
      "fact.inline-display-value": {
        "searchable": false,
        "type": "varchar",
        "database_field": "inline_display_value",
        "definition": "The original value that was shown in the inline filing prior to be transformed to an XBRL value."
      },
      "fact.inline-is-hidden": {
        "searchable": false,
        "type": "boolean",
        "database_field": "inline_is_hidden",
        "definition": "Boolean that indicates if the fact was hidden in the inline document.",
        "format": "boolean"
      },
      "fact.inline-negated": {
        "searchable": false,
        "type": "boolean",
        "database_field": "inline_negated",
        "definition": "Boolean that indicates if the fact was negated in the inline document.",
        "format": "boolean"
      },
      "fact.inline-scale": {
        "searchable": false,
        "type": "int",
        "database_field": "inline_scale",
        "definition": "Integer that indicates the scale used on the fact in the inline document.",
        "format": "integer"
      },
      "fact.is-extended": {
        "searchable": true,
        "type": "boolean",
        "database_field": "is_extended",
        "definition": "This indicates if the fact is comprised of either an extension concept, extension axis or extension member.",
        "format": "boolean"
      },
      "fact.numerical-value": {
        "searchable": false,
        "type": "numeric",
        "database_field": "effective_value",
        "definition": "The numerical value of the fact that was reported. "
      },
      "fact.text-search": {
        "searchable": true,
        "type": "text",
        "definition": "Used to define text in a text search. Cannot be output as a field."
      },
      "fact.ultimus": {
        "searchable": true,
        "type": "boolean",
        "database_field": "ultimus_index",
        "definition": "A boolean that indicates if the fact is the latest value reported.  A value of true represents that it's the latest value reported.  A value of false represents that the value has been superseded with a more recent fact.",
        "format": "boolean"
      },
      "fact.ultimus-index": {
        "searchable": true,
        "type": "int",
        "database_field": "ultimus_index",
        "definition": "An integer that records the incarnation of the fact. The same fact is reported many times and the ultimus field captures the incarnation that was reported. A value of 1 indicates that this is the latest value of the fact. A value of 6 for example would indicate that the value has been reported 6 times subsequently to this fact being reported. If requesting values from a specific report the ultimus filed would not be used as a search parameter as you will not get all the fact values if there has been a subsequent report filed, as the ultimus value on these facts in a specific report will be updated as additional reports come in.",
        "format": "integer"
      },
      "fact.value": {
        "searchable": true,
        "type": "text",
        "database_field": "fact_value",
        "definition": "The value of the fact as a text value. This included numerical as well as non numerical values reported."
      },
      "fact.value-link": {
        "searchable": false,
        "type": "varchar",
        "database_field": "'${DISPATCH}?Task=htmlExportFact&FactID=' || fact_id",
        "definition": "Used to define text in a text search. Will return the actual text."
      },
      "fact.xml-id": {
        "searchable": false,
        "type": "varchar",
        "database_field": "xml_id",
        "definition": "The xml-id included in the filing. Many facts may not have this identifier as it is dependent ofn the filer adding it. In inline filings it can be used to go directly to the fact value in the filing."
      },
}


export const FactHasDimensions: QueryCardComponent = ({ 
    value, 
    onChange, 
    enabled, 
    selected, 
    onSelect,
    filterEnabled,
    onFilterToggle,
    isLoading 
}) => {
    const field = FACT_FIELDS["fact.has-dimensions"];
    const id = "fact.has-dimensions";
    
    return (
        <Card 
            id={id} 
            role="region" 
            aria-label={field.label}
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
                            <h1 className="text-lg font-medium">{field.label}</h1>
                            <p className="text-sm text-gray-600 mt-0.5">{field.definition}</p>
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
FactHasDimensions.id = "fact.has-dimensions";

export const FactIsExtended: QueryCardComponent = ({ 
    value, 
    onChange, 
    enabled, 
    selected, 
    onSelect,
    filterEnabled,
    onFilterToggle,
    isLoading 
}) => {
    const field = FACT_FIELDS["fact.is-extended"];
    const id = "fact.is-extended";
    
    return (
        <Card 
            id={id} 
            role="region" 
            aria-label="Extended Fact"
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
                            <h1 className="text-lg font-medium">Extended Fact</h1>
                            <p className="text-sm text-gray-600 mt-0.5">{field.definition}</p>
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
FactIsExtended.id = "fact.is-extended";

export const FactUltimus: QueryCardComponent = ({ 
    value, 
    onChange, 
    enabled, 
    selected, 
    onSelect,
    filterEnabled,
    onFilterToggle,
    isLoading 
}) => {
    const field = FACT_FIELDS["fact.ultimus"];
    const id = "fact.ultimus";
    
    return (
        <Card 
            id={id} 
            role="region" 
            aria-label="Latest Value"
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
                            <h1 className="text-lg font-medium">Latest Value</h1>
                            <p className="text-sm text-gray-600 mt-0.5">{field.definition}</p>
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
FactUltimus.id = "fact.ultimus";

export const FactInlineIsHidden: QueryCardComponent = ({ 
    value, 
    onChange, 
    enabled, 
    selected, 
    onSelect,
    filterEnabled,
    onFilterToggle,
    isLoading 
}) => {
    const field = FACT_FIELDS["fact.inline-is-hidden"];
    const id = "fact.inline-is-hidden";
    
    return (
        <Card 
            id={id} 
            role="region" 
            aria-label="Hidden in Inline Document"
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
                            <h1 className="text-lg font-medium">Hidden in Inline Document</h1>
                            <p className="text-sm text-gray-600 mt-0.5">{field.definition}</p>
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
FactInlineIsHidden.id = "fact.inline-is-hidden";

export const FactInlineNegated: QueryCardComponent = ({ 
    value, 
    onChange, 
    enabled, 
    selected, 
    onSelect,
    filterEnabled,
    onFilterToggle,
    isLoading 
}) => {
    const field = FACT_FIELDS["fact.inline-negated"];
    const id = "fact.inline-negated";
    
    return (
        <Card 
            id={id} 
            role="region" 
            aria-label="Negated in Inline Document"
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
                            <h1 className="text-lg font-medium">Negated in Inline Document</h1>
                            <p className="text-sm text-gray-600 mt-0.5">{field.definition}</p>
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
FactInlineNegated.id = "fact.inline-negated";

// Array of all boolean fact components for easy mapping
const booleanFactComponents = [
    FactHasDimensions,
    FactIsExtended,
    FactUltimus,
    FactInlineIsHidden,
    FactInlineNegated
];

interface FactCardsProps {
    values: Record<string, string>;
    onChange: (id: string, value: string) => void;
    enabledFields: Set<string>;
    selectedFields: Set<string>;
    onSelectField: (id: string, selected: boolean) => void;
    filterEnabledFields: Set<string>;
    onFilterToggle: (id: string, enabled: boolean) => void;
    isLoading?: boolean;
}

export const FactCards: React.FC<FactCardsProps> = ({ 
    values, 
    onChange, 
    enabledFields, 
    selectedFields,
    onSelectField,
    filterEnabledFields,
    onFilterToggle,
    isLoading
}) => {
    const getActiveFiltersCount = () => {
        return Array.from(filterEnabledFields).filter(id => 
            values[id] && values[id] !== 'any'
        ).length;
    };

    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Boolean Fact Fields</h2>
                    {selectedFields.size > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{selectedFields.size} selected</span>
                            {getActiveFiltersCount() > 0 && (
                                <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200">
                                    {getActiveFiltersCount()} active filters
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="space-y-3">
                    {booleanFactComponents.map((FactComponent) => (
                        <div 
                            key={FactComponent.id}
                            className={cn(
                                'transition-opacity duration-200',
                                !selectedFields.has(FactComponent.id) && 'opacity-80 hover:opacity-100'
                            )}
                        >
                            <FactComponent
                                value={values[FactComponent.id] || 'any'}
                                onChange={(value) => onChange(FactComponent.id, value)}
                                enabled={enabledFields.has(FactComponent.id)}
                                selected={selectedFields.has(FactComponent.id)}
                                onSelect={(selected) => onSelectField(FactComponent.id, selected)}
                                filterEnabled={filterEnabledFields.has(FactComponent.id)}
                                onFilterToggle={(enabled) => onFilterToggle(FactComponent.id, enabled)}
                                isLoading={isLoading}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

interface FactQueryProps {
    selectedEndpoint: string;
    onEndpointChange: (endpointId: string) => void;
    // ... other props
}

export const FactQuery: React.FC<FactQueryProps> = ({
    selectedEndpoint,
    onEndpointChange,
    // ... other props
}) => {
    return (
        <div className="space-y-6">
            <EndpointTabs
                endpoints={FACT_ENDPOINTS}
                selectedEndpoint={selectedEndpoint}
                onEndpointChange={onEndpointChange}
            />
            {/* ... rest of your fact query components ... */}
        </div>
    );
};