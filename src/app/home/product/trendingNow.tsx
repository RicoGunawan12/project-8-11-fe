import React from "react";
import Image from "next/image";

const TrendingProduct = () => {
  const trendingProducts = [
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452632874_1682956565784170_1158892034682157407_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=102&_nc_ohc=vPsXGPl2u0QQ7kNvgEDoXlu&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc4NjIwNzE3NA%3D%3D.3-ccb7-5&oh=00_AYDKpv8LDhC4hE4ryJF0WHLz_R7FiTeHwi3b46P44q3aNQ&oe=66E7639E&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452632874_1682956565784170_1158892034682157407_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=102&_nc_ohc=vPsXGPl2u0QQ7kNvgEDoXlu&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc4NjIwNzE3NA%3D%3D.3-ccb7-5&oh=00_AYDKpv8LDhC4hE4ryJF0WHLz_R7FiTeHwi3b46P44q3aNQ&oe=66E7639E&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452632874_1682956565784170_1158892034682157407_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=102&_nc_ohc=vPsXGPl2u0QQ7kNvgEDoXlu&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc4NjIwNzE3NA%3D%3D.3-ccb7-5&oh=00_AYDKpv8LDhC4hE4ryJF0WHLz_R7FiTeHwi3b46P44q3aNQ&oe=66E7639E&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452632874_1682956565784170_1158892034682157407_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=102&_nc_ohc=vPsXGPl2u0QQ7kNvgEDoXlu&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc4NjIwNzE3NA%3D%3D.3-ccb7-5&oh=00_AYDKpv8LDhC4hE4ryJF0WHLz_R7FiTeHwi3b46P44q3aNQ&oe=66E7639E&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452632874_1682956565784170_1158892034682157407_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=102&_nc_ohc=vPsXGPl2u0QQ7kNvgEDoXlu&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc4NjIwNzE3NA%3D%3D.3-ccb7-5&oh=00_AYDKpv8LDhC4hE4ryJF0WHLz_R7FiTeHwi3b46P44q3aNQ&oe=66E7639E&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452632874_1682956565784170_1158892034682157407_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=102&_nc_ohc=vPsXGPl2u0QQ7kNvgEDoXlu&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc4NjIwNzE3NA%3D%3D.3-ccb7-5&oh=00_AYDKpv8LDhC4hE4ryJF0WHLz_R7FiTeHwi3b46P44q3aNQ&oe=66E7639E&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452632874_1682956565784170_1158892034682157407_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=102&_nc_ohc=vPsXGPl2u0QQ7kNvgEDoXlu&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc4NjIwNzE3NA%3D%3D.3-ccb7-5&oh=00_AYDKpv8LDhC4hE4ryJF0WHLz_R7FiTeHwi3b46P44q3aNQ&oe=66E7639E&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452632874_1682956565784170_1158892034682157407_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=102&_nc_ohc=vPsXGPl2u0QQ7kNvgEDoXlu&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc4NjIwNzE3NA%3D%3D.3-ccb7-5&oh=00_AYDKpv8LDhC4hE4ryJF0WHLz_R7FiTeHwi3b46P44q3aNQ&oe=66E7639E&_nc_sid=0b30b7",
      rating: 3,
      product_name: "",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
  ];

  return (
    <div className="grid-cols-4 grid-rows-2 grid">
      {trendingProducts.map((product, idx) => {
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

export default TrendingProduct;
