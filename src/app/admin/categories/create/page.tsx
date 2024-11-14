"use client";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import { getTokenCookie } from "@/app/utilities/token";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateCategory = () => {

    const [newCategory, setNewCategory] = useState<string>();
    const router = useRouter()

    const handleChanges = (e: React.FocusEvent<HTMLInputElement>) => {
        setNewCategory(e.target.value);
    };

    const redirect = () => {
        router.push("/admin/categories")
    }

    const handleCreate = async () => {
        try {
            const token = getTokenCookie();

            if (!token) {
                throw new Error("You are not authorized");
            }

            const response = await fetch(`${process.env.CATEGORIES}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ category: newCategory }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            toastSuccess(data.message);
            redirect()
        } catch (error: any) {
            toastError(error.message);
        }
    };

    return (
        <div className="w-screen h-screen fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
                <div className="flex flex-col gap-1 text-black">
                    <h2 className="text-lg font-semibold">Insert Product Category</h2>
                </div>
                <div className="text-black mt-4">
                    <Input
                        type="text"
                        label="Product Category"
                        size="lg"
                        labelPlacement="inside"
                        isClearable
                        className="mt-6 w-full border-3 rounded-2xl shadow-xl"
                        onChange={handleChanges}
                    />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <Button color="danger" variant="light" onClick={redirect}>
                        Close
                    </Button>
                    <Button color="primary" onClick={handleCreate}>
                        Insert
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateCategory;
