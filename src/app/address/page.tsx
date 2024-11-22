"use client"
import React, { useState } from "react";
import DataTable from "@/app/component/interactiveTable";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import Loading from "@/app/utilities/loading";
import { Categories } from "@/app/model/category";
import { useDebounce } from "use-debounce";
import { getTokenCookie } from "@/app/utilities/token";
import { useRouter } from "next/navigation";
import NavigationBar from "../component/navbar";
import { UserAddress } from "../model/address";

const AddressPage = () => {
  const columns = [
    { uid: "productCategoryId", name: "ID" },
    { uid: "productCategoryName", name: "Category Name", sortable: true },
    { uid: "actions", name: "actions"}
  ];

  const id = "productCategoryId"

  const [data, setData] = useState<UserAddress[]>()
  const [shouldReload, setShouldReload] = useState(false)
  const [search, setSearch] = useState<string>("")
  const router = useRouter()

  const [debouncedValue] = useDebounce(search, 3000)

  React.useEffect(() => {

    const clientToken = getTokenCookie();

    if (!clientToken) {
        router.push("/");
        return;
    }
    console.log(clientToken)
    try {
      const FetchData = async() => {

        const response = await fetch(`${process.env.ADDRESS}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${clientToken}`,
        },
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }

        setData(data)

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

      const response = await fetch(`${process.env.ADDRESS}/${id}`, {
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
    router.push("/address/create")
  }

  const UpdateCategories = () => {
    router.push("/admin/categories/create")
  }

  if(!data){
    return(
      <Loading/>
    )
  }

  return (
    <div className="w-screen h-screen bg-white flex justify-around items-center p-6">
      <NavigationBar/>
      <div className="w-3/4 h-3/4 mt-24 p-6 shadow-2xl rounded-2xl border-2 text-black">
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

export default AddressPage;
