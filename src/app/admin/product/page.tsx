"use client"
import React, { useEffect, useState } from "react";
import AdminNavigation from "../component/adminNavbar";
import DataTable from "@/app/component/interactiveTable";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import Loading from "@/app/utilities/loading";
import { Categories } from "@/app/model/category";
import { useDebounce } from "use-debounce";
import { getTokenCookie } from "@/app/utilities/token";
import { useRouter } from "next/navigation";

const AdminCategoryPage = () => {
  const columns = [
    { uid: "productId", name: "ID" },
    { uid: "productName", name: "Product Name", sortable: true },
    { uid: "actions", name: "actions"}
  ];

  const id = "productId"

  const [shouldReload, setShouldReload] = useState(false)
  const [search, setSearch] = useState<string>("")
  const [debouncedValue] = useDebounce(search, 3000)

  const [data, setData] = useState<Categories[]>()
  const router = useRouter()

  useEffect(() => {

    try {
      const FetchData = async() => {

        const response = await fetch(`${process.env.PRODUCTS}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        setData(data)

        toastSuccess(data.message);
      }

      FetchData()
    } catch (error) {
      
    }

  }, [debouncedValue, shouldReload])

  const handleDelete = async (id: string) => {
    try {
      const token = getTokenCookie();

      if (!token) {
        throw new Error("You are not authorized");
      }

      const response = await fetch(`${process.env.PRODUCTS}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      toastSuccess(data.message);
      reload();
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const renderActions = (data: any) => {
    return (
      <div className="flex  gap-2">
        <button
          className="text-yellow-500"
          onClick={() => openUpdateModal(data[id])}
        >
          Edit
        </button>
        <button
          className="text-red-500"
          onClick={() => handleDelete(data[id])}
        >
          Delete
        </button>
      </div>
    );
  };

  const openCreateModal = () => {
    router.push("/admin/product/create")
  }

  const openUpdateModal = (id : string) => {
    router.push("/admin/product/update")
  }

  const reload = () => {
    setShouldReload(!shouldReload)
  }

  if(!data){
    return(
      <Loading/>
    )
  }

  return (
    <div className="w-screen h-screen bg-white flex justify-around items-center p-6">
      <AdminNavigation />
      <div className=" w-9/12 h-full p-6 shadow-2xl rounded-2xl border-2 text-black">
        <DataTable
          columns={columns}
          data={data}
          defaultVisibleColumns={["productId", "productName", "actions"]}
          renderActions={renderActions}
          onAddNew={openCreateModal}
          id={id}
          changeSearch={setSearch}
          />
      </div>
    </div>
  );
};

export default AdminCategoryPage;
