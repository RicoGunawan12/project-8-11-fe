
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";

interface TableColumn {
  uid: string;
  name: string;
  sortable?: boolean;
  align?: "start" | "center" | "end";
}

interface DataTableProps<T> {
  columns: TableColumn[]
  data: T[]
  defaultVisibleColumns?: string[]
  id : string
  onAddNew?: () => void
  renderActions?: (item: T) => React.ReactNode
  changeSearch: (val : string) => void
}

function DataTable<T extends { [key: string]: any }>({
  columns,
  data,
  defaultVisibleColumns = [],
  id,
  onAddNew,
  renderActions,
  changeSearch,
}: DataTableProps<T>) {
  const [visibleColumns, setVisibleColumns] = React.useState<Set<String> | "all">(new Set(defaultVisibleColumns));
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: columns[0].uid,
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const pages = Math.ceil(data.length / rowsPerPage);
  const paginatedItems = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  }, [page, data, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...paginatedItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, paginatedItems]);

  const onRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const onSearchChange = (value: string) => {
    changeSearch(value)
    setPage(1);
  };

  const renderCell = (data: any, columnKey: string) => {
    return data[columnKey];
};

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by any field..."
          startContent={<FontAwesomeIcon icon={faMagnifyingGlass}/>}
          onClear={() => changeSearch("")}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">

              <Button variant="flat">
                Columns<FontAwesomeIcon icon={faChevronDown}/>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {columns.map((column) => (
                <DropdownItem key={column.uid} className="capitalize text-black">
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {onAddNew && (
            <Button color="primary" onClick={onAddNew}>
              Add New
              <FontAwesomeIcon icon={faPlus}/>
            </Button>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">Total {data.length} items</span>
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
            onChange={onRowsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  );

  const bottomContent = (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages}
        onChange={setPage}
      />
    </div>
  );

  return (
    <Table
      aria-label="Reusable Table Component"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.align || "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No items found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item[id]}>
            {(columnKey) => (
              <TableCell>
                {renderCell ? renderCell(item, columnKey) : item[columnKey]}
                {columnKey === "actions" && renderActions ? renderActions(item) : null}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default DataTable;
