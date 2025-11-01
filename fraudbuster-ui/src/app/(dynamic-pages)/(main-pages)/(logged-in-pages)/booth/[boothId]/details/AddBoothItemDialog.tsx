'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { insertBoothItemAction } from '@/data/user/boothItems';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

export default function AddBoothItemDialog({
  boothId,
  children,
}: {
  boothId: string;
  children: ReactNode; // the trigger button
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const toastRef = useRef<string | number | undefined>(undefined);
  const router = useRouter();

  const { execute, status } = useAction(insertBoothItemAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Adding item...');
    },
    onSuccess: () => {
      toast.success('Item added successfully!', { id: toastRef.current });
      toastRef.current = undefined;
      setOpen(false);
      router.refresh(); // ✅ immediately re-render server component with fresh data
    },
    onError: ({ error }) => {
      const message = error.serverError ?? 'Failed to add item';
      toast.error(message, { id: toastRef.current });
      toastRef.current = undefined;
    },
  });

  const handleAdd = () => {
    if (!name || !price) return toast.error('Please fill all fields');
    execute({
      booth_id: boothId,
      name,
      price: typeof price === 'string' ? parseFloat(price) : price,
    });
  };

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add Booth Item</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Item name"
                />
              </div>
              <div>
                <Label htmlFor="price">Price (SGD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAdd}
                disabled={status === 'executing'}
                className="flex items-center gap-2"
              >
                {status === 'executing' ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    <span>Adding...</span>
                  </>
                ) : (
                  'Add Item'
                )}
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
