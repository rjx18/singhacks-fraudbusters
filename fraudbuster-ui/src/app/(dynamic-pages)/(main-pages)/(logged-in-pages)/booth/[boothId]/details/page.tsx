import { getBooth } from '@/data/anon/booths';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import BoothDetails, { BoothDetailsSkeleton } from './BoothDetails';
import BoothItemsSection, { BoothItemsSkeleton } from './BoothItemsSection';

export default async function BoothDetailsPage(props: {
  params: Promise<{
    boothId: string;
  }>;
}) {
  const params = await props.params;
  const { boothId } = params;

  const booth = await getBooth(boothId);

  if (!booth) return notFound();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto w-full">
      <Suspense fallback={<BoothDetailsSkeleton />}>
        <BoothDetails booth={booth} />
      </Suspense>

      <Suspense fallback={<BoothItemsSkeleton />}>
        <BoothItemsSection boothId={booth.id} />
      </Suspense>
    </div>
  );
}