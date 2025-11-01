import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function BoothSalesListSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-3 py-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between items-center py-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </CardFooter>
    </Card>
  );
}
