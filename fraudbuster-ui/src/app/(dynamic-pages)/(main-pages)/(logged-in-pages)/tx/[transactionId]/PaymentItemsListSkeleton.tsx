import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function PaymentItemsListSkeleton() {
  return (
    <Card className="w-full shadow-sm border-muted/40">
      <CardHeader>
        <Skeleton className="h-5 w-32" />
      </CardHeader>

      <Separator />

      <CardContent className="space-y-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-3 border-b border-muted/20"
            >
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between items-center py-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </CardFooter>
    </Card>
  );
}
