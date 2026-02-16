import Pagination from '@/app/ui/pays/pagination';
import { fetchFilteredPays, fetchPaysPages } from "@/app/lib/data";
import Search from '@/app/ui/search';
import Table from '@/app/ui/pays/table';
import { CreatePay } from '@/app/ui/pays/buttons';
import { lusitana } from '@/app/ui/fonts';
import { PaysTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import PaginationServerContainer from '@/app/ui/shared/PaginationServerContainer';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const currentPage = Number(params?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Pays</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search pays..." />
        <CreatePay />
      </div>
      <Table query={query} currentPage={currentPage} />
      <div className="mt-5 flex w-full justify-center">
        <PaginationServerContainer query={query} />
      </div>
    </div>
  );
}
