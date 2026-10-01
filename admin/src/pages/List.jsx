// import React from 'react'

import axios from "axios";
import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // =========================
  // UPDATE PRODUCT
  // =========================
  const updateProduct = async (product) => {
    try {
      const response = await axios.put(
        backendUrl + "/api/product/update",
        {
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          oldPrice: product.oldPrice || "",
          category: product.category,
          subCategory: product.subCategory,
          sizes: JSON.stringify(product.sizes),
          bestseller: product.bestseller,
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        setEditingProduct(null);

        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // =========================
  // REMOVE PRODUCT
  // =========================
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);

        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // =========================
  // LOAD PRODUCTS
  // =========================
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Product List</p>

      <div className="flex flex-col gap-2">
        {/* ---------- List table title ---------- */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* ---------- Product List ---------- */}

        {list.map((item) => (
          <div key={item._id}>
            {/* ---------- Product Row ---------- */}

            <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm">
              <img className="s-12" src={item.image[0]} alt={item.name} />

              <p>{item.name}</p>

              <p>{item.category}</p>

              <p>
                {currency}
                {item.price}
              </p>

              <div className="flex items-center gap-2 justify-end md:justify-center">
                {/* EDIT BUTTON */}
                <button
                  onClick={() => setEditingProduct({ ...item })}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition cursor-pointer"
                >
                  Edit
                </button>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => removeProduct(item._id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* ===================================== */}
            {/* EDIT FORM - DIRECTLY BELOW PRODUCT */}
            {/* ===================================== */}

            {editingProduct?._id === item._id && (
              <div className="border p-4 mt-2 bg-gray-50">
                <p className="text-lg font-semibold mb-4">Edit Product</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div>
                    <p className="mb-1">Product Name</p>

                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <p className="mb-1">Description</p>

                    <input
                      type="text"
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border"
                    />
                  </div>

                  {/* Product Price */}
                  <div>
                    <p className="mb-1">Product Price *</p>

                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border"
                    />
                  </div>

                  {/* Old Price */}
                  <div>
                    <p className="mb-1">Old Price (Optional)</p>

                    <input
                      type="number"
                      value={editingProduct.oldPrice ?? ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          oldPrice: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border"
                      placeholder="Optional"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <p className="mb-1">Category</p>

                    <select
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border"
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>

                  {/* Sub Category */}
                  <div>
                    <p className="mb-1">Sub Category</p>

                    <select
                      value={editingProduct.subCategory}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          subCategory: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border"
                    >
                      <option value="Topwear">Topwear</option>
                      <option value="Bottomwear">Bottomwear</option>
                      <option value="Winterwear">Winterwear</option>
                    </select>
                  </div>
                </div>

                {/* ---------- Buttons ---------- */}

                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => updateProduct(editingProduct)}
                    className="px-5 py-2 bg-black text-white cursor-pointer"
                  >
                    UPDATE
                  </button>

                  <button
                    onClick={() => setEditingProduct(null)}
                    className="px-5 py-2 bg-gray-300 cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
