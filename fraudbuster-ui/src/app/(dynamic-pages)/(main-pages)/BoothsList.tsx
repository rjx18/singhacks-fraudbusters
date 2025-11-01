import { T } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Table as TableType } from '@/types';
import { Clock, ExternalLink, PlusCircle, Store } from 'lucide-react';
import Link from 'next/link';

interface BoothsListProps {
  booths: TableType<'booths'>[];
  showActions?: boolean;
}

export const BoothsList = ({
  booths,
  showActions = true,
}: BoothsListProps) => {
  return (
    <div className="space-y-8">
      {showActions && (
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <T.H2>Booths</T.H2>
              <Badge variant="outline" className="h-6 flex items-center gap-1">
                <Store className="h-3 w-3" /> Active
              </Badge>
            </div>
            <T.Subtle>Manage all your active booths here</T.Subtle>
          </div>
          <Link href="/dashboard/new">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> New Booth
            </Button>
          </Link>
        </div>
      )}

      {booths.length ? (
        <Card className="shadow-sm border-muted/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Created At
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {booths.map((booth) => (
                <TableRow key={booth.id}>
                  <TableCell className="font-medium">{booth.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    hi
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {booth.created_at ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(booth.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/booth/${booth.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Store />
            </EmptyMedia>
            <EmptyTitle>No Booths Available</EmptyTitle>
            <EmptyDescription>
              You haven’t created any booths yet. Create one to start tracking
              your items and transactions.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/dashboard/new">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Create Your First Booth
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
};
