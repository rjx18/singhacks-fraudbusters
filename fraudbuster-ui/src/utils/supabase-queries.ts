import { AppSupabaseClient, Table } from '@/types';

/**
 * Get all booth items
 */
export const getAllBoothItems = async (
  supabase: AppSupabaseClient
): Promise<Array<Table<'booth_items'>>> => {
  const { data, error } = await supabase.from('booth_items').select('*');

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Delete a booth item by ID
 */
export const deleteBoothItem = async (
  supabase: AppSupabaseClient,
  id: string
) => {
  const { error } = await supabase.from('booth_items').delete().match({ id });

  if (error) {
    throw error;
  }

  return true;
};

/**
 * Get a single booth item by ID
 */
export const getBoothItem = async (
  supabase: AppSupabaseClient,
  id: string
): Promise<Table<'booth_items'>> => {
  const { data, error } = await supabase
    .from('booth_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};
