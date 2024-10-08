"use client"
import React from "react";
import AdminNavigation from "../component/adminNavbar";
import DataTable from "@/app/component/table";
import { toastSuccess } from "@/app/utilities/toast";
import Loading from "@/app/utilities/loading";
import { Categories } from "@/app/model/category";
import { useDebounce } from "use-debounce";
import CreateProductModal from "../modal/createProductModal";

const AdminCategoryPage = () => {
  const columns = [
    { uid: "productId", name: "ID" },
    { uid: "productName", name: "Product Name", sortable: true },
    { uid: "actions", name: "actions"}
  ];

  const id = "productId"

  const [isOpen, setIsOpen] = React.useState(false);
  const [shouldReload, setShouldReload] = React.useState(false)
  const [search, setSearch] = React.useState<string>("")

  const [debouncedValue] = useDebounce(search, 3000)

  const [data, setData] = React.useState<Categories[]>()

  React.useEffect(() => {

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

  const renderActions = (data: any) => {
    return (
      <div className="flex  gap-2">
        <button
          className="text-yellow-500"
          onClick={() => console.log("Edit", data[id])}
        >
          Edit
        </button>
        <button
          className="text-red-500"
          onClick={() => console.log("Delete", data[id])}
        >
          Delete
        </button>
      </div>
    );
  };

  const closeModal = () => {
    setIsOpen(false)
  }

  const openModal = () => {
    setIsOpen(true)
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
          onAddNew={openModal}
          id={id}
          changeSearch={setSearch}
          />
          <CreateProductModal
          isOpen={isOpen}
          onClose={closeModal}
          reload={reload}
        />
      </div>
    </div>
  );
};

export default AdminCategoryPage;
