'use client';

import { T } from '@/components/ui/Typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tables } from '@/lib/database.types';
import { Coins, Pencil, Store } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BoothOverviewProps {
  boothId: string;
  booth: Tables<'booths'>;
}

export default function BoothOverview({ boothId, booth }: BoothOverviewProps) {
  return (
    <Card className="shadow-sm border-muted/40 overflow-hidden">
      {/* 🔹 Header Image */}
      <CardHeader className="p-0">
        <div className="relative w-full h-30 lg:h-[initial] lg:aspect-square bg-muted">
          <Image
            src={'/images/placeholder-booth.png'}
            alt={`${booth.name} banner`}
            fill
            className="object-cover"
            priority
          />
          {/* subtle overlay for contrast */}
          <div className="absolute inset-0" />
        </div>
      </CardHeader>

      {/* 🔹 Booth Details */}
      <CardContent className="flex flex-col gap-4 p-6 justify-center items-center">
        <div className="flex items-center gap-2 justify-center">
          <Store className="h-5 w-5 text-primary" />
          <T.H4 className="mt-0 leading-none">{booth.name}</T.H4>
        </div>

        <div className="flex flex-col space-y-2 items-center">

          <Link href={`/booth/${boothId}/transactions`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Coins className="h-4 w-4" />
              View Transactions
            </Button>
          </Link>

          <Link href={`/booth/${boothId}/details`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Pencil className="h-4 w-4" />
              Edit Booth
            </Button>
          </Link>
        </div>

      </CardContent>

    </Card>
  );
}
