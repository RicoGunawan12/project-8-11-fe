/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import AdminNavigation from "../component/adminNavbar";
import { users } from "./temp";
import {
  getKeyValue,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { Categories } from "@/app/model/category";
import Loading from "@/app/utilities/loading";
import CreateProductCategoryModal from "../modal/createProductCategoryModal";

const AdminCategories = () => {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const rowsPerPage = 10;

  const [data, setData] = useState<Categories[]>([]);

  const [loading, setLoading] = useState(true);
  const [shouldReload, setShouldReload] = useState(false)

  const pages = Math.ceil(data.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data]);

  const columnKeys = data.length > 0 ? Object.keys(data[0]) : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.CATEGORIES}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (!response.ok) {
          const newData: unknown = await response.json();
          const errorResponse= newData as {message : string}
          throw new Error(errorResponse.message)
        }
        const newData: Categories[] = await response.json();
        setData(newData)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, [shouldReload]);

  const closeModal = () =>{
    console.log("tutup")
    setIsOpen(false)
  }

  const reload = () => {
    setShouldReload(!shouldReload)
  }

  if (loading) {
    return <Loading />;
  }

  console.log(data.length);

  if (data.length === 0) {
    return (
      <div className="w-screen h-screen bg-white flex justify-around items-center p-6">
        <AdminNavigation />
        <div className=" w-9/12 h-full p-6 shadow-2xl rounded-2xl border-2 text-black content-center flex-wrap flex justify-center">
          <button
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Open Modal
          </button>
          <CreateProductCategoryModal
            isOpen={isOpen}
            onClose={closeModal}
            reload={reload}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-white flex justify-around items-center p-6">
      <AdminNavigation />
      <div className=" w-9/12 h-full p-6 shadow-2xl rounded-2xl border-2 text-black">
        <Table
          aria-label="Example table with client side pagination"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
        >
          <TableHeader>
            {columnKeys.map((key) => (
              <TableColumn key={key}>{key.toUpperCase()}</TableColumn>
            ))}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow key={item.productCategoryId}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <button
          onClick={() => {
            setIsOpen(true);
            console.log("jheje");
          }}
        >
          Open Modal
        </button>
        <CreateProductCategoryModal
          isOpen={isOpen}
          onClose={closeModal}
          reload={reload}
        />
      </div>
    </div>
  );
};

export default AdminCategories;
