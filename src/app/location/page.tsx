"use client";
import React, { useEffect, useState } from "react";
import NavigationBar from "../component/navbar";
import { toastError } from "../utilities/toast";
import Footer from "../component/footer";
import { Location } from "../model/locations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faLocationArrow,
  faPhone,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Banner from "../component/banner";
import { useLocaleStore } from "../component/locale";

const LocationPage: React.FC = () => {
  const [data, setData] = useState<Location[]>();
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale } = useLocaleStore();

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
        if (resp.locations.length > 0) {
          const firstProvince = resp.locations[0].province;
          setSelectedProvince(firstProvince);
        }
      } catch (error: any) {
        toastError(error.message);
      }
    };

    getData();
  }, []);

  const provinces = Array.from(
    new Set(data?.map((location) => location.province))
  );

  const selectedLocations = data?.filter(
    (location) => location.province === selectedProvince
  ) || [];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <NavigationBar />
      <div className="mt-20 flex-grow">
        <Banner page="Location Page" text="Locations"/>
        <div className="p-4 md:p-12 text-black">
          <h1 className="text-2xl font-bold mb-6 truncate">
            {locale == "contentJSONEng" ? "Find our offline store" : "Temukan toko offline kami"}
          </h1>
          
          {/* Mobile Province Dropdown */}
          <div className="md:hidden mb-6">
            <button
              onClick={toggleMenu}
              className="w-full flex items-center justify-between p-4 bg-gray-100 rounded-lg"
            >
              <span className="font-medium">{selectedProvince || "Select Province"}</span>
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className={`w-4 transition-transform duration-200 ${isMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isMenuOpen && (
              <div className="mt-2 bg-white border rounded-lg shadow-lg">
                {provinces.map((province) => (
                  <button
                    key={province}
                    onClick={() => {
                      setSelectedProvince(province);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left py-3 px-4 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{province}</span>
                      <span className="text-gray-500">
                        ({data?.filter(loc => loc.province === province).length})
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:gap-8">
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden md:block md:w-1/4 border-r-4">
              {provinces.map((province) => (
                <button
                  key={province}
                  onClick={() => setSelectedProvince(province)}
                  className={`w-full text-left py-2 px-4 text-base hover:text-gray-600 focus:outline-none flex items-center justify-between ${
                    selectedProvince === province ? 'font-medium' : ''
                  }`}
                >
                  <span className="truncate">{province}</span>
                  <span className="text-gray-500">
                    ({data?.filter(loc => loc.province === province).length})
                  </span>
                </button>
              ))}
            </div>

            {/* Locations Grid */}
            <div className="md:w-3/4">
              {selectedProvince && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4 truncate">{selectedProvince}</h2>
                  <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
                    {selectedLocations.map((location) => (
                      <div
                        key={location.locationId}
                        className="bg-gray-100 rounded-lg p-4 md:p-6"
                      >
                        <h3 className="text-lg font-medium mb-4 truncate">{location.addressDetail}</h3>
                        <div className="flex flex-col gap-3 text-gray-600">
                          <div className="flex items-start gap-2">
                            <FontAwesomeIcon icon={faLocationArrow} className="w-4 mt-1 flex-shrink-0" />
                            <p className="break-words">{location.addressDetail}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faClock} className="w-4 flex-shrink-0" />
                            <p className="truncate">{location.openTime} - {location.closeTime} WIB</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faPhone} className="w-4 flex-shrink-0" />
                            <a href={`tel:${location.phoneNumber}`} className="text-orange-500 truncate">
                              {location.phoneNumber}
                            </a>
                          </div>
                          <a
                            href={location.link}
                            className="text-orange-500 hover:underline mt-2 inline-block"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {locale == "contentJSONEng" ? "View on google maps" : "Lihat di google maps"}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LocationPage;