import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to XBRL Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a placeholder content area. The main dashboard content will be rendered here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}