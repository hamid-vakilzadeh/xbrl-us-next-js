'use client'

import React, { useState, useCallback, useTransition } from 'react';
import { 
  FactQuery, 
  FactHasDimensions,
  FactIsExtended,
  FactUltimus,
  FactInlineIsHidden,
  FactInlineNegated
} from '@/components/query/fact';
import { 
  EntityCards,
  EntityId, 
  EntityCik,
  EntityTicker,
} from '@/components/query/entity';
import { Card } from '@/components/ui/Card';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const QueryBuilder = () => {
  const [isPending, startTransition] = useTransition();
  const [selectedEndpoint, setSelectedEndpoint] = useState('1');
  const [enabledFields] = useState<Set<string>>(new Set(['fact.has-dimensions', 'fact.is-extended', 'fact.ultimus']));
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [filterEnabledFields, setFilterEnabledFields] = useState<Set<string>>(new Set());

  const handleFieldChange = useCallback((id: string, value: string) => {
    startTransition(() => {
      setFieldValues(prev => ({
        ...prev,
        [id]: value
      }));
    });
  }, []);

  const handleFieldSelect = useCallback((id: string, selected: boolean) => {
    startTransition(() => {
      if (!selected) {
        setFilterEnabledFields(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setFieldValues(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
      setSelectedFields(prev => {
        const next = new Set(prev);
        if (selected) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
    });
  }, []);

  const handleFilterToggle = useCallback((id: string, enabled: boolean) => {
    startTransition(() => {
      setFilterEnabledFields(prev => {
        const next = new Set(prev);
        if (enabled) {
          next.add(id);
          setFieldValues(prev => ({
            ...prev,
            [id]: 'any'
          }));
        } else {
          next.delete(id);
          setFieldValues(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }
        return next;
      });
    });
  }, []);

  const getQueryObject = useCallback(() => {
    const fields = Array.from(selectedFields);
    const parameters = Object.fromEntries(
      Array.from(filterEnabledFields)
        .filter(id => fieldValues[id] && fieldValues[id] !== 'any')
        .map(id => [id, fieldValues[id]])
    );

    return {
      method: selectedEndpoint,
      fields,
      parameters
    };
  }, [selectedEndpoint, selectedFields, filterEnabledFields, fieldValues]);

  const getSummary = useCallback(() => ({
    selectedCount: selectedFields.size,
    activeFilters: Object.keys(getQueryObject().parameters).length
  }), [selectedFields, getQueryObject]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Separator className="my-6" />
      <FactQuery 
        selectedEndpoint={selectedEndpoint} 
        onEndpointChange={setSelectedEndpoint}
      >
        <div className="space-y-4">
          <FactHasDimensions
            value={fieldValues[FactHasDimensions.id] || ''}
            onChange={(value) => handleFieldChange(FactHasDimensions.id, value)}
            enabled={enabledFields.has(FactHasDimensions.id)}
            selected={selectedFields.has(FactHasDimensions.id)}
            onSelect={(selected) => handleFieldSelect(FactHasDimensions.id, selected)}
            filterEnabled={filterEnabledFields.has(FactHasDimensions.id)}
            onFilterToggle={(enabled) => handleFilterToggle(FactHasDimensions.id, enabled)}
            isLoading={isPending}
          />

          <FactIsExtended
            value={fieldValues[FactIsExtended.id] || ''}
            onChange={(value) => handleFieldChange(FactIsExtended.id, value)}
            enabled={enabledFields.has(FactIsExtended.id)}
            selected={selectedFields.has(FactIsExtended.id)}
            onSelect={(selected) => handleFieldSelect(FactIsExtended.id, selected)}
            filterEnabled={filterEnabledFields.has(FactIsExtended.id)}
            onFilterToggle={(enabled) => handleFilterToggle(FactIsExtended.id, enabled)}
            isLoading={isPending}
          />

          <FactUltimus
            value={fieldValues[FactUltimus.id] || ''}
            onChange={(value) => handleFieldChange(FactUltimus.id, value)}
            enabled={enabledFields.has(FactUltimus.id)}
            selected={selectedFields.has(FactUltimus.id)}
            onSelect={(selected) => handleFieldSelect(FactUltimus.id, selected)}
            filterEnabled={filterEnabledFields.has(FactUltimus.id)}
            onFilterToggle={(enabled) => handleFilterToggle(FactUltimus.id, enabled)}
            isLoading={isPending}
          />
        </div>

        <Separator className="my-6" />

        <EntityCards
          values={fieldValues}
          onChange={handleFieldChange}
          enabledFields={enabledFields}
          selectedFields={selectedFields}
          onSelectField={handleFieldSelect}
          filterEnabledFields={filterEnabledFields}
          onFilterToggle={handleFilterToggle}
          isLoading={isPending}
        />
      </FactQuery>

      <Card className="mt-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Query Preview</h3>
            <div className="flex gap-3 items-center">
              <Badge variant="outline" className="bg-blue-50">
                {getSummary().selectedCount} fields
              </Badge>
              <Badge variant="outline" className="bg-green-50">
                {getSummary().activeFilters} filters
              </Badge>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Method</h4>
              <pre className="text-sm bg-gray-50 p-3 rounded border overflow-x-auto">
                {getQueryObject().method}
              </pre>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Fields</h4>
              <pre className="text-sm bg-gray-50 p-3 rounded border overflow-x-auto">
                {JSON.stringify(getQueryObject().fields, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Filter Parameters 
                {getSummary().activeFilters > 0 && (
                  <Badge variant="outline" className="ml-2 bg-green-50">
                    {getSummary().activeFilters} active
                  </Badge>
                )}
              </h4>
              <pre className="text-sm bg-gray-50 p-3 rounded border overflow-x-auto">
                {JSON.stringify(getQueryObject().parameters, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QueryBuilder;