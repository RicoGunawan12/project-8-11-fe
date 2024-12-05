"use client";

import { toastError, toastSuccess } from "@/app/utilities/toast";
import { getTokenCookie } from "@/app/utilities/token";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreatePost = () => {
    const [postData, setPostData] = useState({
        postTitle: "",
        postContent: ""
    });
    const router = useRouter();

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPostData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const redirect = () => {
        router.push("/posts");
    };

    const handleCreate = async () => {
        try {
            const token = getTokenCookie();

            if (!token) {
                throw new Error("You are not authorized");
            }

            if (!postData.postTitle || !postData.postContent) {
                throw new Error("Please fill in all fields");
            }

            const response = await fetch(`${process.env.POST}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(postData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            toastSuccess(data.message);
            redirect();
        } catch (error: any) {
            toastError(error.message);
        }
    };

    return (
        <div className="w-screen h-screen fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                <div className="flex flex-col gap-1 text-black">
                    <h2 className="text-2xl font-semibold">Create New Post</h2>
                    <p className="text-gray-600 text-sm">Fill in the details for your new post</p>
                </div>

                <div className="text-black mt-6 space-y-6">
                    <Input
                        type="text"
                        label="Post Title"
                        name="postTitle"
                        size="lg"
                        labelPlacement="inside"
                        isClearable
                        className="w-full border-3 rounded-2xl shadow-xl"
                        value={postData.postTitle}
                        onChange={handleChanges}
                    />

                    <Textarea
                        label="Post Content"
                        name="postContent"
                        size="lg"
                        labelPlacement="inside"
                        minRows={5}
                        className="w-full border-3 rounded-2xl shadow-xl"
                        value={postData.postContent}
                        onChange={handleChanges}
                    />
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <Button 
                        color="danger" 
                        variant="light" 
                        onClick={redirect}
                    >
                        Cancel
                    </Button>
                    <Button 
                        color="primary" 
                        onClick={handleCreate}
                    >
                        Create Post
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;