'use client';

import PaynowQR from '@/components/paynowqr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { T } from '@/components/ui/Typography';
import { updateTransactionAction } from '@/data/user/transactions';
import { PaymentStatus } from '@/lib/database.types';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  CheckCircle2,
  CircleXIcon,
  Clock,
  DollarSign,
  XCircle,
} from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

interface BoothSaleQRProps {
  status: PaymentStatus;
  paymentDest: string | null;
  transactionId: string;
  refNumber: string | null;
  amount: number;
}

export default function BoothSaleQR({
  status,
  paymentDest,
  transactionId,
  refNumber,
  amount,
}: BoothSaleQRProps) {
  const router = useRouter();

  // ✅ Actions for update + automatic revalidation via server
  const { execute: updateStatus, status: actionStatus } = useAction(
    updateTransactionAction,
    {
      onSuccess: () => {
        toast.success('Transaction updated successfully');
        router.refresh(); // 🔹 Trigger revalidation
      },
      onError: ({ error }) => {
        toast.error(error.serverError ?? 'Failed to update transaction');
      },
    }
  );

  const handleCancel = () => {
    updateStatus({ id: transactionId, status: PaymentStatus.CANCELLED });
  };

  const handleConfirm = () => {
    updateStatus({ id: transactionId, status: PaymentStatus.CONFIRMED });
  };

  // 🔹 Header label and icon styles based on payment status
  const headerData = {
    [PaymentStatus.PENDING]: {
      label: 'Pending Payment',
      color: 'text-yellow-600',
      bg: 'bg-yellow-100/60',
      icon: <Clock className="h-5 w-5 text-yellow-600" />,
    },
    [PaymentStatus.CONFIRMED]: {
      label: 'Payment Confirmed',
      color: 'text-green-700',
      bg: 'bg-green-100/60',
      icon: <CheckCircle2 className="h-5 w-5 text-green-700" />,
    },
    [PaymentStatus.CANCELLED]: {
      label: 'Payment Cancelled',
      color: 'text-red-700',
      bg: 'bg-red-100/60',
      icon: <XCircle className="h-5 w-5 text-red-700" />,
    },
  }[status];

  const qrcode =
    status === PaymentStatus.PENDING
      ? new PaynowQR({
        mobile: paymentDest || '',
        amount,
        editable: true,
        refNumber: refNumber || '',
      })
      : null;

  return (
    <Card className="max-w-sm mx-auto text-center shadow-md border-muted/40">
      <CardHeader>
        <div
          className={cn(
            'flex items-center justify-center gap-2 px-3 py-1.5 rounded-md font-medium w-fit mx-auto',
            headerData.bg,
            headerData.color
          )}
        >
          {headerData.icon}
          <span>{headerData.label}</span>
        </div>

        <div className="mt-3 text-center">
          <T.Subtle>Transaction ID:</T.Subtle>
          <p className="text-muted-foreground font-mono break-all">
            {transactionId}
          </p>
        </div>
      </CardHeader>

      {status === PaymentStatus.PENDING ? (
        <>
          <CardContent className="flex flex-col items-center space-y-4">
            <QRCodeSVG
              value={qrcode?.output() ?? ''}
              size={220}
              includeMargin
              className="border border-muted rounded-md p-2 bg-white"
            />

            <div>
              <T.H4 className="flex items-center justify-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                {amount.toFixed(2)}
              </T.H4>
              <T.Small className="text-muted-foreground">
                Ref: {refNumber}
              </T.Small>
            </div>

            <p className="text-sm text-muted-foreground mt-2 px-16">
              Please confirm that the PayNow transaction has been received.
            </p>
          </CardContent>

          <CardFooter className="flex justify-between gap-3 pt-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleCancel}
              disabled={actionStatus === 'executing'}
            >
              <CircleXIcon className="h-4 w-4" />
              Cancel Payment
            </Button>

            <Button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              onClick={handleConfirm}
              disabled={actionStatus === 'executing'}
            >
              <CheckCircle2 className="h-4 w-4" />
              Received Payment
            </Button>
          </CardFooter>
        </>
      ) : (
        <CardContent className="py-12 flex flex-col items-center">
          {status === PaymentStatus.CONFIRMED ? (
            <>
              <CheckCircle2 className="h-20 w-20 text-green-600 mb-3" />
              <T.H3>Payment Received</T.H3>
              <T.P className="text-muted-foreground mt-1">
                This transaction has been confirmed.
              </T.P>
            </>
          ) : (
            <>
              <XCircle className="h-20 w-20 text-red-600 mb-3" />
              <T.H3>Payment Cancelled</T.H3>
              <T.P className="text-muted-foreground mt-1">
                This transaction has been cancelled.
              </T.P>
            </>
          )}

          <T.Small className="text-muted-foreground font-mono mt-2">
            Ref: {refNumber}
          </T.Small>

          <Button
            variant="outline"
            className="mt-6 flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
