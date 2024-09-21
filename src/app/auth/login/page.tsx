"use client"
import React, { useState } from "react";
import { UserLogin } from "@/app/model/user";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { toastSuccess, toastError } from '../../utilities/toast';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setTokenCookie } from "@/app/utilities/token";

const LoginPage = () => {

  const router = useRouter()

  const [userPayload, setUserPayload] = useState<UserLogin>({
    email : "",
    password : ""
  });

  const handleChanges = (e: React.FocusEvent<Element>) => {
    const target = e.target as HTMLInputElement
    const name = target.name
    const value = target.value 

    setUserPayload((prevData) => ({
      ...prevData, 
      [name]: value, 
    }));
  };

  const login = async() => {
    try {
      const response = await fetch(`${process.env.USER_LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      });

      if (!response.ok) {
        throw new Error("Login Failed");
      }

      const data = await response.json();
      setTokenCookie(data.token)
      toastSuccess("Login Success")
      router.push("/")
    } catch (error : any) {
      toastError(error.message)
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center flex-wrap content-center bg-white text-black">
      <div className="shadow-2xl w-fit flex border rounded-2xl">
        <div className="w-1/2 rounded-l-2xl p-36">
          <div className="text-black text-7xl font-bold text-center">
            Login
          </div>
          <div className="w-full">
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
            <Button onClick={login} className="w-full bg-secondary text-white font-semibold text-lg">Login</Button>
          </div>
          <div className="text-sm">
            Do not have an account? <Link href={"/auth/register"} className="text-blue-500 font-bold">Click here</Link>
          </div>
        </div>
        <div className="w-1/2">
          <Image
            alt="Card background"
            className="object-cover rounded-r-2xl"
            src="https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/459723069_18456114655031145_2019970027664427347_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=fSwdewdcCpkQ7kNvgFwWA_3&edm=AP4sbd4AAAAA&ccb=7-5&ig_cache_key=MzQ1ODE2MzI0NTgwNzA0NzQ3Ng%3D%3D.3-ccb7-5&oh=00_AYBCmGSPL79D-PliakQtM0ktliDdbINbUrJeqjzmdNMOiw&oe=66F04406&_nc_sid=7a9f4b"
            width={650}
            height={220}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
