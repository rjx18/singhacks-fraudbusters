import { getBooth } from '@/data/anon/booths';
import { notFound } from 'next/navigation';
import BoothOverview from './BoothOverview';
import BoothSalesSection from './BoothSaleSection';

export default async function BoothPage(props: {
  params: Promise<{
    boothId: string;
  }>;
}) {
  const params = await props.params;
  const { boothId } = params;

  const booth = await getBooth(boothId);

  if (!booth) return notFound();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Booth Overview (left on large screens) */}
        <div className="lg:w-1/3">
          <BoothOverview boothId={booth.id} booth={booth} />
        </div>

        {/* Sales Section (right on large screens) */}
        <div className="lg:flex-1">
          <BoothSalesSection boothId={booth.id} />
        </div>
      </div>
    </div>
  );
}
