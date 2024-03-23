import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { unstable_noStore } from "next/cache";
import { searchParamsValue } from "@/schemas/search-params-schema";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/tables/v2/data-table-skeleton";
import { RepairTable } from "@/components/tables/v2/repair/repair-table";

interface RepairPageProps {
  search: searchParamsValue;
}

const RepairPage = async ({ search }: RepairPageProps) => {
  unstable_noStore();

  const stringSeatch = search as unknown as Record<string, string>;
  const searchParams = new URLSearchParams(stringSeatch).toString();

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "维修管理", link: "/dashboard/repairs" },
  ];
  const res = await fetch(
    `http://localhost:3000/api/v1/repairs?${searchParams}`
  );

  const data = await res.json();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="维修管理">
          <Button className="text-xs md:text-sm" asChild>
            <Link href="/dashboard/repairs/create">
              <PlusIcon className="mr-2 h-4 w-4" /> 新增
            </Link>
          </Button>
        </XinHeader>
        <Separator />

        <Suspense fallback={<DataTableSkeleton columnCount={4} rowCount={5} />}>
          <RepairTable data={data} />
        </Suspense>
      </>
    </div>
  );
};

export default RepairPage;
