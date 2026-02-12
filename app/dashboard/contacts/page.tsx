import Table from '@/app/ui/contacts/table';
import { PaysTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';

export default async function Page(
  { searchParams }: {
    searchParams?: Promise<{
      query?: string;
    }>
  }) {
  // @mark:
  // after NextJS v15, we're required to await code 
  // that invokes dynamic rendering
  // https://nextjs.org/docs/messages/sync-dynamic-apis
  const params = await searchParams;
  const query = params?.query ?? '';

  return (
    <div className="w-full">
      <Suspense key={query} fallback={<PaysTableSkeleton />}>
        <Table query={query} />
      </Suspense>
    </div>
  );
}
