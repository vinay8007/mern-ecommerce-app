// import React from 'react'

import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, oldPrice }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link className="text-gray-700 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out "
          src={image[0]}
          alt=""
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <div className="text-sm font-medium">
        {currency}
        {price}
        {oldPrice && (
          <span className="ml-2 text-gray-400 line-through">
            {currency}
            {oldPrice}
          </span>
        )}
      </div>
    </Link>
  );
};

export default ProductItem;
