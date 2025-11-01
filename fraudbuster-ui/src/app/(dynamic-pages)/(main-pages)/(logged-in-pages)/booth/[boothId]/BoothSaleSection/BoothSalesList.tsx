'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { T } from '@/components/ui/Typography';
import { insertTransactionAction } from '@/data/user/transactions';
import { Tables } from '@/lib/database.types';
import { cn } from '@/lib/utils';
import { Banknote, Minus, Plus, QrCode } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

interface BoothSalesListProps {
  booth: Tables<'booths'>;
  boothItems: Array<Tables<'booth_items'>>;
}

export default function BoothSalesList({ booth, boothItems }: BoothSalesListProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const { id: boothId, payment_dest: paymentDest } = booth

  const handleAdd = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleRemove = (id: string) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const lineItems = useMemo(() => {
    return boothItems
      .filter((item) => quantities[item.id])
      .map((item) => ({
        item_id: item.id,
        name: item.name,
        price: item.price || 0,
        quantity: quantities[item.id],
      }));
  }, [quantities, boothItems]);

  const total = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [lineItems]);

  const { execute } = useAction(insertTransactionAction, {
    onSuccess: ({ data }) => {
      toast.success('Transaction created successfully!');
      setIsCreating(false);
      router.push(`/tx/${data}`); // ✅ Redirect
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Failed to create transaction');
      setIsCreating(false);
    },
  });

  const handleGenerateQR = async () => {
    if (total === 0) return toast.error('Please add at least one item');

    setIsCreating(true);
    const ref = `JTC-${Date.now()}`;

    const transactionPayload = {
      booth_id: boothId,
      amount: total,
      bank_transaction_id: ref,
      line_items: lineItems
    };

    execute(transactionPayload);
  };

  return (
    <Card className="shadow-sm border-muted/40">
      <CardContent className="divide-y divide-muted/40">
        {boothItems.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No items available for sale.
          </div>
        ) : (
          boothItems.map((item) => {
            const qty = quantities[item.id] || 0;
            return (
              <div key={item.id} className="flex justify-between items-center py-3">
                <div>
                  <T.P className="font-medium">{item.name}</T.P>
                  <T.Small className="text-muted-foreground">
                    ${item.price?.toFixed(2)}
                  </T.Small>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleRemove(item.id)}
                    disabled={qty === 0}
                    className={cn('w-8 h-8', qty === 0 && 'opacity-50')}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-6 text-center">{qty}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleAdd(item.id)}
                    className="w-8 h-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>

      <Separator />
      <CardFooter className="flex flex-col justify-between items-center gap-3 py-4">
        <div className="flex-1 flex justify-between w-full">
          <T.H4 className="mt-0">Total</T.H4>
          <T.H4 className="mt-0">${total.toFixed(2)}</T.H4>
        </div>

        {paymentDest ? (
          <Button
            onClick={handleGenerateQR}
            disabled={total === 0 || isCreating}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <QrCode className="h-4 w-4" />
            {isCreating ? 'Submitting...' : 'Generate Payment QR'}
          </Button>
        ) : (
          <Button
            asChild
            className="flex items-center bg-red-700 hover:bg-red-800 gap-2 w-full sm:w-auto text-white"
          >
            <Link href={`/booth/${boothId}/details`}>
              <Banknote className="h-4 w-4" />
              Add PayNow number to proceed
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
