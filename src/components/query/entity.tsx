import React from 'react';
import { Card } from "@/components/ui/Card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TextQueryCard, QueryCardComponent } from "@/components/query/base";

const ENTITY_FIELDS = {
    "entity.cik": {
      "searchable": "true",
      "type": "varchar",
      "database_field": "entity_code",
      "definition": "The CIK is the SEC identifier used to identify a reporting entity. This is the CIK associated with a given fact, DTS or report.",
      "format": "cik,cid,lei,grip",
      "filter-method": ["single", "multi"]
    },
    "entity.code": {
      "searchable": "true",
      "type": "varchar",
      "database_field": "entity_code",
      "definition": "The entity identifier for whatever source it is associated with.  All entity identifiers are in this field. This is the CIK associated with a given fact, DTS or report.",
      "format": "cik,cid,lei,grip",
      "filter-method": ["single", "multi"]
    },
    "entity.id": {
      "searchable": "true",
      "type": "int",
      "database_field": "entity_id",
      "definition": "The internal identifier used to identify an entity. This will be replaced with the LEI when teh SEC supports the LEI standard.",
      "format": "integer",
      "filter-method": ["single", "multi"]
    },
    "entity.name": {
      "searchable": "true",
      "type": "varchar",
      "database_field": "entity_name",
      "definition": "The name of the entity reporting.",
      "filter-method": ["single", "multi"]
    },
    "entity.scheme": {
      "searchable": "false",
      "type": "varchar",
      "database_field": "authority_scheme",
      "definition": "The scheme of the identifier associated with a fact, report or DTS. A fact could have multiple entity identifiers and this indicates the identifier that was used.",
      "format": "uri"
    },
    "entity.ticker": {
      "searchable": "true",
      "type": "varchar",
      "database_field": "entity_ticker",
      "definition": "The stock exchange ticker of the entity filing the report. Although a company may have multiple tickers this returns a single value.",
      "format": "ticker",
      "filter-method": ["single", "multi"]
    },
    "entity.ticker2": {
      "searchable": "true",
      "type": "varchar",
      "database_field": "ticker2(entity.entity_id)",
      "format": "ticker",
      "filter-method": ["single", "multi"]
    }
}

const createEntityComponent = (fieldKey: string): QueryCardComponent => {
    const field = ENTITY_FIELDS[fieldKey];
    const Component: QueryCardComponent = (props) => {
        if (!field.searchable) return null;
        
        return (
            <TextQueryCard
                {...props}
                id={fieldKey}
                title={field.definition?.split('.')[0] || fieldKey}
                description={field.definition || ''}
                placeholder={`Enter ${fieldKey.split('.')[1]} values, separate by comma...`}
            />
        );
    };
    Component.id = fieldKey;
    return Component;
};

// Create components for each searchable entity field
export const EntityCik = createEntityComponent('entity.cik');
export const EntityCode = createEntityComponent('entity.code');
export const EntityId = createEntityComponent('entity.id');
export const EntityName = createEntityComponent('entity.name');
export const EntityTicker = createEntityComponent('entity.ticker');
export const EntityTicker2 = createEntityComponent('entity.ticker2');

// Array of all text-based entity components for easy mapping
const textEntityComponents = [
    EntityCik,
    EntityCode,
    EntityId,
    EntityName,
    EntityTicker,
    EntityTicker2
];

interface EntityCardsProps {
    values: Record<string, string>;
    onChange: (id: string, value: string) => void;
    enabledFields: Set<string>;
    selectedFields: Set<string>;
    onSelectField: (id: string, selected: boolean) => void;
    filterEnabledFields: Set<string>;
    onFilterToggle: (id: string, enabled: boolean) => void;
    isLoading?: boolean;
}

export const EntityCards: React.FC<EntityCardsProps> = ({ 
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
            values[id] && values[id].length > 0
        ).length;
    };

    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Entity Fields</h2>
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
                    {textEntityComponents.map((EntityComponent) => (
                        <div 
                            key={EntityComponent.id}
                            className={cn(
                                'transition-opacity duration-200',
                                !selectedFields.has(EntityComponent.id) && 'opacity-80 hover:opacity-100'
                            )}
                        >
                            <EntityComponent
                                value={values[EntityComponent.id] || ''}
                                onChange={(value) => onChange(EntityComponent.id, value)}
                                enabled={enabledFields.has(EntityComponent.id)}
                                selected={selectedFields.has(EntityComponent.id)}
                                onSelect={(selected) => onSelectField(EntityComponent.id, selected)}
                                filterEnabled={filterEnabledFields.has(EntityComponent.id)}
                                onFilterToggle={(enabled) => onFilterToggle(EntityComponent.id, enabled)}
                                isLoading={isLoading}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};