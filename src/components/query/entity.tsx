import React from 'react';
import { TextQueryCard, QueryCardComponent } from "@/components/query/base";

const ENTITY_FIELDS = {
    "entity.cik": {
        "searchable": true,
        "type": "varchar",
        "database_field": "entity_code",
        "label": "Entity CIK",
        "definition": "The CIK is the SEC identifier used to identify a reporting entity. This is the CIK associated with a given fact, DTS or report.",
        "format": "cik,cid,lei,grip"
    },
    "entity.code": {
      "searchable": true,
      "type": "varchar",
      "database_field": "entity_code",
      "definition": "The entity identifier for whatever source it is associated with.  All entity identifiers are in this field. This is the CIK associated with a given fact, DTS or report.",
      "format": "cik,cid,lei,grip",
      "filter-method": ["single", "multi"]
    },
    "entity.id": {
        "searchable": true,
        "type": "int",
        "database_field": "entity_id",
        "label": "Entity ID",
        "definition": "The internal identifier used to identify an entity. This will be replaced with the LEI when the SEC supports the LEI standard.",
        "format": "integer"
    },
    "entity.name": {
      "searchable": true,
      "type": "varchar",
      "database_field": "entity_name",
      "label": "Entity Name",
      "definition": "The name of the entity reporting.",
      "filter-method": ["single", "multi"]
    },
    "entity.scheme": {
      "searchable": "false",
      "type": "varchar",
      "database_field": "authority_scheme",
      "label": "Entity Scheme",
      "definition": "The scheme of the identifier associated with a fact, report or DTS. A fact could have multiple entity identifiers and this indicates the identifier that was used.",
      "format": "uri"
    },
    "entity.ticker": {
        "searchable": true,
        "type": "varchar", 
        "database_field": "entity_ticker",
        "label": "Entity Ticker",
        "definition": "The stock exchange ticker of the entity filing the report. Although a company may have multiple tickers this returns a single value.",
        "format": "ticker"
    },
    "entity.ticker2": {
      "searchable": true,
      "type": "varchar",
      "database_field": "ticker2(entity.entity_id)",
      "format": "ticker",
      "filter-method": ["single", "multi"]
    }
};

export const EntityId: QueryCardComponent = (props) => {
    const field = ENTITY_FIELDS["entity.id"];
    return (
        <TextQueryCard
            {...props}
            id="entity.id"
            title={field.label}
            description={field.definition}
            placeholder="Enter entity ID..."
            aria-label={field.label}
        />
    );
};
EntityId.id = "entity.id";

export const EntityCik: QueryCardComponent = (props) => {
    const field = ENTITY_FIELDS["entity.cik"];
    return (
        <TextQueryCard
            {...props}
            id="entity.cik"
            title={field.label}
            description={field.definition}
            placeholder="Enter CIK values..."
            aria-label={field.label}
        />
    );
};
EntityCik.id = "entity.cik";

export const EntityTicker: QueryCardComponent = (props) => {
    const field = ENTITY_FIELDS["entity.ticker"];
    return (
        <TextQueryCard
            {...props}
            id="entity.ticker"
            title={field.label}
            description={field.definition}
            placeholder="Enter ticker symbols..."
            aria-label={field.label}
        />
    );
};
EntityTicker.id = "entity.ticker";

export const EntityCards: React.FC<{
    values: Record<string, string>;
    onChange: (id: string, value: string) => void;
    enabledFields: Set<string>;
    selectedFields: Set<string>;
    onSelectField: (id: string, selected: boolean) => void;
    filterEnabledFields: Set<string>;
    onFilterToggle: (id: string, enabled: boolean) => void;
    isLoading?: boolean;
}> = ({
    values,
    onChange,
    enabledFields,
    selectedFields,
    onSelectField,
    filterEnabledFields,
    onFilterToggle,
    isLoading
}) => {
    return (
        <div className="space-y-4" role="region" aria-label="Entity Search Fields">
            {[EntityId, EntityCik, EntityTicker].map((Component) => (
                <Component
                    key={Component.id}
                    value={values[Component.id] || ''}
                    onChange={(value) => onChange(Component.id, value)}
                    enabled={enabledFields.has(Component.id)}
                    selected={selectedFields.has(Component.id)}
                    onSelect={(selected) => onSelectField(Component.id, selected)}
                    filterEnabled={filterEnabledFields.has(Component.id)}
                    onFilterToggle={(enabled) => onFilterToggle(Component.id, enabled)}
                    isLoading={isLoading}
                />
            ))}
        </div>
    );
};
