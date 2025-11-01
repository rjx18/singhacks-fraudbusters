import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TransactionListSkeleton() {
  return (
    <Card className="shadow-sm border-muted/40">
      <CardContent className="p-4 space-y-3">
        {/* Desktop header */}
        <div className="hidden lg:flex justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Rows */}
        <div className="space-y-2 mt-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="border-b border-muted/20 py-3 flex justify-between items-center"
              >
                {/* Mobile layout */}
                <div className="flex flex-col lg:hidden">
                  <Skeleton className="h-4 w-28 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-5 w-20 lg:hidden" />

                {/* Desktop layout */}
                <div className="hidden lg:grid grid-cols-5 gap-4 w-full">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16 justify-self-end" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
