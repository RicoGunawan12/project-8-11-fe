"use client"
import React, { useState } from "react";
import { UserRegister } from "@/app/model/user";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import { toastSuccess, toastError } from '../../utilities/toast';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ErrorMessage } from '../../model/error';
const RegisterPage = () => {

  const [errors, setErrors] = useState<Array<ErrorMessage>>([]);
  const router = useRouter()
  const [customErr, setCustomErr] = useState('')

  const [newUserData, setNewUserData] = useState<UserRegister>({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    confirmPassword: ""
  });
  const handlePhoneNumber = (e: any) => {
    setNewUserData((prevData) => ({
      ...prevData,
      ['phoneNumber']: '+62' + e.target.value,
    }));
  };

  const handleChanges = (e: React.FocusEvent<Element>) => {
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
        if (data.errors) {
          setCustomErr('')
          setErrors(data.errors)
        }
        else {
          setErrors([])
          setCustomErr(data.message)
        }
      } else {
        toastSuccess(data.message)
        router.push("/auth/login")
      }
    } catch (error: any) {
      setCustomErr(error.message)
      toastError(error.message)
    }
  }

  return (
    <div className="w-screen h-screen flex justify-center flex-wrap content-center bg-white text-black">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => window.history.back()}
          className="p-3 bg-secondary text-black rounded-full shadow-md"
        >
          <Image
            src="/icons/back-arrow.svg"
            alt="Back Arrow"
            width={24}
            height={24}
            className="object-contain filter invert"
          />
        </button>
      </div>
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
              label="Full Name"
              size="sm"
              labelPlacement="inside"
              isClearable={false}
              className={`mt-6 w-full border-3 rounded-xl shadow-xl ${errors?.find(e => e.path == 'fullName') ? "border-red-300" : "border-gray-300"
                }`}
              name="fullName"
              onBlur={handleChanges}

            />
            <p hidden={!errors?.find(e => e.path === 'fullName')} className="text-red-500 mt-2 ml-3 text-sm">{errors?.find((e) => e.path === 'fullName')?.msg}</p>


            <Input
              type="email"
              label="Email"
              size="sm"
              labelPlacement="inside"
              isClearable={false}
              className={`mt-6 w-full border-3 !border-red-300 rounded-xl shadow-xl ${errors?.find(e => e.path === 'email') ? '!border-red-300' : '!border-gray-300'
                }`}
              name="email"
              onBlur={handleChanges}
            />

            <p hidden={!errors?.find(e => e.path === 'email')} className="text-red-500 mt-2 ml-3 text-sm">{errors?.find((e) => e.path === 'email')?.msg}</p>
            <div className={`flex flex-row mt-6 h-full  bg-gray-100  border-3 rounded-xl shadow-xl ${errors?.find(e => e.path === 'phoneNumber') ? '!border-red-300' : '!border-gray-300'}`}>
              <div className="min-h-full align-middle flex items-center px-3 border-r-1  border-gray-200">
                <Image
                  src="/icons/id.svg"
                  alt="Indonesia Icon"
                  width={24}
                  height={24} />
              </div>
              <div className={`min-h-full align-middle flex items-center w-full rounded-r-2xl shadow-xl  mr-0 `}>
                <div className="min-h-full align-middle flex items-center bg-transparent px-3">
                  <label className="text-sm text-gray-500">+62</label>
                </div>
                <Input
                  type="phone"
                  label="Phone Number"
                  size="sm"
                  labelPlacement="inside"
                  isClearable={false}
                  color={'default'}
                  className="h-full w-full bg-transparent p-0 m-0 text-sm font-normal text-gray-500 focus-visible:outline-none rounded-l-1"
                  name="phoneNumber"
                  onBlur={handlePhoneNumber}
                  classNames={{
                    input: "p-0 m-0 bg-transparent",
                    inputWrapper: "rounded-l-none"
                  }}
                />

                {/* <div className="">
                  <input onChange={handlePhoneNumber} placeholder="Phone Number" name="phoneNumber" className="h-full w-full bg-transparent  text-sm font-normal text-gray-500 focus-visible:outline-none " >
                  </input>
                  
                </div> */}
              </div>

            </div>
            <p hidden={!errors?.find(e => e.path === 'phoneNumber')} className="text-red-500 mt-2 ml-3 text-sm">{errors?.find((e) => e.path === 'phoneNumber')?.msg}</p>
            <Input
              type="password"
              label="Password"
              size="sm"
              labelPlacement="inside"
              isClearable={false}
              className={`mt-6 w-full border-3 rounded-xl shadow-xl bg-rounded ${errors?.find(e => e.path == 'password') ? "border-red-300" : "border-gray-300"
                }`}
              name="password"
              onBlur={handleChanges}
            />
            <p hidden={!errors?.find(e => e.path === 'password')} className="text-red-500 mt-2 ml-3 text-sm">{errors?.find((e) => e.path === 'password')?.msg}</p>

            <Input
              type="password"
              label="Confirm Password"
              size="sm"
              labelPlacement="inside"
              isClearable={false}
              className={`mt-6 w-full border-3 border-transparent rounded-xl shadow-xl ${errors?.find(e => e.path == 'confirmPassword') ? "border-red-300" : "border-gray-300"
                }`}

              name="confirmPassword"
              onBlur={handleChanges}
            />
            <p hidden={!errors?.find(e => e.path === 'confirmPassword')} className="text-red-500 mt-2 ml-3 text-sm">{errors?.find((e) => e.path === 'confirmPassword')?.msg}</p>


          </div>

          <div className="flex justify-center mt-6 w-full flex-col">
            <Button onClick={register} className="px-12 py-6 w-full bg-secondary text-white font-semibold text-sm">Register</Button>
            <p hidden={!(customErr.length >= 1)} className="text-red-500 mt-2 text-center text-sm">{customErr}</p>
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
