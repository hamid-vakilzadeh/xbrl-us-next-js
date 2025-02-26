'use client'
import React, { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useSearchFacts, useUserLimit, type FactSearchParams, type FactData } from '@/api/facts';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useQueryClient } from '@tanstack/react-query';

const EXAMPLE_QUERIES = {
  'CIK 2024 Facts': {
    filters: {
      'period.fiscal-year': 2024,
      'entity.cik': '0000320193',
      'fact.has-dimensions': 'false'
    },
    fields: [
      'fact.value',
      'concept.balance-type',
      'footnote.id',
      'concept.local-name',
      'entity.name'
    ]
  },
  'Basic Assets Query': {
    filters: {
      'entity.cik': '0001138723',
      'concept.local-name': 'Assets',
      'period.fiscal-period': 'Y',
      'period.fiscal-year': ['2016', '2015', '2014']
    },
    fields: ['fact.*']
  },
  'Extended Facts Query': {
    filters: {
      'report.id': '177604',
      'fact.is-extended': true,
      'fact.has-dimensions': false,
      'period.fiscal-period': 'Y',
      'period.fiscal-year': ['2016', '2015', '2014']
    },
    fields: ['fact.*']
  },
  'Complex Cash Query': {
    filters: {
      'entity.cik': '0001138723',
      'aspect.CashAndCashEquivalentsAxis': 'MoneyMarketFundsMember',
      'aspect.FairValueByFairValueHierarchyLevelAxis': 'FairValueInputsLevel1Member',
      'concept.local-name': ['CashAndCashEquivalentsAtCarryingValue', 'Assets']
    },
    fields: [
      'report.id', 'entity.id', 'fact.decimals', 'fact.value', 'unit',
      'entity.cik', 'report.filing-date', 'concept.local-name',
      'fact.ultimus-index', 'fact.id', 'dimensions', 'dimensions.count'
    ]
  },
  'Hash Query': {
    filters: {
      'fact.hash': '\\x809b4eca538e780e9579069b8e02a1b13e0238de3ba159eeb1f23c1b'
    },
    fields: ['fact.*']
  },
  'myFact Query': {
    filters: {
      'entity.cik': '0000320193',
      'fact.has-dimensions': 'false'
    },
    fields: [
      'fact.value',
      'concept.balance-type',
      'footnote.id',
      'concept.local-name',
      'entity.name'
    ]
    },
};

export default function QueryPage() {
  const { user } = useAuth();
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  
  // Get the user's limit with proper typing
  const { data: userLimit } = useUserLimit(user?.accessToken || '');
  const limit = userLimit ? Math.min(5000, userLimit) : 100; // Use detected limit with fallback

  const queryClient = useQueryClient();

  const queryParams: FactSearchParams | undefined = selectedQuery ? {
    endpoint: 'fact/search',
    filters: EXAMPLE_QUERIES[selectedQuery as keyof typeof EXAMPLE_QUERIES].filters,
    fields: EXAMPLE_QUERIES[selectedQuery as keyof typeof EXAMPLE_QUERIES].fields,
    limit,
    offset
  } : undefined;

  const { data: response, isLoading, error } = useSearchFacts(
    user?.accessToken || '',
    queryParams as FactSearchParams,
    {
      enabled: !!user?.accessToken && !!selectedQuery
    }
  );

  const handleQuerySelect = (queryName: string) => {
    setOffset(0);
    setSelectedQuery(queryName);
  };

  const handleNextPage = () => {
    if (response && response.paging.count === limit) {
      setOffset(prev => prev + limit);
    }
  };

  const handlePrevPage = () => {
    setOffset(prev => Math.max(0, prev - limit));
  };

  // Add function to handle query cancellation
  const handleCancelQuery = () => {
    queryClient.cancelQueries({ queryKey: ['facts', 'search', queryParams] });
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">XBRL Facts API Test Interface</h1>
      
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {Object.keys(EXAMPLE_QUERIES).map((queryName) => (
            <Button
              key={queryName}
              onClick={() => handleQuerySelect(queryName)}
              disabled={isLoading}
              variant={selectedQuery === queryName ? "default" : "outline"}
            >
              {queryName}
            </Button>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center gap-2">
            <div>Loading...</div>
            <Button 
              onClick={handleCancelQuery}
              variant="destructive"
              size="sm"
            >
              Cancel Query
            </Button>
          </div>
        )}
        
        {error && (
          <Card className="p-4 bg-red-50 text-red-700">
            {error instanceof Error ? error.message : 'An error occurred'}
          </Card>
        )}

        {response && (
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-2">Response</h2>
            <div className="space-y-2">
              <div>
                <strong>Count:</strong> {response.paging.count}
              </div>
              <div>
                <strong>Showing:</strong> {' '}
                {response.data.length > 0 
                  ? `${offset + 1} - ${offset + response.data.length}`
                  : '0 results'
                }
              </div>
              <div>
                <strong>Current Offset:</strong> {response.paging.offset}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handlePrevPage} 
                  disabled={offset === 0 || isLoading}
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleNextPage} 
                  disabled={response.paging.count < limit || isLoading}
                >
                  Next
                </Button>
              </div>
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-[500px]">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}