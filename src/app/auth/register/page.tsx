"use client"
import React, { useState } from "react";
import { User } from "@/app/model/user";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { toastSuccess, toastError } from '../../utilities/toast';

const RegisterPage = () => {
  const [newUserData, setNewUserData] = useState<User>({
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

      if (!response.ok) {
        console.log(response)
        throw new Error(response.message);
      }

      const data = await response.json();
      toastSuccess("Account Registered Successfully")
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
            src="https://scontent-cgk1-1.cdninstagram.com/v/t39.30808-6/459723069_18456114655031145_2019970027664427347_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYzMDgwOC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_cat=109&_nc_ohc=fSwdewdcCpkQ7kNvgFwWA_3&edm=AP4sbd4AAAAA&ccb=7-5&ig_cache_key=MzQ1ODE2MzI0NTgwNzA0NzQ3Ng%3D%3D.3-ccb7-5&oh=00_AYBCmGSPL79D-PliakQtM0ktliDdbINbUrJeqjzmdNMOiw&oe=66F04406&_nc_sid=7a9f4b"
            width={650}
            height={220}
          />
        </div>
        <div className="w-1/2 rounded-r-2xl p-6">
          <div className="text-black text-8xl font-bold text-center">
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
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
