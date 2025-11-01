'use client';

import { Check, ChevronLeft, Pencil, Store, Wallet, X } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { T } from '@/components/ui/Typography';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { updateBoothAction } from '@/data/user/booths';
import { Tables } from '@/lib/database.types';
import { cn } from '@/lib/utils';

// 🔹 Inline Editable Field
function EditableField({
  label,
  value,
  field,
  boothId,
}: {
  label: string;
  value: string;
  field: 'name' | 'payment_dest';
  boothId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const { execute, status } = useAction(updateBoothAction, {
    onSuccess: () => {
      toast.success(`${label} updated successfully`);
      setIsEditing(false);
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? `Failed to update ${label}`);
    },
  });

  const handleSave = () => {
    if (newValue === value) {
      setIsEditing(false);
      return;
    }
    execute({ id: boothId, [field]: newValue });
  };

  const handleCancel = () => {
    setNewValue(value);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-1">
      <T.Small className="text-muted-foreground">{label}</T.Small>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="h-8 text-sm"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSave}
            disabled={status === 'executing'}
            className={cn(
              'h-8 w-8 text-green-600 hover:text-green-700',
              status === 'executing' && 'opacity-50 pointer-events-none'
            )}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCancel}
            className="h-8 w-8 text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <T.P className="font-medium">{value || '—'}</T.P>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function BoothDetails({ booth }: { booth: Tables<'booths'> }) {
  return (
    <Card className="shadow-md overflow-hidden border-muted/40">
      <div className="flex flex-col lg:flex-row">
        {/* 🖼 Left Side — Image */}
        <div className="relative w-full h-30 lg:h-[initial] lg:w-1/2 aspect-square bg-muted">
          <Image
            src="/images/placeholder-booth.png"
            alt={`${booth.name} banner`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 🧾 Right Side — Content */}
        <div className="flex flex-col flex-1 justify-between">
          <CardContent className="flex flex-col gap-5 p-6">
            {/* 🏷 Booth Name */}
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <EditableField
                label="Booth Name"
                value={booth.name}
                field="name"
                boothId={booth.id}
              />
            </div>

            {/* 💰 PayNow Number */}
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <EditableField
                label="PayNow Number"
                value={booth.payment_dest || ''}
                field="payment_dest"
                boothId={booth.id}
              />
            </div>
          </CardContent>

          <div>
            <Separator />

            <CardFooter className="flex justify-between items-center pt-4">
              <ButtonGroup className="w-full justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/booth/${booth.id}`}>
                    <ChevronLeft />
                    Back to booth
                  </Link>
                </Button>
              </ButtonGroup>
            </CardFooter>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function BoothDetailsSkeleton() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 pt-5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-72" />
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Skeleton className="h-10 w-40" />
      </CardFooter>
    </Card>
  );
}
