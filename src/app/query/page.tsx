'use client'
import React, { useState, useCallback, useTransition, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useSearchFacts } from '@/lib/api/facts';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { 
  FactQuery, 
  FactHasDimensions,
  FactIsExtended,
  FactUltimus,
  FactInlineIsHidden,
  FactInlineNegated,
} from '@/components/query/fact';
import { 
  EntityId, 
  EntityCik,
  EntityTicker,
} from '@/components/query/entity';
import { Card } from '@/components/ui/Card';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/Button';

const formSchema = z.object({
  endpoint: z.string(),
  fields: z.array(z.string()),
  filters: z.record(z.union([z.string(), z.number(), z.boolean(), z.array(z.union([z.string(), z.number()]))]))
});

type FormValues = z.infer<typeof formSchema>;

const QueryBuilder = () => {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [shouldFetch, setShouldFetch] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endpoint: 'fact/search',
      fields: [],
      filters: {}
    }
  });

  const [selectedEndpoint, setSelectedEndpoint] = useState('1');
  const [enabledFields] = useState<Set<string>>(new Set([
    'fact.has-dimensions', 
    'fact.is-extended', 
    'fact.ultimus',
    'entity.id',
    'entity.cik',
    'entity.ticker'
  ]));
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
    const endpoint = selectedEndpoint === '1' ? 'fact/search' : 'fact/{fact.id}';
    return {
      method: endpoint,
      fields,
      parameters
    };
  }, [selectedEndpoint, selectedFields, filterEnabledFields, fieldValues]);

  const getSummary = useCallback(() => ({
    selectedCount: selectedFields.size,
    activeFilters: Object.keys(getQueryObject().parameters).length
  }), [selectedFields, getQueryObject]);

  // Update form values when fields change
  useEffect(() => {
    const fields = Array.from(selectedFields);
    const filters = Object.fromEntries(
      Array.from(filterEnabledFields)
        .filter(id => fieldValues[id] && fieldValues[id] !== 'any')
        .map(id => [id, fieldValues[id]])
    );
    
    form.setValue('fields', fields);
    form.setValue('filters', filters);
  }, [selectedFields, filterEnabledFields, fieldValues, form]);

  const query = useSearchFacts(user?.accessToken || '', {
    endpoint: form.watch('endpoint') as 'fact/search',
    fields: form.watch('fields'),
    filters: form.watch('filters')
  }, {
    enabled: shouldFetch
  });

  const onSubmit = useCallback((data: FormValues) => {
    setShouldFetch(true);
    console.log('Query being executed with:', data);
  }, []);

  // Reset shouldFetch when query completes
  useEffect(() => {
    if (!query.isLoading && shouldFetch) {
      setShouldFetch(false);
    }
  }, [query.isLoading, shouldFetch]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="endpoint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endpoint</FormLabel>
                <FormControl>
                  <FactQuery 
                    selectedEndpoint={field.value} 
                    onEndpointChange={field.onChange}
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
                      <FactInlineIsHidden
                        value={fieldValues[FactInlineIsHidden.id] || ''}
                        onChange={(value) => handleFieldChange(FactInlineIsHidden.id, value)}
                        enabled={enabledFields.has(FactInlineIsHidden.id)}
                        selected={selectedFields.has(FactInlineIsHidden.id)}
                        onSelect={(selected) => handleFieldSelect(FactInlineIsHidden.id, selected)}
                        filterEnabled={filterEnabledFields.has(FactInlineIsHidden.id)}
                        onFilterToggle={(enabled) => handleFilterToggle(FactInlineIsHidden.id, enabled)}
                        isLoading={isPending}
                      />
                      <FactInlineNegated
                        value={fieldValues[FactInlineNegated.id] || ''}
                        onChange={(value) => handleFieldChange(FactInlineNegated.id, value)}
                        enabled={enabledFields.has(FactInlineNegated.id)}
                        selected={selectedFields.has(FactInlineNegated.id)}
                        onSelect={(selected) => handleFieldSelect(FactInlineNegated.id, selected)}
                        filterEnabled={filterEnabledFields.has(FactInlineNegated.id)}
                        onFilterToggle={(enabled) => handleFilterToggle(FactInlineNegated.id, enabled)}
                        isLoading={isPending}
                      />
                      

                    </div>
                    <div className="space-y-4">
                      <EntityId
                        value={fieldValues[EntityId.id] || ''}
                        onChange={(value) => handleFieldChange(EntityId.id, value)}
                        enabled={enabledFields.has(EntityId.id)}
                        selected={selectedFields.has(EntityId.id)}
                        onSelect={(selected) => handleFieldSelect(EntityId.id, selected)}
                        filterEnabled={filterEnabledFields.has(EntityId.id)}
                        onFilterToggle={(enabled) => handleFilterToggle(EntityId.id, enabled)}
                        isLoading={isPending}
                      />
                      <EntityCik
                        value={fieldValues[EntityCik.id] || ''}
                        onChange={(value) => handleFieldChange(EntityCik.id, value)}
                        enabled={enabledFields.has(EntityCik.id)}
                        selected={selectedFields.has(EntityCik.id)}
                        onSelect={(selected) => handleFieldSelect(EntityCik.id, selected)}
                        filterEnabled={filterEnabledFields.has(EntityCik.id)}
                        onFilterToggle={(enabled) => handleFilterToggle(EntityCik.id, enabled)}
                        isLoading={isPending}
                      />
                      <EntityTicker
                        value={fieldValues[EntityTicker.id] || ''}
                        onChange={(value) => handleFieldChange(EntityTicker.id, value)}
                        enabled={enabledFields.has(EntityTicker.id)}
                        selected={selectedFields.has(EntityTicker.id)}
                        onSelect={(selected) => handleFieldSelect(EntityTicker.id, selected)}
                        filterEnabled={filterEnabledFields.has(EntityTicker.id)}
                        onFilterToggle={(enabled) => handleFilterToggle(EntityTicker.id, enabled)}
                        isLoading={isPending}
                      />
                    </div>
                  </FactQuery>
                </FormControl>
                <FormDescription>
                  Choose the XBRL API endpoint to query
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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

              <div className="mt-6 flex justify-end gap-4">
                <Button 
                  type="submit"
                  disabled={query.isLoading || !user?.accessToken}
                >
                  {query.isLoading ? 'Loading...' : 'Run Query'}
                </Button>
              </div>

              {query.isError && (
                <div className="mt-4 text-red-500">
                  Error: {(query.error as Error).message}
                </div>
              )}

              {query.data && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-medium text-gray-700">Query Results</h4>
                  <pre className="text-sm bg-gray-50 p-3 rounded border overflow-x-auto">
                    {JSON.stringify(query.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default QueryBuilder;