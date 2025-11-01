import { getBoothTransactions } from '@/data/anon/transactions';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import TransactionList from './TransactionList';
import TransactionListSkeleton from './TransactionListSkeleton';

export default async function BoothTransactionsPage(props: {
  params: Promise<{ boothId: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { boothId } = params;
  const page = Number(searchParams?.page || 1);

  const { transactions, totalCount } = await getBoothTransactions(boothId, page);

  if (!transactions) return notFound();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <Suspense fallback={<TransactionListSkeleton />}>
        <TransactionList
          transactions={transactions}
          totalCount={totalCount}
          page={page}
        />
      </Suspense>
    </div>
  );
}