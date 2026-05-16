import { LIMIT_LISTS } from "@/constants/data-table-constant";
import { ReactNode } from "react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import PaginationDatatable from "./pagination-data-table";

export default function DataTable({
  header,
  data,
  isLoading,
  totalPages,
  currentPage,
  currentLimit,
  onChangePage,
  onChangeLimit,
}: {
  header: string[];
  data: (string | number | ReactNode)[][];
  isLoading?: boolean;
  totalPages: number;
  currentPage: number;
  currentLimit: number;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <Card className="p-0">
        <Table className="w-full overflow-hidden rounded-lg">
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              {header.map((column) => (
                <TableHead key={`th-${column}`} className="px-6 py-3">
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={`tr-${rowIndex}`}>
                {row.map((column, colIndex) => (
                  <TableCell key={`tc-${colIndex}`} className="px-6 py-3">
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {data.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  No results data
                </TableCell>
              </TableRow>
            ) : null}
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={header.length} className="h-24 text-center">
                  Loading
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Label>Limit</Label>
          <Select
            value={currentLimit.toString()}
            onValueChange={(val) => onChangeLimit(Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Limit</SelectLabel>
                {LIMIT_LISTS.map((limit) => (
                  <SelectItem key={limit} value={limit.toString()}>
                    {limit}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {totalPages > 1 ? (
          <div className="flex justify-end">
            <PaginationDatatable
              currentPage={currentPage}
              onChangePage={onChangePage}
              totalPages={totalPages}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
