"use client"
import React, { useState } from "react";
import { UserRegister } from "@/app/model/user";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { toastSuccess, toastError } from '../../utilities/toast';
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterPage = () => {

  const router = useRouter()

  const [newUserData, setNewUserData] = useState<UserRegister>({
    username: "",
    email : "",
    password : ""
  });

  const handleChanges = (e: React.FocusEvent<Element>) => {
    const target = e.target as HTMLInputElement
    const name = target.name
    const value = target.value 

    setNewUserData((prevData) => ({
      ...prevData, 
      [name]: value, 
    }));
  };

  const register = async() => {
    try {
      const response = await fetch(`${process.env.USER_REGISTER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      router.push("/auth/login")
    } catch (error : any) {
      toastError(error.message)
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center flex-wrap content-center bg-white text-black">
      <div className="shadow-2xl w-fit flex border rounded-2xl">
        <div className="w-1/2">
          <Image
            alt="Card background"
            className="object-cover rounded-l-2xl"
            src="/a.jpg"
            width={650}
            height={220}
          />
        </div>
        <div className="w-1/2 rounded-r-2xl p-36">
          <div className="text-black text-7xl font-bold text-center">
            REGISTER
          </div>
          <div className="w-full">
            <Input
              type="text"
              label="Username"
              size="lg"
              labelPlacement="inside"
              isClearable
              className="mt-6 w-full border-3 rounded-2xl shadow-xl"
              name="username"
              onBlur={handleChanges}
            />
            <Input
              type="email"
              label="Email"
              size="lg"
              labelPlacement="inside"
              isClearable
              className="mt-6 w-full border-3 rounded-2xl shadow-xl"
              name="email"
              onBlur={handleChanges}
            />
            <Input
              type="password"
              label="Password"
              size="lg"
              labelPlacement="inside"
              isClearable
              className="mt-6 w-full border-3 rounded-2xl shadow-xl"  
              name="password"
              onBlur={handleChanges}
            />
          </div>
          <div className="flex justify-center mt-6 w-full">
            <Button onClick={register} className="w-full bg-secondary text-white font-semibold text-lg">Register</Button>
          </div>
          <div className="text-sm">
            Already have an account? <Link href={"/auth/login"} className="text-blue-500 font-bold">Click here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
