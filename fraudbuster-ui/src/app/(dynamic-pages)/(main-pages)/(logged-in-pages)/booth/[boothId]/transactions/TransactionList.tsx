'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PaymentStatus, Tables } from '@/lib/database.types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface TransactionListProps {
  transactions: Tables<'transactions'>[];
  totalCount: number;
  page: number;
}

export default function TransactionList({
  transactions,
  totalCount,
  page,
}: TransactionListProps) {
  const router = useRouter();
  const params = useSearchParams();

  const getStatusDisplay = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.CONFIRMED:
        return {
          label: 'Confirmed',
          color: 'bg-green-100 text-green-700',
          icon: <CheckCircle2 className="h-4 w-4" />,
        };
      case PaymentStatus.CANCELLED:
        return {
          label: 'Cancelled',
          color: 'bg-red-100 text-red-700',
          icon: <XCircle className="h-4 w-4" />,
        };
      default:
        return {
          label: 'Pending',
          color: 'bg-yellow-100 text-yellow-700',
          icon: <Clock className="h-4 w-4" />,
        };
    }
  };

  const totalPages = Math.ceil(totalCount / 20);

  const handlePageChange = (newPage: number) => {
    const searchParams = new URLSearchParams(params.toString());
    searchParams.set('page', newPage.toString());
    router.push(`?${searchParams.toString()}`);
  };

  return (
    <Card className="shadow-sm border-muted/40">
      <CardContent className="p-4">
        {transactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No transactions found.
          </div>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead className="text-left text-muted-foreground border-b hidden lg:table-header-group">
              <tr>
                <th className="py-4 px-3">Transaction ID</th>
                <th className="py-4 px-3">Bank Ref</th>
                <th className="py-4 px-3 text-right">Amount</th>
                <th className="py-4 px-3">Time</th>
                <th className="py-4 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const status = getStatusDisplay(tx.status as PaymentStatus);
                return (
                  <tr
                    key={tx.id}
                    onClick={() => router.push(`/tx/${tx.id}`)}
                    className="cursor-pointer border-b hover:bg-muted/50 transition-colors"
                  >
                    {/* ✅ Compact layout (mobile) */}
                    <td className="py-4 px-3 font-mono lg:hidden">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{tx.id.slice(0, 8)}...</p>
                          <p className="text-muted-foreground text-xs">
                            ${tx.amount.toFixed(2)}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            'flex items-center gap-1',
                            status.color
                          )}
                        >
                          {status.icon}
                          {status.label}
                        </Badge>
                      </div>
                    </td>

                    {/* 🖥️ Full layout (lg and up) */}
                    <td className="py-4 px-3 font-mono hidden lg:table-cell">
                      {tx.id.slice(0, 8)}...
                    </td>
                    <td className="py-4 px-3 text-muted-foreground hidden lg:table-cell">
                      {tx.bank_transaction_id || '—'}
                    </td>
                    <td className="py-4 px-3 text-right font-medium hidden lg:table-cell">
                      ${tx.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-3 hidden lg:table-cell">
                      {tx.created_at
                        ? new Date(tx.created_at).toLocaleString()
                        : '—'}
                    </td>
                    <td className="py-4 px-3 hidden lg:table-cell">
                      <Badge
                        variant="outline"
                        className={cn(
                          'flex items-center gap-1 w-fit',
                          status.color
                        )}
                      >
                        {status.icon}
                        {status.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardContent>

      {/* 🔹 Pagination Bar */}
      {totalPages > 1 && (
        <CardFooter className="flex justify-between items-center py-3 px-4 border-t text-sm text-muted-foreground">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="disabled:opacity-50 disabled:pointer-events-none hover:text-foreground"
          >
            ← Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="disabled:opacity-50 disabled:pointer-events-none hover:text-foreground"
          >
            Next →
          </button>
        </CardFooter>
      )}
    </Card>
  );
}
