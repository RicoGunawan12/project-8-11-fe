"use client";
import NavigationBar from "@/app/component/navbar";
import { toastError, toastSuccess } from "@/app/utilities/toast";
import { getTokenCookie } from "@/app/utilities/token";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

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

const AddressForm = () => {
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [subdistricts, setSubdistricts] = useState<SubdistrictOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    receiverName: "",
    receiverPhoneNumber: "",
    province: "",
    city: "",
    subdistrict: "",
    addressDetail: "",
  });

  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [clientToken, setClientToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getTokenCookie();
    if (!token) {
      router.push("/");
      return;
    }
    setClientToken(token);
    fetchProvinces(token);
  }, [router]);

  const fetchProvinces = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.ADDRESS}/province`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      const res = data.provinces;
      setProvinces(res);
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Failed to fetch provinces"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCities = async (provinceId: string) => {
    if (!provinceId || !clientToken) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.ADDRESS}/city?province=${provinceId}`,
        {
          headers: {
            Authorization: `Bearer ${clientToken}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      const res = data.cities;

      setCities(res);
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Failed to fetch cities"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubdistricts = async (cityId: string) => {
    if (!cityId || !clientToken) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.ADDRESS}/subdistrict?city=${cityId}`,
        {
          headers: {
            Authorization: `Bearer ${clientToken}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      const res = data.subdistrict.rajaongkir.results;

      setSubdistricts(res);
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Failed to fetch subdistricts"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement> 
  ) => {
    const { name, value } = e.target;
    
    if (name === "province") {
      let obj = JSON.parse(value);
      setFormData((prev) => ({ ...prev, province: value, city: "", subdistrict: "" }));
      fetchCities(obj.province_id);
    } else if (name === "city") {
      let obj = JSON.parse(value);
      setFormData((prev) => ({ ...prev, city: value, subdistrict: "" }));
      fetchSubdistricts(obj.city_id);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value}));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!clientToken) return;

    const phoneRegex = /^[0-9]{10,13}$/;
    if (!phoneRegex.test(formData.receiverPhoneNumber)) {
      toastError("Please enter a valid phone number (10-13 digits)");
      return;
    }
    const [subdistrict_id, postal_code] = formData.subdistrict.split(',');
    setIsLoading(true);

    const payLoad = {
      receiverName: formData.receiverName,
      receiverPhoneNumber: formData.receiverPhoneNumber,
      province: JSON.parse(formData.province).province,
      city: JSON.parse(formData.city).city_name,
      subdistrict: subdistrict_id,
      postalCode: postal_code,
      addressDetail: formData.addressDetail,
    }


    try {
      const response = await fetch(`${process.env.ADDRESS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clientToken}`,
        },
        body: JSON.stringify(payLoad),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }


      router.push("/profile");
    } catch (error) {
      toastError(
        error instanceof Error ? error.message : "Failed to create address"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!clientToken) return null;

  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center">
      <NavigationBar />
      <div className="w-1/2 mx-auto py-8 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Update Address
          </h2>

          {/* New Receiver Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Receiver Name
            </label>
            <input
              type="text"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 text-gray-700"
              placeholder="Enter receiver's name"
            />
          </div>

          {/* New Receiver Phone Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Receiver Phone Number
            </label>
            <input
              type="tel"
              name="receiverPhoneNumber"
              value={formData.receiverPhoneNumber}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 text-gray-700"
              placeholder="Enter receiver's phone number"
              pattern="[0-9]{10,13}"
              title="Phone number must be between 10 and 13 digits"
            />
          </div>

          <div className="space-y-2 text-gray-700">
            <label className="block text-sm font-medium text-gray-700">
              Province
            </label>
            <select
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2"
            >
              <option value="">Select Province</option>
              {provinces.map((province) => (
                <option
                  key={province.province_id}
                  value={JSON.stringify(province)}
                >
                  {province.province}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              City
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={isLoading || !formData.province}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 text-gray-700"
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.city_id} value={JSON.stringify(city)}>
                  {city.city_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Subdistrict
            </label>
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
              required
              disabled={isLoading || !formData.city}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 text-gray-700"
            >
              <option value="">Select Subdistrict</option>
              {subdistricts.map((subdistrict) => (
                <option
                  key={subdistrict.subdistrict_id}
                  value={`${subdistrict.subdistrict_name},${subdistrict.postal_code}`}
                >
                  {subdistrict.subdistrict_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Address Detail
            </label>
            <textarea
                            name="addressDetail"
                            value={formData.addressDetail}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 text-gray-700"
                        />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Create Address"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
