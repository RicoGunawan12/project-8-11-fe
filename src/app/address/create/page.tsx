"use client";
import NavigationBar from '@/app/component/navbar';
import { ErrorMessage } from '@/app/model/error';
import { toastError, toastSuccess } from '@/app/utilities/toast';
import { deleteTokenCookie, getTokenCookie } from '@/app/utilities/token';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';


interface DestinationOption {
    id: number,
    label: string,
    subdistrict_name: string,
    district_name: string,
    city_name: string,
    zip_code: string    
}

interface ProvinceOption {
    province_id: string;
    province: string;
}

interface CityOption {
    city_id: string;
    district_id: string;
    city_name: string;
    province: string;
    postal_code: string;
    type: string;
}

interface SubdistrictOption {
    city_id: string;
    city: string;
    postal_code: string;
    province: string;
    province_id: string;
    subdistrict_id: string;
    subdistrict_name: string;
    type: string;
}

interface FormData {
    receiverName: string;
    receiverPhoneNumber: string;
    province: string;
    city: string;
    subdistrict: string;
    addressDetail: string;
}

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const AddressForm = () => {
    const [destinations, setDestinations] = useState<DestinationOption[]>([]);
    const [chose, setChose] = useState<DestinationOption | null>(null)
    // const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
    // const [cities, setCities] = useState<CityOption[]>([]);
    // const [subdistricts, setSubdistricts] = useState<SubdistrictOption[]>([]);
    const [destination, setDestination] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Array<ErrorMessage>>([]);
    const [customErr, setCustomErr] = useState('')
    const [formData, setFormData] = useState<FormData>({
        receiverName: '',
        receiverPhoneNumber: '',
        province: '',
        city: '',
        subdistrict: '',
        addressDetail: '',
    });

    const router = useRouter();
    const [clientToken, setClientToken] = useState<string | null>(null);

    useEffect(() => {
        const token = getTokenCookie();
        if (!token) {
            router.push("/");
            return;
        }
        setClientToken(token);
    }, [router]);

    const debouncedDestination = useDebounce(destination, 1000); // 300ms delay

    useEffect(() => {
        if (debouncedDestination.length > 0) {
            const token = getTokenCookie();
            if (!token) {
                router.push("/");
                return;
            }
            fetchDestinations(token);
        }
    }, [debouncedDestination]);

    const fetchDestinations = async (token: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.ADDRESS}/destination?keyword=${destination}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            
            const res = data.searchResult.data;
            console.log(res);
            

            setDestinations(res);
        } catch (error) {
            toastError(error instanceof Error ? error.message : "Failed to fetch provinces");
        } finally {
            setIsLoading(false);
        }
    };

    // const fetchCities = async (provinceId: string) => {
    //     if (!provinceId || !clientToken) return;

    //     setIsLoading(true);
    //     try {
    //         const response = await fetch(
    //             `${process.env.ADDRESS}/city?province=${provinceId}`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${clientToken}`,
    //                 },
    //             }
    //         );

    //         const data = await response.json();
    //         if (!response.ok) {
    //             throw new Error(data.message);
    //         }
    //         const res = data.cities

    //         setCities(res)
    //     } catch (error) {
    //         toastError(error instanceof Error ? error.message : "Failed to fetch cities");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    // const fetchSubdistricts = async (cityId: string) => {
    //     if (!cityId || !clientToken) return;

    //     setIsLoading(true);
    //     try {
    //         const response = await fetch(
    //             `${process.env.ADDRESS}/subdistrict?city=${cityId}`,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${clientToken}`,
    //                 },
    //             }
    //         );

    //         const data = await response.json();
    //         if (!response.ok) {
    //             throw new Error(data.message);
    //         }
    //         const res = data.subdistrict.rajaongkir.results

    //         setSubdistricts(res);
    //     } catch (error) {
    //         toastError(error instanceof Error ? error.message : "Failed to fetch subdistricts");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleChange = (
        e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!clientToken) return;

        // const phoneRegex = /^[0-9]{10,13}$/;
        // if (!phoneRegex.test(formData.receiverPhoneNumber)) {
        //     toastError("Please enter a valid phone number (10-13 digits)");
        //     return;
        // }

        const [subdistrict_id, postal_code] = formData.subdistrict.split(',');

        const payLoad = {
            receiverName: formData.receiverName,
            receiverPhoneNumber: formData.receiverPhoneNumber,
            city: chose?.city_name,
            subdistrict: chose?.subdistrict_name,
            district: chose?.district_name,
            postalCode: chose?.zip_code,
            addressDetail: formData.addressDetail,
            komshipAddressId: chose?.id,
            label: chose?.label
        };

        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.ADDRESS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${clientToken}`,
                },
                body: JSON.stringify(payLoad),
            });

            if (response.status === 401) {
                deleteTokenCookie();
                router.push("/auth/login");
            }
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
                router.push("/profile");
            }
            
        } catch (error: any) {
            if (error.status === 401) {
                router.push("/login");
            }
            toastError(error instanceof Error ? error.message : "Failed to create address");
        } finally {
            setIsLoading(false);
        }
    };

    if (!clientToken) return null;

    return (
        <div className="w-screen h-screen bg-white flex items-center justify-center">
            <NavigationBar />
            <div className="min-w-[400px] w-[50vw] py-8 px-4">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                    <h2 className="text-2xl font-semibold text-center text-gray-800">Add New Address</h2>

                    {/* New Receiver Name Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Receiver Name</label>
                        <input
                            type="text"
                            name="receiverName"
                            value={formData.receiverName}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 text-gray-700 ${errors?.find(e => e.path == 'receiverName') ? "border-red-300" : "border-gray-300"
                            }`}
                            placeholder="Enter receiver's name"
                        />
                    </div>
                    <p hidden={!errors?.find(e => e.path === 'receiverName')} className="text-red-500 text-sm !mt-1">{errors?.find((e) => e.path === 'receiverName')?.msg}</p>

                    {/* New Receiver Phone Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Receiver Phone Number</label>
                        <input
                            type="tel"
                            name="receiverPhoneNumber"
                            value={formData.receiverPhoneNumber}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 text-gray-700 ${errors?.find(e => e.path == 'receiverPhoneNumber') ? "border-red-300" : "border-gray-300"
                            }`}
                            placeholder="Enter receiver's phone number"
                            pattern="[0-9]{10,13}"
                            title="Phone number must be between 10 and 13 digits"
                        />
                    </div>
                    <p hidden={!errors?.find(e => e.path === 'receiverPhoneNumber')} className="text-red-500 text-sm !mt-1">{errors?.find((e) => e.path === 'receiverPhoneNumber')?.msg}</p>

                    <div className="space-y-2 text-gray-700">
                        <label className="block text-sm font-medium text-gray-700">City / Subdistrict / District / Postal Code</label>
                        <input
                            // type="tel"
                            name="receiverPhoneNumber"
                            value={destination}
                            // onChange={handleChange}
                            onChange={(e) => {
                                setDestination(e.target.value)
                                if (chose) {
                                    setChose(null);
                                }
                            }}
                            disabled={isLoading}
                            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 text-gray-700 ${errors?.find(e => e.path == 'receiverPhoneNumber') ? "border-red-300" : "border-gray-300"
                            }`}
                            placeholder="Enter receiver's city / subdistrict / district / postal code"
                            // pattern="[0-9]{10,13}"
                            // title="Phone number must be between 10 and 13 digits"
                        />
                         {
                            destination.length > 0 && !chose && (
                            <div className="absolute z-10 mt-2 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg">
                                {destinations.map((dest, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => {
                                                setDestination(dest.label)
                                                setChose(dest);
                                            } 
                                        }
                                    >
                                        {dest.label}
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* <select
                            name="province"
                            value={formData.province}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 text-gray-700 ${errors?.find(e => e.path == 'province') ? "border-red-300" : "border-gray-300"}`}
                        >
                            
                            <option value="">Select Province</option>
                            {provinces.map((province) => (
                                <option key={province.province_id} value={JSON.stringify(province)}>
                                    {province.province}
                                </option>
                            ))}
                        </select> */}
                    </div>
                    <p hidden={!errors?.find(e => e.path === 'province')} className="text-red-500 text-sm !mt-1">{errors?.find((e) => e.path === 'province')?.msg}</p>

                    {/* <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            disabled={isLoading || !formData.province}
                            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 text-gray-700 ${errors?.find(e => e.path == 'city') ? "border-red-300" : "border-gray-300"}`}
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city.city_id} value={JSON.stringify(city)}>
                                    {city.city_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p hidden={!errors?.find(e => e.path === 'city')} className="text-red-500 text-sm !mt-1">{errors?.find((e) => e.path === 'city')?.msg}</p>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Subdistrict</label>
                        <select
                            name="subdistrict"
                            value={formData.subdistrict}
                            onChange={(e) => {
                                const [subdistrict_id, postal_code] = e.target.value.split(',');
                                const syntheticEvent = {
                                    target: {
                                        name: 'subdistrict',
                                        value: `${subdistrict_id},${postal_code}`,
                                    },
                                } as React.ChangeEvent<HTMLSelectElement>;

                                handleChange(syntheticEvent);
                            }}
                            disabled={isLoading || !formData.city}
                            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 text-gray-700 ${errors?.find(e => e.path == 'subdistrict') ? "border-red-300" : "border-gray-300"}`}
                        >
                            <option value="">Select Subdistrict</option>
                            {subdistricts.map((subdistrict) => (
                                <option key={subdistrict.subdistrict_id} value={`${subdistrict.subdistrict_name},${subdistrict.postal_code}`}>
                                    {subdistrict.subdistrict_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p hidden={!errors?.find(e => e.path === 'subdistrict')} className="text-red-500 text-sm !mt-1">{errors?.find((e) => e.path === 'subdistrict')?.msg}</p> */}

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Address Detail</label>
                        <textarea
                            name="addressDetail"
                            value={formData.addressDetail}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full p-2 border border-gray-300 rounded-md focus:ring-2 text-gray-700 ${errors?.find(e => e.path == 'addressDetail') ? "border-red-300" : "border-gray-300"}`}
                        />
                    </div>
                    <p hidden={!errors?.find(e => e.path === 'addressDetail')} className="text-red-500 text-sm !mt-0">{errors?.find((e) => e.path === 'addressDetail')?.msg}</p>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-secondary text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Creating..." : "Create Address"}
                    </Button>
                    <p hidden={!(customErr.length >= 1)} className="text-red-500 mt-2 text-center text-sm">{customErr}</p>
                </form>
            </div>
        </div>
    );
};

export default AddressForm;