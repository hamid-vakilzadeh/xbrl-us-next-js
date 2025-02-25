'use client'

import React, { useState, useCallback, useTransition } from 'react';
import { 
  FactCards, 
  FactHasDimensions, 
  FactIsExtended, 
  FactUltimus, 
  FactQuery,
 } from '@/components/query/fact';
import { 
  EntityId, 
  EntityCik,
  EntityTicker,
 } from '@/components/query/entity';
import { Card } from '@/components/ui/Card';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";



const FACT_ENDPOINT_CONFIG = {
    "fact.has-dimensions": {
      "component": FactHasDimensions,
      "has_endpoint_config": false
    },
    "fact.is-extended": {
      "component": FactIsExtended,
      "has_endpoint_config": false
    },
    "fact.ultimus": {
      "component": FactUltimus,
      "has_endpoint_config": false
    },
    "fact.id": {
      "component": "TBD",
      "has_endpoint_config": true,
      "endpoint_config": [
      {
        "endpoint_id": "1",
        "filter-method": "multi",
      }, 
      {
        "endpoint_id": "2",
        "filter-method": "single",
      }], 
    },
    "entity.id": {
        "component": EntityId,
        "has_endpoint_config": true,
        "endpoint_config": [
        {
          "endpoint_id": "1",
          "filter-method": "multi",
        }, 
        {
          "endpoint_id": "2",
          "filter-method": "single",
        }], 
      },     
    }

const QueryBuilder = () => {
  const [isPending, startTransition] = useTransition();
  const [selectedMethod, setselectedMethod] = useState('fact');
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
        // First disable the filter if it's enabled
        setFilterEnabledFields(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        // Then clear any filter values
        setFieldValues(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
      // Finally update selection
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
          // Set default value to "any" when enabling filter
          setFieldValues(prev => ({
            ...prev,
            [id]: 'any'
          }));
        } else {
          next.delete(id);
          // Clear filter value when filter is disabled
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
      method: selectedMethod,
      fields,
      parameters
    };
  }, [selectedMethod, selectedFields, filterEnabledFields, fieldValues]);

  const getSummary = useCallback(() => ({
    selectedCount: selectedFields.size,
    activeFilters: Object.keys(getQueryObject().parameters).length
  }), [selectedFields, getQueryObject]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <FactQuery />
      <Separator className="my-6" />
      <Card className="mb-6">
        <div className="p-4">
          <label className="block text-sm font-medium mb-2">Select Method</label>
          <select
            value={selectedMethod}
            onChange={(e) => setselectedMethod(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="fact">Fact</option>
            <option value="report">Report</option>
          </select>
        </div>
      </Card>

      <Separator className="my-6" />

      <div className="mb-8">
        <FactCards
          values={fieldValues}
          onChange={handleFieldChange}
          enabledFields={enabledFields}
          selectedFields={selectedFields}
          onSelectField={handleFieldSelect}
          filterEnabledFields={filterEnabledFields}
          onFilterToggle={handleFilterToggle}
          isLoading={isPending}
        />
      </div>

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