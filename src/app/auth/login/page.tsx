"use client"
import React, { useState } from "react";
import { UserLogin } from "@/app/model/user";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { toastSuccess, toastError } from '../../utilities/toast';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setTokenCookie } from "@/app/utilities/token";
import { ErrorMessage } from "@/app/model/error";

const LoginPage = () => {

  const router = useRouter()
  const [errors, setErrors] = useState<Array<ErrorMessage>>([]);
  const [customErr, setCustomErr] = useState('')
  const [userPayload, setUserPayload] = useState<UserLogin>({
    email: "",
    password: ""
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

  const login = async () => {
    try {
      const response = await fetch(`${process.env.USER_LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.errors) {
          setCustomErr('')
          setErrors(data.errors)
        }
        else {
          setErrors([])
          setCustomErr(data.message)
        }
      } else {
        const sessionCart = localStorage.getItem("cartItem");
        if (sessionCart) {
          const cartItems = JSON.parse(sessionCart);
          for (const item of cartItems) {
            await fetch(`${process.env.CART}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
              },
              body: JSON.stringify(item),
            });
          }

          localStorage.removeItem("cartItem");
          toastSuccess("Cart items synced successfully!");
        }
        await setTokenCookie(data.token)
        router.push("/");
      }



    } catch (error: any) {
      setCustomErr(error.message)
      toastError(error.message);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center flex-wrap content-center bg-white text-black">
      <div className="shadow-2xl w-fit flex justify-center border rounded-2xl">
        <div className="w-full md:w-1/2 rounded-l-2xl p-12 md:p-36 flex flex-col">
          <div className="text-black text-4xl font-bold text-center">
            Login
          </div>
          <div className="w-full">
            <Input
              type="email"
              label="Email"
              size="sm"
              labelPlacement="inside"

              className={`mt-6 w-full border-3 rounded-xl shadow-xl ${errors?.find(e => e.path == 'email') ? "border-red-300" : "border-gray-300"
                }`}
              name="email"
              onBlur={handleChanges}
            />
            <p hidden={!errors?.find(e => e.path === 'email')} className="text-red-500 mt-2 ml-3 text-sm">{errors?.find((e) => e.path === 'email')?.msg}</p>
            <Input
              type="password"
              label="Password"
              size="sm"
              labelPlacement="inside"
              isClearable={false}
              className={`mt-6 w-full border-3 rounded-xl shadow-xl ${errors?.find(e => e.path == 'password') ? "border-red-300" : "border-gray-300"
                }`}
              name="password"
              onBlur={handleChanges}
            />
            <p hidden={!errors?.find(e => e.path === 'password')} className="text-red-500 mt-2 ml-3 text-sm">{errors?.find((e) => e.path === 'password')?.msg}</p>
          </div>
          <div className="flex justify-center mt-6 w-full flex-col">
            <Button onClick={login} className="w-full px-12 py-6 bg-secondary text-white font-semibold text-sm">Login</Button>
            <p hidden={!(customErr.length >= 1)} className="text-red-500 mt-2 text-center text-sm">{customErr}</p>
          </div>
          <div className="text-sm mt-3">
            Do not have an account? <Link href={"/auth/register"} className="text-blue-500 font-bold">Click here</Link>
          </div>
        </div>
        <div className="hidden md:flex md:w-1/2 h-full">
          <Image
            alt="Card background"
            className="object-cover rounded-r-2xl h-full"
            src="/a.jpg"
            width={650}
            height={220}
          />
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
