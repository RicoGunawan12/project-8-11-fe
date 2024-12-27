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
    email: "",
    password: "",
    phoneNumber:""
  });
  const handlePhoneNumber = (e: any) => {
    setNewUserData((prevData) => ({
      ...prevData,
      ['phoneNumber']: '+62' + e.target.value,
    }));
  };

  const handleChanges = (e: React.FocusEvent<Element> ) => {
    const target = e.target as HTMLInputElement
    const name = target.name
    const value = target.value

    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const register = async () => {
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
      toastSuccess(data.message)
      router.push("/auth/login")
      ;
    } catch (error: any) {
      toastError(error.message)
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center flex-wrap content-center bg-white text-black">
      <div className="shadow-2xl w-fit flex border rounded-2xl">
        <div className="hidden md:flex w-1/2 h-full">
          <Image
            alt="Card background"
            className="object-cover rounded-l-2xl h-full"
            src="/a.jpg"
            width={650}
            height={220}
          />
        </div>
        <div className="w-full md:w-1/2 rounded-r-2xl p-24 text-black ">
          <div className="text-4xl font-bold text-center">
            REGISTER
          </div>
          <div className="w-full">
            <Input
              type="text"
              label="Username"
              size="sm"
              labelPlacement="inside"
              isClearable
              className="mt-6 w-full border-3 rounded-2xl shadow-xl"
              name="username"
              onBlur={handleChanges}
            />
            <Input
              type="email"
              label="Email"
              size="sm"
              labelPlacement="inside"
              isClearable
              className="mt-6 w-full border-3 rounded-2xl shadow-xl"
              name="email"
              onBlur={handleChanges}
            />
            <Input
              type="password"
              label="Password"
              size="sm"
              labelPlacement="inside"
              isClearable
              className="mt-6 w-full border-3 rounded-2xl shadow-xl"
              name="password"
              onBlur={handleChanges}
            />
            <div className="flex flex-row mt-6 h-full  bg-gray-50">
              <div className="min-h-full align-middle flex items-center px-3 border-3 border-r-1 border-y rounded-l-xl border-gray-200">
                <Image
                  src="/icons/id.svg"
                  alt="Indonesia Icon"
                  width={24}
                  height={24} />
              </div>
              <div className=" hover:bg-gray-200 min-h-full align-middle flex items-center px-3 border-3 border-y border-l-1 border-gray-200 w-full rounded-r-2xl shadow-xl">
                <div className="min-h-full align-middle flex items-center bg-transparent">
                  <label className="text-sm text-gray-500">+62</label>
                </div>
                <div className="p-3 w-full">
                  <input onChange={handlePhoneNumber} placeholder="Phone Number" name="phoneNumber" className="h-full w-full bg-transparent  text-sm font-normal text-gray-500 focus-visible:outline-none " >
                  </input>
                </div>
              </div>

            </div>
          </div>
          <div className="flex justify-center mt-6 w-full">
            <Button onClick={register} className="px-12 py-6 w-full bg-secondary text-white font-semibold text-sm">Register</Button>
          </div>
          <div className="text-sm  mt-3">
            Already have an account? <Link href={"/auth/login"} className="text-blue-500 font-bold">Click here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
