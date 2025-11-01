'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { T } from '@/components/ui/Typography';

interface LineItem {
  item_id: string;
  quantity: number;
  price: number;
}

interface PaymentItemsListProps {
  lineItems: LineItem[] | any; // because Supabase stores JSON
  total: number;
}

export default function PaymentItemsList({ lineItems, total }: PaymentItemsListProps) {
  if (!lineItems || lineItems.length === 0) {
    return null;
  }

  return (
    <Card className="w-full shadow-sm border-muted/40">
      <CardHeader>
        <T.H4 className="mt-0">Order Details</T.H4>
      </CardHeader>

      <Separator />

      <CardContent className="divide-y divide-muted/30 py-4">
        {lineItems.map((item: any) => (
          <div
            key={item.item_id}
            className="flex justify-between items-center py-3 text-sm"
          >
            <div>
              <T.P className="font-medium">{item.name ?? 'Item'}</T.P>
              <T.Small className="text-muted-foreground">
                {item.quantity} × ${item.price.toFixed(2)}
              </T.Small>
            </div>
            <T.P className="font-medium">
              ${(item.quantity * item.price).toFixed(2)}
            </T.P>
          </div>
        ))}
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-between items-center py-8">
        <T.H4 className="mt-0">Total</T.H4>
        <T.H4 className="mt-0">${total.toFixed(2)}</T.H4>
      </CardFooter>
    </Card>
  );
}
