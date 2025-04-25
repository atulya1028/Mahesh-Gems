import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loader from "./assets/loading.json";
import emptyBox from "./assets/empty_box.json";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your cart.");
          setLoading(false);
          return;
        }

        const response = await fetch("https://mahesh-gems-api.vercel.app/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }

        const data = await response.json();
        setCart(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Unable to load cart.");
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Handle quantity update
  const handleUpdateQuantity = async (jewelryId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://mahesh-gems-api.vercel.app/api/cart/update/${jewelryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart);
      } else {
        alert(data.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating quantity");
    }
  };

  // Handle remove item
  const handleRemoveItem = async (jewelryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://mahesh-gems-api.vercel.app/api/cart/remove/${jewelryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart);
      } else {
        alert(data.message || "Failed to remove item");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing item");
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://mahesh-gems-api.vercel.app/api/cart/clear", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart);
      } else {
        alert(data.message || "Failed to clear cart");
      }
    } catch (err) {
      console.error(err);
      alert("Error clearing cart");
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen font-montserrat">
        <div className="w-96">
          <Lottie animationData={loader} loop autoPlay />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-red-500 font-montserrat">
        {error}
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto mt-10 font-montserrat">
      <h1 className="mb-6 text-3xl font-semibold text-center text-gray-800 sm:text-4xl">
        Your Cart
      </h1>

      {cart && cart.items && cart.items.length > 0 ? (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow">
            {cart.items.map((item) => (
              <div
                key={item.jewelryId}
                className="flex items-center p-4 border-b last:border-b-0"
              >
                <img
                  src={item.image || "https://via.placeholder.com/100"}
                  alt={item.title}
                  className="object-fill w-24 h-24 rounded"
                />
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-gray-600">₹{item.price}</p>
                  <div className="flex items-center mt-2">
                    <label htmlFor={`quantity-${item.jewelryId}`} className="mr-2 text-sm">
                      Quantity:
                    </label>
                    <input
                      id={`quantity-${item.jewelryId}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(item.jewelryId, parseInt(e.target.value))
                      }
                      className="w-16 p-1 border rounded-md"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-semibold">
                    ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.jewelryId)}
                    className="mt-2 text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="p-6 rounded-lg shadow-md bg-gray-50">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="flex justify-between mt-4">
              <span>Total:</span>
              <span className="font-semibold">₹{calculateTotal()}</span>
            </div>
            <div className="mt-6 space-y-3">
              <button
                className="w-full px-6 py-3 text-lg font-medium text-white transition rounded-md bg-emerald-600 hover:bg-emerald-700"
                onClick={() => alert("Proceeding to checkout!")}
              >
                Proceed to Checkout
              </button>
              <button
                className="w-full px-6 py-3 text-lg font-medium text-white transition bg-red-600 rounded-md hover:bg-red-700"
                onClick={handleClearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-gray-500">
          <div className="w-50 sm:w-100">
            <Lottie animationData={emptyBox} loop autoPlay />
          </div>
          <p className="mt-1 text-2xl">Your cart is empty.</p>
          <button
            className="px-6 py-2 mt-4 text-white bg-gray-700 rounded-md hover:bg-gray-800"
            onClick={() => navigate("/jewelry")}
          >
            Shop Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;