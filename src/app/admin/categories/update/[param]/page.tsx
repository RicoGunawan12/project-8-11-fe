"use client";
import { Categories } from "@/app/model/category";
import { toastError } from "@/app/utilities/toast";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const UpdateCategory = () => {
  const router = useParams();
  const id = router.param;
  const [data, setData] = useState<Categories>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.CATEGORIES}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        toastError(data.message);
      }
      console.log(data);
      setData(data);
    };

    fetchData();
  }, []);

  return <div>{data?.productCategoryId}</div>;
};

export default UpdateCategory;
