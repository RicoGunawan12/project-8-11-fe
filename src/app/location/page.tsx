"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavigationBar from "../component/navbar";
import { toastError } from "../utilities/toast";
import Footer from "../component/footer";
import { Location } from "../model/locations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faLocationArrow,
  faPhone,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

const LocationPage: React.FC = () => {
  const [data, setData] = useState<Location[]>();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${process.env.LOCATIONS}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resp = await response.json();
        if (!response.ok) {
          throw new Error(resp.message);
        }
        setData(resp.locations);
      } catch (error: any) {
        toastError(error.message);
      }
    };

    getData();
  }, []);

  const provinces = Array.from(
    new Set(data?.map((location) => location.province))
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 flex-grow">
        <div className="p-6 md:p-12 gap-6 flex flex-col items-center">
          {provinces.map((province) => (
            <ProvinceDropdown
              key={province}
              province={province}
              locations={data?.filter(
                (location) => location.province === province
              ) || []}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

interface ProvinceDropdownProps {
  province: string;
  locations: Location[];
}

const ProvinceDropdown: React.FC<ProvinceDropdownProps> = ({
  province,
  locations,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  return (
    <div className="border rounded-lg shadow-sm p-4 w-4/5">
      <button
        className="w-full text-left text-lg font-semibold text-gray-800 focus:outline-none flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {province} ({locations.length})
        <span className="text-xl">{isOpen ? <FontAwesomeIcon icon={faMinus} /> : <FontAwesomeIcon icon={faPlus} />}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-2"
          >
            {locations.map((location) => (
              <div
                key={location.locationId}
                className="border-b py-2 last:border-none flex gap-6"
                onClick={() => setSelectedLocation(location)}
              >
                <div className="w-1/2">
                  <h3 className="text-md font-medium text-gray-900 flex gap-2 items-center">
                    <FontAwesomeIcon icon={faLocationArrow} />{" "}
                    {location.addressDetail}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <a
                      href={location.link}
                      className="text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} />
                    {location.openTime} - {location.closeTime}
                  </p>
                  <p className="text-sm text-gray-600 flex gap-2 items-center">
                    <FontAwesomeIcon icon={faPhone} />
                    {location.phoneNumber}
                  </p>
                </div>
                {selectedLocation && selectedLocation.locationId === location.locationId && (
                  <div className="w-1/2">
                    <iframe
                      title="Google Maps Preview"
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(
                        location.addressDetail
                      )}`}
                      width="100%"
                      height="200"
                      allowFullScreen
                      className="rounded-md shadow"
                    />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationPage;
