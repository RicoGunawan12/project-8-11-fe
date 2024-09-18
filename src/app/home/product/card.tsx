import { ProductCard } from '@/app/model/product';
import React from 'react'
import Image from "next/image";
import Link from 'next/link';

const Card = ({id, photo_link,rating, product_name, discount, price, original_price} : ProductCard) => {
  return (
    <Link href={`/product/${id}`}>
      <div className="w-2/3 shadow-2xl mt-6">
        <Image src={photo_link} width={300} height={300} alt="logo pic" />
        <div className="bg-white px-6 py-2 flex flex-col items-center text-black">
          <div>{rating}</div>
          <div className="font-semibold">{product_name}</div>
          <div className="flex w-full justify-center gap-3 text-sm">
            {discount ? (
              <div className="line-through text-slate-300">
                ${original_price}
              </div>
            ) : null}
            <div>${price}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card