"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Copy, ExternalLink, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export type Resume = {
  id: string;
  name: string;
  stok: number;
  stok_total: number;
  kecepatan: number;
};

export const columns: ColumnDef<Resume>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button 
          variant='ghost'
          className=""
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;
      return (
        <Link href='#' className="pointer">
          <Button variant='link' className="font-bold text-left">{name}</Button>
        </Link>
      );
    },
  },
  {
    accessorKey: "stok",
    header: "Stok",
  },
  {
    accessorKey: "stok_total",
    header: "Stok Total",
  },
  {
    accessorKey: "kecepatan",
    header: "Kecepatan",
    cell: ({ row }) => {
      const kecepatan = parseFloat(row.getValue("kecepatan"));
      return <div>{kecepatan} kain/pekan</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              <Copy /> Salin link
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ExternalLink /> Bagikan link
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Eye /> Lihat penjahit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
