import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loader from "./assets/loading.json";
import emptyBox from "./assets/empty_box.json";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false); // For remove/clear/update actions

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your cart");
        setLoading(false);
        return;
      }

      const response = await fetch("https://mahesh-gems-api.vercel.app/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.items || []);
        setError(null);
      } else {
        setError(data.message || "Failed to load cart");
      }
    } catch (err) {
      setError("Error loading cart");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart items and listen for updates
  useEffect(() => {
    fetchCart();

    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Remove item from cart
  const handleRemove = async (jewelryId) => {
    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`https://mahesh-gems-api.vercel.app/api/cart/${jewelryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart.items || []);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        alert("Removed from cart!");
      } else {
        alert(data.message || "Failed to remove from cart");
      }
    } catch (err) {
      alert("Error removing from cart");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("https://mahesh-gems-api.vercel.app/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setCart([]);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
        alert("Cart cleared!");
      } else {
        alert(data.message || "Failed to clear cart");
      }
    } catch (err) {
      alert("Error clearing cart");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Update item quantity
  const handleUpdateQuantity = async (jewelryId, quantity) => {
    try {
      setIsActionLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`https://mahesh-gems-api.vercel.app/api/cart/${jewelryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart.items || []);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else {
        alert(data.message || "Failed to update quantity");
      }
    } catch (err) {
      alert("Error updating quantity");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle Proceed to Checkout
  const handleCheckout = () => {
    if (!localStorage.getItem("token")) {
      alert("Please log in to proceed to checkout");
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-96">
          <Lottie animationData={loader} loop autoPlay />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 mx-auto mt-6 font-montserrat">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-4 text-sm text-blue-600 hover:underline"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto mt-6 font-montserrat">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Cart Items Section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-sm text-gray-600">
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </p>
            </div>
            {cart.length > 0 && (
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={handleClearCart}
                disabled={isActionLoading}
              >
                Clear Cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="p-6 text-center bg-white border rounded-lg shadow-sm">
              <div className="mx-auto" style={{width: '350px'}}>
                <Lottie animationData={emptyBox} loop autoPlay />
              </div>
              <p className="text-gray-600">Your cart is empty.</p>
              <button
                className="mt-4 text-sm text-blue-600 hover:underline"
                onClick={() => navigate("/jewelry")}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.jewelryId._id || item.jewelryId}
                  className="flex items-start p-4 bg-white border rounded-lg shadow-sm hover:shadow-md"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-contain w-24 h-24 mr-4 rounded"
                  />
                  <div className="flex-1">
                    <h2
                      className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                      onClick={() => navigate(`/jewelry/${item.jewelryId._id || item.jewelryId}`)}
                    >
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-500">In Stock</p>
                    <p className="mt-1 text-lg font-bold text-gray-900">₹{item.price}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(
                            item.jewelryId._id || item.jewelryId,
                            parseInt(e.target.value)
                          )
                        }
                        className="p-1 border rounded-md"
                        disabled={isActionLoading}
                      >
                        {[...Array(10).keys()].map((i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRemove(item.jewelryId._id || item.jewelryId)}
                        disabled={isActionLoading}
                        className="text-gray-600 transition-colors hover:text-red-500"
                        aria-label="Remove item from cart"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subtotal and Checkout Section */}
        {cart.length > 0 && (
          <div className="lg:w-80">
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Subtotal ({cart.length} item{cart.length !== 1 ? "s" : ""}): ₹{subtotal.toFixed(2)}
              </h2>
              <button
                className="w-full px-6 py-3 mt-4 text-lg font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;