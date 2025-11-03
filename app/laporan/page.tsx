import React from "react";
import { DataTable } from "./data-table";
import { columns, Resume } from "./columns";
import { Button } from "@/components/ui/button";

const getData = async():Promise<Resume[]> => {
  return [
    {
      id: "1",
      name: "Burhan",
      stok: 10,
      stok_total: 100,
      kecepatan: 10,
    },
    {
      id: "2",
      name: "Uceng",
      stok: 20,
      stok_total: 200,
      kecepatan: 20,
    },
    {
      id: "3",
      name: "Kasidi",
      stok: 20,
      stok_total: 200,
      kecepatan: 20,
    },
    {
      id: "4",
      name: "Edi",
      stok: 20,
      stok_total: 200,
      kecepatan: 20,
    },
  ]
}

const page = async() => {

  const data = await getData()

  return (
    <div>
      <h1 className="text-lg font-semibold">Sai Laporan</h1>
      <div className="container mx-auto py-10 space-y-4">
        <div className="flex justify-end gap-3 items-center">
          <Button variant='secondary' className="">
            Export
          </Button>
          <Button>+ Tambah</Button>
        </div>
        <div className="rounded-4xl">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default page;
