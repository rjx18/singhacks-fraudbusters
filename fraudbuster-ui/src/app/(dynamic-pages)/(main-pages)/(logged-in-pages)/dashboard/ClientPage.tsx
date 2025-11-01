'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { T } from '@/components/ui/Typography';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { insertBoothAction } from '@/data/user/booths';
import { Store } from 'lucide-react';

// ✅ Schema includes both fields
const formSchema = z.object({
  name: z.string().min(1, 'Booth name is required'),
  payment_dest: z
    .string()
    .min(1, 'PayNow number is required')
    .max(50, 'Too long'),
});

type FormData = z.infer<typeof formSchema>;

const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const CreateBoothForm: React.FC = () => {
  const router = useRouter();
  const toastRef = useRef<string | number | undefined>(undefined);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      payment_dest: '',
    },
  });

  const { execute, status } = useAction(insertBoothAction, {
    onExecute: () => {
      toastRef.current = toast.loading('Creating booth...');
    },
    onSuccess: ({ data }) => {
      toast.success('Booth created successfully', { id: toastRef.current });
      toastRef.current = undefined;
      router.refresh();
      if (data) {
        router.push(`/booth/${data}`);
      }
    },
    onError: ({ error }) => {
      const errorMessage = error.serverError ?? 'Failed to create booth';
      toast.error(errorMessage, { id: toastRef.current });
      toastRef.current = undefined;
    },
  });

  const onSubmit = (data: FormData) => {
    execute(data);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="container max-w-2xl mx-auto py-6"
    >
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <CardTitle>
              <T.H2>Create Booth</T.H2>
            </CardTitle>
          </div>
          <CardDescription>
            Create a new booth to start adding items and tracking transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Booth Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booth Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter booth name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 🆕 PayNow Number */}
              <FormField
                control={form.control}
                name="payment_dest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PayNow Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter PayNow number or UEN"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                className="w-full flex items-center justify-center gap-2"
                type="submit"
                disabled={status === 'executing' || !form.formState.isValid}
              >
                {status === 'executing' ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    <span>Creating Booth...</span>
                  </>
                ) : (
                  'Create Booth'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
