import { Json, PaymentStatus, Tables } from '@/lib/database.types';
import { AppSupabaseClient } from '@/types';
import { Effect } from 'effect';
import { DatabaseError, NotFoundError } from './effect-errors';

interface SupabaseError {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
}

/**
 * Maps Supabase errors to typed Effect errors
 */
function mapSupabaseError(error: unknown): DatabaseError | NotFoundError {
  const supabaseError = error as SupabaseError;
  // Check if it's a not found error
  if (
    supabaseError.code === 'PGRST116' ||
    supabaseError.message?.includes('not found')
  ) {
    return new NotFoundError({
      message: supabaseError.message || 'Resource not found',
      resource: 'unknown',
    });
  }

  // Default to DatabaseError
  return new DatabaseError({
    message: supabaseError.message || 'Database operation failed',
    code: supabaseError.code,
    details: supabaseError.details,
    hint: supabaseError.hint,
  });
}

export function getAllBoothItemsEffect(
  supabase: AppSupabaseClient
): Effect.Effect<Array<Tables<'booth_items'>>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase.from('booth_items').select('*');

      if (error) {
        throw error;
      }

      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Get a single booth item by ID
 */
export function getBoothItemEffect(
  supabase: AppSupabaseClient,
  id: string
): Effect.Effect<Tables<'booth_items'>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase
        .from('booth_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Delete a booth item by ID
 */
export function deleteBoothItemEffect(
  supabase: AppSupabaseClient,
  id: string
): Effect.Effect<boolean, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { error } = await supabase
        .from('booth_items')
        .delete()
        .match({ id });

      if (error) throw error;
      return true;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Insert a new booth item
 */
export function insertBoothItemEffect(
  supabase: AppSupabaseClient,
  item: {
    booth_id: string;
    name: string;
    price: number;
  }
): Effect.Effect<Tables<'booth_items'>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase
        .from('booth_items')
        .insert(item)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Get all booths
 */
export function getAllBoothsEffect(
  supabase: AppSupabaseClient
): Effect.Effect<Array<Tables<'booths'>>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase.from('booths').select('*');

      if (error) {
        throw error;
      }

      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Get a single booth by ID
 */
export function getBoothEffect(
  supabase: AppSupabaseClient,
  id: string
): Effect.Effect<Tables<'booths'>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase
        .from('booths')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Delete a booth by ID
 */
export function deleteBoothEffect(
  supabase: AppSupabaseClient,
  id: string
): Effect.Effect<boolean, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { error } = await supabase.from('booths').delete().match({ id });

      if (error) throw error;
      return true;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Insert a new booth and add the current user as a member (1-to-many mapping).
 */
export function insertBoothEffect(
  supabase: AppSupabaseClient,
  booth: { name: string; payment_dest: string }
): Effect.Effect<Tables<'booths'>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      const { data: boothData, error: boothError } = await supabase
        .from('booths')
        .insert({
          name: booth.name,
          owner_id: user.id,
          payment_dest: booth.payment_dest
        })
        .select('*')
        .single();

      if (boothError) throw boothError;

      return boothData;
    },
    catch: (error) => mapSupabaseError(error),
  });
}


/**
 * Get all transactions
 */
export function getAllTransactionsEffect(
  supabase: AppSupabaseClient
): Effect.Effect<Array<Tables<'transactions'>>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase.from('transactions').select('*');

      if (error) {
        throw error;
      }

      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Get a single transaction by ID
 */
export function getTransactionEffect(
  supabase: AppSupabaseClient,
  id: string
): Effect.Effect<Tables<'transactions'>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Delete a transaction by ID
 */
export function deleteTransactionEffect(
  supabase: AppSupabaseClient,
  id: string
): Effect.Effect<boolean, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .match({ id });

      if (error) throw error;
      return true;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

/**
 * Insert a new transaction
 */
export function insertTransactionEffect(
  supabase: AppSupabaseClient,
  transaction: {
    booth_id: string;
    amount: number;
    line_items: Json;
    bank_transaction_id?: string | null;
    confirmed?: boolean | null;
  }
): Effect.Effect<Tables<'transactions'>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}

export function updateTransactionEffect(
  supabase: AppSupabaseClient,
  input: {
    id: string;
    status: PaymentStatus;
  }
): Effect.Effect<Tables<'transactions'>, DatabaseError | NotFoundError> {
  return Effect.tryPromise({
    try: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          status: input.status,
        })
        .eq('id', input.id)
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    catch: (error) => mapSupabaseError(error),
  });
}