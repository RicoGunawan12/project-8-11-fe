import React from "react";
import Image from "next/image";

const OnSaleProduct = () => {
  const onSaleProducts = [
    {
      photo_link:
        "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/452914546_518134167225034_9030417155062363651_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=110&_nc_ohc=4ct4KLkrUsgQ7kNvgE4UYWa&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEyNTYxMA%3D%3D.3-ccb7-5&oh=00_AYC1V4rgpKdCoh8lNKrqz_J_Ow291BjF5KvMITuOZI5esg&oe=66E789A3&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/452914546_518134167225034_9030417155062363651_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=110&_nc_ohc=4ct4KLkrUsgQ7kNvgE4UYWa&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEyNTYxMA%3D%3D.3-ccb7-5&oh=00_AYC1V4rgpKdCoh8lNKrqz_J_Ow291BjF5KvMITuOZI5esg&oe=66E789A3&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/452914546_518134167225034_9030417155062363651_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=110&_nc_ohc=4ct4KLkrUsgQ7kNvgE4UYWa&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEyNTYxMA%3D%3D.3-ccb7-5&oh=00_AYC1V4rgpKdCoh8lNKrqz_J_Ow291BjF5KvMITuOZI5esg&oe=66E789A3&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/452914546_518134167225034_9030417155062363651_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=110&_nc_ohc=4ct4KLkrUsgQ7kNvgE4UYWa&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEyNTYxMA%3D%3D.3-ccb7-5&oh=00_AYC1V4rgpKdCoh8lNKrqz_J_Ow291BjF5KvMITuOZI5esg&oe=66E789A3&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/452914546_518134167225034_9030417155062363651_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=110&_nc_ohc=4ct4KLkrUsgQ7kNvgE4UYWa&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEyNTYxMA%3D%3D.3-ccb7-5&oh=00_AYC1V4rgpKdCoh8lNKrqz_J_Ow291BjF5KvMITuOZI5esg&oe=66E789A3&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/452914546_518134167225034_9030417155062363651_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=110&_nc_ohc=4ct4KLkrUsgQ7kNvgE4UYWa&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEyNTYxMA%3D%3D.3-ccb7-5&oh=00_AYC1V4rgpKdCoh8lNKrqz_J_Ow291BjF5KvMITuOZI5esg&oe=66E789A3&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/452914546_518134167225034_9030417155062363651_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=110&_nc_ohc=4ct4KLkrUsgQ7kNvgE4UYWa&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEyNTYxMA%3D%3D.3-ccb7-5&oh=00_AYC1V4rgpKdCoh8lNKrqz_J_Ow291BjF5KvMITuOZI5esg&oe=66E789A3&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk1-2.cdninstagram.com/v/t51.29350-15/452914546_518134167225034_9030417155062363651_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk1-2.cdninstagram.com&_nc_cat=110&_nc_ohc=4ct4KLkrUsgQ7kNvgE4UYWa&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEyNTYxMA%3D%3D.3-ccb7-5&oh=00_AYC1V4rgpKdCoh8lNKrqz_J_Ow291BjF5KvMITuOZI5esg&oe=66E789A3&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
  ];

  return (
    <div className="grid-cols-4 grid-rows-2 grid">
      {onSaleProducts.map((product, idx) => {
        return (
          <div key={idx}>
            <Image
              src={product.photo_link}
              width={400}
              height={350}
              alt="logo pic"
              className="rounded-t-3xl"
            />
          </div>
        );
      })}
      sadwoakdo
    </div>
  );
};

export default OnSaleProduct;
