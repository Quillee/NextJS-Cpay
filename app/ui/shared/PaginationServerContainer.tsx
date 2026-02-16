import { fetchPaysPages } from "@/app/lib/data";
import Pagination from "../pays/pagination";

export default async function PaginationServerContainer({ query }: { query: string }) {
    const totalPages = await fetchPaysPages(query);
    return <Pagination totalPages={totalPages} />
}
