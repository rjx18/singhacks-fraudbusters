// Server Component: fetches data on the server
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { T } from '@/components/ui/Typography';
import { getBoothItems } from '@/data/anon/boothItems';
import { PlusCircle } from 'lucide-react';
import AddBoothItemDialog from './AddBoothItemDialog';

export default async function BoothItemsSection({ boothId }: { boothId: string }) {
  const items = await getBoothItems(boothId);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <T.H3>Booth Items</T.H3>
        <AddBoothItemDialog boothId={boothId}>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Add Item
          </Button>
        </AddBoothItemDialog>
      </div>

      <Card className="shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length ? (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>${item.price?.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString()
                      : '-'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export function BoothItemsSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-4" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}