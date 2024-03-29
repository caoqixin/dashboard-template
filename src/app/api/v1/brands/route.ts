import prisma from "@/lib/prisma";
import { Brand } from "@prisma/client";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

export async function GET() {
  noStore();
  const brands: Brand[] = await prisma.brand.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return Response.json(brands);
}

export async function POST(req: Request) {
  noStore();
  const { name } = await req.json();

  try {
    await prisma.brand.create({
      data: {
        name: name,
      },
    });
    revalidatePath("/dashboard/phones");
    return Response.json({ msg: "创建成功", status: "success" });
  } catch (error) {
    return Response.json({ msg: "创建失败", status: "error" });
  }
}
