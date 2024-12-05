"use client"
import React, { useState } from "react";
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
    { uid: "productCategoryId", name: "ID" },
    { uid: "productCategoryName", name: "Category Name", sortable: true },
    { uid: "actions", name: "actions"}
  ];

  const id = "productCategoryId"

  const [data, setData] = useState<Categories[]>()
  const [shouldReload, setShouldReload] = useState(false)
  const [search, setSearch] = useState<string>("")
  const router = useRouter()

  const [debouncedValue] = useDebounce(search, 3000)

  React.useEffect(() => {

    try {
      const FetchData = async() => {

        const response = await fetch(`${process.env.POST}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        console.log(data)
        setData(data.posts)

        toastSuccess(data.message);
      }

      FetchData()
    } catch (error : any) {
        toastError(error)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReload, debouncedValue])

  const handleDelete = async (id : string) => {
    try {

      const token = getTokenCookie();

      if (!token) {
        throw new Error("You are not authorized");
      }

      const response = await fetch(`${process.env.CATEGORIES}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      toastSuccess(data.message);
      setShouldReload(!shouldReload)
    } catch (error: any) {
      toastError(error.message);
    }
  };

  const renderActions = (data: any) => {
    return (
      <div className="flex  gap-2">
        <button
          className="text-yellow-500"
          onClick={UpdateCategories}
        >
          Edit
        </button>
        <button className="text-red-500" onClick={() => handleDelete(data[id])}>
          Delete
        </button>
      </div>
    );
  };

  const CreateCategories = () => {
    router.push("/admin/post/create")
  }

  const UpdateCategories = () => {
    router.push("/admin/post/update")
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
          defaultVisibleColumns={[
            "productCategoryId",
            "productCategoryName",
            "actions",
          ]}
          renderActions={renderActions}
          onAddNew={CreateCategories}
          id={id}
          changeSearch={setSearch}
          />
      </div>
    </div>
  );
};

export default AdminCategoryPage;
