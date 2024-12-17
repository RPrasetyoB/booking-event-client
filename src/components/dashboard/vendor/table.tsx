import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/UI/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown";
import { useCallback, useEffect, useState } from "react";
import { getEventsHrApi, getEventsVendorApi } from "@/api/event";
import SpinnerWithText from "../../UI/spinner-text";
import { formatDate, formatISODate } from "@/lib/format-date";
import DetailModal from "./detail-modal";
import DeleteModal from "./delete-modal";

export const columns = [
  {
    accessorKey: "event_name",
    header: "Event name",
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "proposed_dates",
    header: "Proposed dates",
    style: "text-center",
    cell: ({ row }: any) => {
      return (
        <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="cursor-pointer !border-none border-transparent"
              >
                <>{formatDate(row.original.proposed_dates[0])}...</>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              {row.original.proposed_dates.map(
                (date: string, index: number) => (
                  <DropdownMenuItem key={index}>
                    {formatDate(date)}
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
  {
    accessorKey: "vendor_name",
    header: "Vendor name",
  },
  {
    accessorKey: "confirmed_date",
    header: "Confirmed date / Remark",
    style: "text-center",
    cell: ({ row }: any) => {
      return (
        <div className="max-w-[200px] overflow-x-auto text-center">
          {row.original.remark
            ? row.original.remark
            : formatISODate(row.original.confirmed_date)}
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    style: "text-center",
    cell: ({ row, handleDetailOpen }: any) => {
      return (
        <div className="flex items-center justify-between gap-1">
          <Button
            size={"sm"}
            className="btn bg-green-400"
            onClick={() => handleDetailOpen(row.original)}
          >
            Detail
          </Button>
        </div>
      );
    },
  },
];

export function TableEventVendor() {
  const [data, setData] = useState<EventType[]>([]);
  const [event, setEvent] = useState<EventType | null>(null);
  const [isFetching, setFetching] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [addNewOpen, setAddNewOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDetailOpen = async (event: EventType) => {
    setEvent(event);
    if (event) {
      setDetailOpen(true);
    }
  };
  const handleDeleteOpen = async (event: EventType) => {
    setEvent(event);
    if (event) {
      setDeleteOpen(true);
    }
  };

  const modifiedColumns = columns.map((column) => {
    if (column.cell) {
      return {
        ...column,
        cell: ({ row }: any) => column.cell({ row, handleDetailOpen }),
      };
    }
    return column;
  });

  const table = useReactTable({
    data,
    columns: modifiedColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleUpdateEvent = (event: EventType) => {
    const updatedData = data.map((item) =>
      item.id === event.id ? { ...item, ...event } : item,
    );
    setData(updatedData);
  };

  const handleAddNewEvent = (event: EventType) => {
    setData((prevData) => [...prevData, event]);
  };

  const handleDeleteEvent = (event: EventType | null) => {
    setData((prevData) => prevData.filter((item) => item.id !== event?.id));
  };

  const FetchEventData = useCallback(async () => {
    setFetching(true);
    const authToken = sessionStorage.getItem("authToken");
    const parsedToken = JSON.parse(authToken!) as Token;
    try {
      const response = await getEventsVendorApi(parsedToken.value);
      if (response.success) {
        setFetching(false);
        setData(response.data);
      }
    } catch (error) {
      setFetching(false);
      throw error;
    }
  }, []);

  useEffect(() => {
    FetchEventData();
  }, [FetchEventData]);

  return (
    <div className="mx-auto max-w-[1000px] rounded-md bg-card px-4">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter event name..."
          value={
            (table.getColumn("event_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("event_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        {isFetching ? (
          <div className="mx-auto flex min-h-[200px] items-center justify-center">
            <SpinnerWithText text="Loading" />
          </div>
        ) : (
          <Table className="min-w-[900px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const customClassName =
                      (header.column.columnDef as any).style || "";
                    return (
                      <TableHead key={header.id} className={customClassName}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <DetailModal
          open={detailOpen}
          setOpen={setDetailOpen}
          event={event}
          handleUpdateEvent={handleUpdateEvent}
        />
        <DeleteModal
          open={deleteOpen}
          setOpen={setDeleteOpen}
          event={event}
          handleDeleteEvent={handleDeleteEvent}
        />
      </div>
    </div>
  );
}
