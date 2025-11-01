import { getBooth } from '@/data/anon/booths';
import { getTransaction } from '@/data/anon/transactions';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import BoothSaleQR from './BoothSaleQR';
import BoothSaleQRSkeleton from './BoothSaleQRSkeleton';
import PaymentItemsList from './PaymentItemsList';
import PaymentItemsListSkeleton from './PaymentItemsListSkeleton';

export const dynamic = 'force-dynamic';

async function TransactionPageContent({ transactionId }: { transactionId: string }) {
  const transaction = await getTransaction(transactionId);
  const booth = await getBooth(transaction.booth_id)

  if (!transaction) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 space-y-12">
      <BoothSaleQR
        paymentDest={booth.payment_dest}
        status={transaction.status}
        transactionId={transaction.id}
        refNumber={transaction.bank_transaction_id}
        amount={transaction.amount}
      />

      <Suspense fallback={<PaymentItemsListSkeleton />}>
        <PaymentItemsList
          lineItems={transaction.line_items}
          total={transaction.amount}
        />
      </Suspense>
    </div>
  );
}

export default async function TransactionPage(props: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = await props.params;

  return (
    <Suspense fallback={<BoothSaleQRSkeleton />}>
      <TransactionPageContent transactionId={transactionId} />
    </Suspense>
  );
}
