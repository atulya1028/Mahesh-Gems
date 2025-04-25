import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
          setSubtotal(data.subtotal || 0);
        } else {
          setError(data.message || "Failed to load cart");
        }
      } catch (err) {
        setError("Error loading cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (jewelryId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent invalid quantities
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to update your cart");
        navigate("/login");
        return;
      }

      setLoading(true);
      const previousCart = [...cart];
      const updatedCart = cart.map((item) =>
        item.jewelryId.toString() === jewelryId ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
      const newSubtotal = updatedCart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
      setSubtotal(newSubtotal);

      const response = await fetch(`https://mahesh-gems-api.vercel.app/api/cart/${jewelryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();
      if (response.ok) {
        setSubtotal(data.subtotal); // Sync with backend subtotal
      } else if (response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setCart(previousCart);
        setSubtotal(previousCart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0));
        alert(data.message || "Failed to update quantity");
      }
    } catch (err) {
      setCart(previousCart);
      setSubtotal(previousCart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0));
      alert("Error updating quantity");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jewelryId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to remove items from your cart");
        navigate("/login");
        return;
      }

      setLoading(true);
      const previousCart = [...cart];
      const updatedCart = cart.filter((item) => item.jewelryId.toString() !== jewelryId);
      setCart(updatedCart);
      const newSubtotal = updatedCart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
      setSubtotal(newSubtotal);

      const response = await fetch(`https://mahesh-gems-api.vercel.app/api/cart/${jewelryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Removed from cart!");
      } else if (response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setCart(previousCart);
        setSubtotal(previousCart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0));
        alert(data.message || "Failed to remove from cart");
      }
    } catch (err) {
      setCart(previousCart);
      setSubtotal(previousCart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0));
      alert("Error removing from cart");
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to clear your cart");
        navigate("/login");
        return;
      }

      setLoading(true);
      const previousCart = [...cart];
      setCart([]);
      setSubtotal(0);

      const response = await fetch("https://mahesh-gems-api.vercel.app/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Cart cleared!");
      } else if (response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setCart(previousCart);
        setSubtotal(previousCart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0));
        alert(data.message || "Failed to clear cart");
      }
    } catch (err) {
      setCart(previousCart);
      setSubtotal(previousCart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0));
      alert("Error clearing cart");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container px-4 mx-auto mt-6 font-sans">
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
    <div className="container px-4 mx-auto mt-6 font-sans">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-sm text-gray-600">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex space-x-4">
              {cart.length > 0 && (
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={handleClearCart}
                  disabled={loading}
                >
                  {loading ? "Clearing..." : "Clear Cart"}
                </button>
              )}
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </button>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <p className="text-gray-600">Your cart is empty.</p>
              <button
                className="mt-4 text-sm text-blue-600 hover:underline"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.jewelryId}
                  className="flex items-start p-4 bg-white border rounded-lg shadow-sm hover:shadow-md"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-contain w-24 h-24 mr-4 rounded"
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-500">In Stock</p>
                    <p className="mt-1 text-lg font-bold text-gray-900">₹{item.price}</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <select
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.jewelryId, parseInt(e.target.value))}
                        className="p-1 border border-gray-300 rounded-md"
                        disabled={loading}
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => handleRemove(item.jewelryId)}
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Panel */}
        {cart.length > 0 && (
          <div className="lg:w-80">
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Subtotal ({cart.length} item{cart.length !== 1 ? "s" : ""}): ₹{subtotal.toFixed(2)}
              </h2>
              <button
                className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                onClick={handleProceedToCheckout}
                disabled={loading}
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