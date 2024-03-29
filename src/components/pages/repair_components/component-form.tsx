"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MultiSelect, { Option } from "@/components/ui/multi-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Brand, Category } from "@/lib/definitions";
import { ComponentSchema } from "@/schemas/componet-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ComponentFormProps {
  initialData: any | null;
}

type ComponentFormValue = z.infer<typeof ComponentSchema>;

const qualities = [
  "compatibile",
  "originale",
  "hard oled compatibile",
  "soft oled compatibile",
  "incell",
  "service package original",
  "rigenerato",
];

const ComponentForm = ({ initialData }: ComponentFormProps) => {
  const action = initialData ? "修改" : "创建";
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultValues = initialData
    ? initialData
    : {
        code: "",
        name: "",
        alias: "",
        brand: "",
        model: [],
        quality: "",
        category: "",
        supplier: "",
        stock: "0",
        purchase_price: "0",
        public_price: "0",
      };

  const form = useForm<ComponentFormValue>({
    resolver: zodResolver(ComponentSchema),
    defaultValues,
  });

  const [categories, setCategories] = useState<Category[] | null>(null);
  const [brands, setBrands] = useState<Brand[] | null>(null);

  const getAllBrands = async () => {
    try {
      const response = await fetch("/api/v1/brands", {
        method: "GET",
      });

      if (response) {
        const { data } = await response.json();
        if (data) {
          setBrands(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await fetch("/api/v1/categories", {
        method: "GET",
      });

      if (response) {
        const { data } = await response.json();
        if (data) {
          setCategories(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllBrands();
    if (defaultValues.brand) {
      getPhonesByName(defaultValues.brand);
    }
  }, []);

  const [phones, setPhones] = useState<Option[] | null>(null);

  const getPhonesByName = async (name: string) => {
    try {
      const response = await fetch(`/api/v1/brands/${name}`, {
        method: "GET",
      });

      if (response) {
        const { data } = await response.json();
        if (data) {
          setPhones(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onBrandChange = async (value: string) => {
    form.setValue("brand", value);
    await getPhonesByName(value);
  };

  const onSubmit = (data: ComponentFormValue) => {
    console.log(data);
  };

  const onModelChange = (value: any, data: string[]) => {
    form.setValue(value, data);
  };
  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 px-1 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>商品条形码</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="商品条形码"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>配件名称</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="配件名称"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>配件通用名称</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="配件通用名称"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>品牌</FormLabel>
                  <Select
                    onValueChange={onBrandChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择品牌" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands &&
                        brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.name}>
                            {brand.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>适配型号</FormLabel>
                  <MultiSelect
                    defaultValues={field.value}
                    placeholder="选择手机型号"
                    fieldName="model"
                    options={phones}
                    setField={onModelChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>分类</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories &&
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>品质</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择品质" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {qualities.map((quality) => (
                        <SelectItem key={quality} value={quality}>
                          {quality}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>库存数量</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="库存数量"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchase_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>进价</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="进价" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="public_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>报价</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="报价" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
};

export default ComponentForm;
