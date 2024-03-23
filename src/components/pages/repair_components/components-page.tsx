import BreadCrumb, { BreadCrumbType } from "@/components/breadcrumb";
import XinHeader from "../_components/xin-header";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { unstable_noStore } from "next/cache";
import { searchComponentParamsValue } from "@/schemas/search-params-schema";
import { Suspense, useEffect, useState } from "react";
import { DataTableSkeleton } from "@/components/tables/v2/data-table-skeleton";
import { ComponentTable } from "@/components/tables/v2/repair_component/component-table";
import {
  DataTableFilterableColumn,
  Option,
} from "@/components/tables/v2/types";
import { CategoryItem, Component } from "@prisma/client";

interface ComponentPageProps {
  search: searchComponentParamsValue;
}

const getAllCategoires = async () => {
  try {
    const res = await fetch(
      "http://localhost:3000/api/v1/form/options/category_items/1"
    );
    const data: CategoryItem[] = await res.json();

    const options = data.map((item: CategoryItem) => ({
      label: item.name,
      value: item.name,
    }));

    return options;
  } catch (error) {
    return null;
  }
};

const ComponentPage = async ({ search }: ComponentPageProps) => {
  unstable_noStore();
  const stringSeatch = search as unknown as Record<string, string>;
  const searchParams = new URLSearchParams(stringSeatch).toString();
  const categories = await getAllCategoires();

  const filterableColumns: DataTableFilterableColumn<Component>[] = [
    {
      id: "category",
      title: "分类",
      options: categories,
    },
  ];

  const breadcrumbItems: BreadCrumbType[] = [
    { title: "配件管理", link: "/dashboard/components" },
  ];

  const res = await fetch(
    `${process.env.BASE_URL}/api/v1/components?${searchParams}`
  );
  const data = await res.json();
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <>
        <XinHeader title="配件管理">
          <Button className="text-xs md:text-sm" asChild>
            <Link href="/dashboard/components/create">
              <PlusIcon className="mr-2 h-4 w-4" /> 新增
            </Link>
          </Button>
        </XinHeader>
        <Separator />
        <Suspense fallback={<DataTableSkeleton columnCount={4} rowCount={5} />}>
          <ComponentTable data={data} filterColumn={filterableColumns} />
        </Suspense>
      </>
    </div>
  );
};

export default ComponentPage;
