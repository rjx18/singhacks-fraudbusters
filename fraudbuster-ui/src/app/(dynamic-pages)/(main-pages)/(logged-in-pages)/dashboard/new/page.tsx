import { T } from '@/components/ui/Typography';
import { CreateBoothForm } from '../ClientPage';

export default function NewBoothItemPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 max-w-2xl">
      <div>
        <T.H1>Create New Booth</T.H1>
      </div>
      <CreateBoothForm />
    </div>
  );
}
