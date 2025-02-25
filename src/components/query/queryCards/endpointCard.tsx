import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/Card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";



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


