import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function BoothSaleQRSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <Card className="w-full max-w-md shadow-md border-muted/40">
        <CardHeader>
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>

        <Separator />
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <Skeleton className="h-56 w-56 rounded-lg" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>

        <Separator />
        <CardFooter className="flex gap-3 justify-center">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-10 w-1/2" />
        </CardFooter>
      </Card>
    </div>
  );
}
