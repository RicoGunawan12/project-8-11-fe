"use client";
import NavigationBar from '@/app/component/navbar';
import { useRouter } from 'next/navigation';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

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
    province: string;
    city: string;
    subdistrict: string;
    postalCode: string;
    addressDetail: string;
}

const AddressForm = () => {
    const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
    const [cities, setCities] = useState<CityOption[]>([]);
    const [subdistricts, setSubdistricts] = useState<SubdistrictOption[]>([]);
    const [formData, setFormData] = useState<FormData>({
        province: '',
        city: '',
        subdistrict: '',
        postalCode: '',
        addressDetail: '',
    });
    const router = useRouter();
    const [clientToken, setClientToken] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Fetch client token and redirect if not authenticated
    useEffect(() => {
        const token = getTokenCookie();
        if (!token) {
            router.push("/");
        } else {
            setClientToken(token);
        }
    }, [router]);

    // Fetch provinces, cities, and subdistricts with Bearer token
    useEffect(() => {
        if (clientToken) {
            fetch(`${process.env.ADDRESS}/province`, {
                headers: {
                    'Authorization': `Bearer ${clientToken}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    setProvinces(data.provinces.rajaongkir.results)
                })
                .catch((error) => console.error('Error fetching provinces:', error));
        }
    }, [apiUrl, clientToken]);

    useEffect(() => {
        if (formData.province && clientToken) {
            fetch(`${process.env.ADDRESS}/city?province=${formData.province}`, {
                headers: {
                    'Authorization': `Bearer ${clientToken}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    setCities(data.cities.rajaongkir.results)
                })
                .catch((error) => console.error('Error fetching cities:', error));
        }
    }, [formData.province, apiUrl, clientToken]);

    useEffect(() => {
        if (formData.city && clientToken) {
            fetch(`${process.env.ADDRESS}/subdistrict?city=${formData.city}`, {
                headers: {
                    'Authorization': `Bearer ${clientToken}`
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    setSubdistricts(data.subdistrict.rajaongkir.results)
                })
                .catch((error) => console.error('Error fetching subdistricts:', error));
        }
    }, [formData.city, apiUrl, clientToken]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${clientToken}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Address created successfully');
            } else {
                alert('Failed to create address');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (!clientToken) return null;

    return (
        <div className='w-screen h-screen bg-white flex items-center justify-center'>
            <NavigationBar/>
            <form onSubmit={handleSubmit} className="w-1/2 mx-auto p-8 bg-white text-black border-2 shadow-2xl rounded-lg space-y-6">
                <h2 className="text-2xl font-semibold text-center">Add New Address</h2>

                <div className="space-y-2">
                    <label className="block text-gray-600">Province</label>
                    <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    >
                        <option value="">Select Province</option>
                        {provinces.map((province) => (
                            <option key={province.province_id} value={province.province_id}>
                                {province.province}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-gray-600">City</label>
                    <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city.city_id} value={city.city_id}>
                                {city.city_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-gray-600">Subdistrict</label>
                    <select
                        name="subdistrict"
                        value={formData.subdistrict}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    >
                        <option value="">Select Subdistrict</option>
                        {subdistricts.map((subdistrict) => (
                            <option key={subdistrict.subdistrict_id} value={subdistrict.subdistrict_id}>
                                {subdistrict.subdistrict_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="block text-gray-600">Postal Code</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-gray-600">Address Detail</label>
                    <input
                        type="text"
                        name="addressDetail"
                        value={formData.addressDetail}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 mt-6 font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-700 transition duration-300"
                >
                    Create Address
                </button>
            </form>
        </div>

    );
};

export default AddressForm;

// Utility function to get token from cookies
function getTokenCookie(): string | null {
    return document.cookie.split('; ').find((row) => row.startsWith('token='))?.split('=')[1] || null;
}
