import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { T } from '@/components/ui/Typography';
import { getAllBooths } from '@/data/anon/booths';
import { PlusCircle, Store } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { BoothsList } from '../../BoothsList';

export const dynamic = 'force-dynamic';

function BoothItemsListSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-full mb-2" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

async function BoothItemsListWrapper() {
  const booths = await getAllBooths();
  return <BoothsList booths={booths} />;
}

export default function BoothItemsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <T.H1>Booth Items</T.H1>
          <Badge variant="outline" className="h-6 flex items-center gap-1">
            <Store className="h-3 w-3" /> Bazaar
          </Badge>
        </div>
        <Link href="/dashboard/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> New Booth Item
          </Button>
        </Link>
      </div>

      <T.Subtle className="mb-4">
        Browse all items available at your booth
      </T.Subtle>

      <Suspense fallback={<BoothItemsListSkeleton />}>
        <BoothItemsListWrapper />
      </Suspense>
    </div>
  );
}
