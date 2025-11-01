import { getBoothItems } from '@/data/anon/boothItems';
import { getBooth } from '@/data/anon/booths';
import { Suspense } from 'react';
import BoothSalesList from './BoothSalesList';
import BoothSalesListSkeleton from './BoothSalesListSkeleton';

export default async function BoothSalesSection({ boothId }: { boothId: string }) {
  const boothItems = await getBoothItems(boothId);
  const booth = await getBooth(boothId);

  return (
    <div className="space-y-6">
      <Suspense fallback={<BoothSalesListSkeleton />}>
        <BoothSalesList booth={booth} boothItems={boothItems} />
      </Suspense>
    </div>
  );
}