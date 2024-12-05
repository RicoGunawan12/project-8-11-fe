"use client"
import React, { ChangeEvent, FormEvent, useState } from "react";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import { getTokenCookie } from "@/app/utilities/token";
import { newFAQ } from "@/app/model/faq";
import { useRouter } from "next/navigation";
import AdminNavigation from "../../component/adminNavbar";

const AdminFAQPage = () => {

    const router = useRouter()
    const [newData, setNewData] = useState<newFAQ>({
        faqAnswer: "",
        faqQuestion: ""
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLoading(true);

        try {

            const token = getTokenCookie();

            if (!token) {
                throw new Error("You are not authorized");
            }

            console.log(newData)

            const response = await fetch(`${process.env.FAQ}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create product');
            }

            toastSuccess(data.message)
        } catch (error: any) {
            toastError(error.message)
        } finally {
            setLoading(false);
        }
    }

    const handleChanges = (e: React.FocusEvent<Element>) => {
        const target = e.target as HTMLInputElement
        const name = target.name
        const value = target.value 
    
        setNewData((prevData) => ({
          ...prevData, 
          [name]: value, 
        }));
      };

  return (
    <div className="w-screen h-screen bg-white flex justify-around items-center p-6">
      <AdminNavigation />
      <div className=" w-9/12 h-full p-6 shadow-2xl rounded-2xl border-2 text-black">
      <h1 className="text-2xl font-bold mb-6 flex justify-between">Create New FAQ<div className='cursor-pointer' onClick={() => {
                    router.push("/admin/faq")
                }}>X</div></h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Question</label>
                            <input
                                type="text"
                                name="faqQuestion"
                                onBlur={handleChanges}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Answer</label>
                            <input
                                type="text"
                                name="faqAnswer"
                                onBlur={handleChanges}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading ? 'Creating Product...' : 'Create Product'}
                    </button>
                </form>
      </div>
    </div>
  );
};

export default AdminFAQPage;
