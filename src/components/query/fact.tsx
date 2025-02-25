import React from 'react';
import {QueryCardProps } from "@/components/query/queryCards/queryCard";
import {EndpointTabs} from "@/components/query/queryCards/endpointCard";
import {
    BooleanQueryCard, 
    BooleanFieldConfig
} from "@/components/query/queryCards/booleanCard";

import { FACT } from '@/store/meta/fact';

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

const FACT_FIELDS = FACT.fields;

export const FactHasDimensions = (props: QueryCardProps) => {
    const field = FACT_FIELDS["fact.has-dimensions"] as BooleanFieldConfig;
    return (
        <BooleanQueryCard
            {...props}
            id="fact.has-dimensions"
            title="Fact Has Dimensions"
            description={field.definition}
            field={field}
        />
    );
};
FactHasDimensions.id = "fact.has-dimensions";

export const FactIsExtended = (props: QueryCardProps) => {
    const field = FACT_FIELDS["fact.is-extended"] as BooleanFieldConfig;
    return (
        <BooleanQueryCard
            {...props}
            id="fact.is-extended"
            title="Extended Fact"
            description={field.definition}
            field={field}
        />
    );
};
FactIsExtended.id = "fact.is-extended";

export const FactUltimus = (props: QueryCardProps) => {
    const field = FACT_FIELDS["fact.ultimus"] as BooleanFieldConfig;
    return (
        <BooleanQueryCard
            {...props}
            id="fact.ultimus"
            title="Latest Value"
            description={field.definition}
            field={field}
        />
    );
};
FactUltimus.id = "fact.ultimus";

export const FactInlineIsHidden = (props: QueryCardProps) => {
    const field = FACT_FIELDS["fact.inline-is-hidden"] as BooleanFieldConfig;
    return (
        <BooleanQueryCard
            {...props}
            id="fact.inline-is-hidden"
            title="Hidden in Inline Document"
            description={field.definition}
            field={field}
        />
    );
};
FactInlineIsHidden.id = "fact.inline-is-hidden";

export const FactInlineNegated = (props: QueryCardProps) => {
    const field = FACT_FIELDS["fact.inline-negated"] as BooleanFieldConfig;
    return (
        <BooleanQueryCard
            {...props}
            id="fact.inline-negated"
            title="Negated in Inline Document"
            description={field.definition}
            field={field}
        />
    );
};
FactInlineNegated.id = "fact.inline-negated";

interface FactQueryProps {
    selectedEndpoint: string;
    onEndpointChange: (endpointId: string) => void;
    children?: React.ReactNode;
    // ... other props
}

export const FactQuery: React.FC<FactQueryProps> = ({
    selectedEndpoint,
    onEndpointChange,
    children,
    // ... other props
}) => {
    return (
        <div className="space-y-6">
            <EndpointTabs
                endpoints={FACT_ENDPOINTS}
                selectedEndpoint={selectedEndpoint}
                onEndpointChange={onEndpointChange}
            />
            {/* ... rest of fact query components ... */}
            {children}
        </div>
    );
};