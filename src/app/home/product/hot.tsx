import React from "react";
import Image from "next/image";

const HotProduct = () => {
  const hotProducts = [
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452843857_1266759404288274_2608934006228877857_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=106&_nc_ohc=1Kwbg9v6TeUQ7kNvgGdvenR&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEwMzQ3NA%3D%3D.3-ccb7-5&oh=00_AYD7aBJDmDUR_frkyfHol-RqpKQKN6sDMMhqcnGUE3_JSw&oe=66E78E34&_nc_sid=0b30b7",
      rating: 3,
      product_name: "A",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452843857_1266759404288274_2608934006228877857_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=106&_nc_ohc=1Kwbg9v6TeUQ7kNvgGdvenR&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEwMzQ3NA%3D%3D.3-ccb7-5&oh=00_AYD7aBJDmDUR_frkyfHol-RqpKQKN6sDMMhqcnGUE3_JSw&oe=66E78E34&_nc_sid=0b30b7",
      rating: 3,
      product_name: "B",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452843857_1266759404288274_2608934006228877857_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=106&_nc_ohc=1Kwbg9v6TeUQ7kNvgGdvenR&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEwMzQ3NA%3D%3D.3-ccb7-5&oh=00_AYD7aBJDmDUR_frkyfHol-RqpKQKN6sDMMhqcnGUE3_JSw&oe=66E78E34&_nc_sid=0b30b7",
      rating: 3,
      product_name: "C",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452843857_1266759404288274_2608934006228877857_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=106&_nc_ohc=1Kwbg9v6TeUQ7kNvgGdvenR&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEwMzQ3NA%3D%3D.3-ccb7-5&oh=00_AYD7aBJDmDUR_frkyfHol-RqpKQKN6sDMMhqcnGUE3_JSw&oe=66E78E34&_nc_sid=0b30b7",
      rating: 3,
      product_name: "D",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452843857_1266759404288274_2608934006228877857_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=106&_nc_ohc=1Kwbg9v6TeUQ7kNvgGdvenR&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEwMzQ3NA%3D%3D.3-ccb7-5&oh=00_AYD7aBJDmDUR_frkyfHol-RqpKQKN6sDMMhqcnGUE3_JSw&oe=66E78E34&_nc_sid=0b30b7",
      rating: 3,
      product_name: "E",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452843857_1266759404288274_2608934006228877857_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=106&_nc_ohc=1Kwbg9v6TeUQ7kNvgGdvenR&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEwMzQ3NA%3D%3D.3-ccb7-5&oh=00_AYD7aBJDmDUR_frkyfHol-RqpKQKN6sDMMhqcnGUE3_JSw&oe=66E78E34&_nc_sid=0b30b7",
      rating: 3,
      product_name: "F",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452843857_1266759404288274_2608934006228877857_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=106&_nc_ohc=1Kwbg9v6TeUQ7kNvgGdvenR&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEwMzQ3NA%3D%3D.3-ccb7-5&oh=00_AYD7aBJDmDUR_frkyfHol-RqpKQKN6sDMMhqcnGUE3_JSw&oe=66E78E34&_nc_sid=0b30b7",
      rating: 3,
      product_name: "G",
      discount: true,
      price: 540000,
      original_price: 830000,
    },
    {
      photo_link:
        "https://scontent-cgk2-1.cdninstagram.com/v/t51.29350-15/452843857_1266759404288274_2608934006228877857_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MC5kZWZhdWx0X2ltYWdlIn0&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_cat=106&_nc_ohc=1Kwbg9v6TeUQ7kNvgGdvenR&_nc_gid=f600ca7e65cb44e19c62bb3750b22243&edm=AFg4Q8wBAAAA&ccb=7-5&ig_cache_key=MzQxOTcyOTA0MDc2MTEwMzQ3NA%3D%3D.3-ccb7-5&oh=00_AYD7aBJDmDUR_frkyfHol-RqpKQKN6sDMMhqcnGUE3_JSw&oe=66E78E34&_nc_sid=0b30b7",
      rating: 3,
      product_name: "H",
      discount: false,
      price: 540000,
      original_price: 830000,
    },
  ];

  return (
    <div className="grid-cols-4 grid-rows-2 grid w-full justify-items-center">
      {hotProducts.map((product, idx) => {
        return (
          <div key={idx} className="w-2/3 mt-6">
            <Image
              src={product.photo_link}
              width={300}
              height={300}
              alt="logo pic"
              className="rounded-t-3xl"
            />
            <div className="bg-white text-black py-2 px-6 items-center flex flex-col">
              <div>{product.rating}</div>
              <div>{product.product_name}</div>
              <div className="flex justify-around text-sm">
                <div className="line-through text-gray-500 ">
                  {product.discount ? (
                    <div>${product.original_price}</div>
                  ) : null}
                </div>
                <div>${product.price}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HotProduct;
