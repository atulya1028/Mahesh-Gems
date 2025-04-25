import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [itemLoading, setItemLoading] = useState({});
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

        console.log("Fetching cart with token:", token.slice(0, 10) + "...");
        const response = await fetch("https://mahesh-gems-api.vercel.app/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Fetch cart response:", data);
        if (response.ok) {
          setCart(data.items || []);
          setSubtotal(data.subtotal || 0);
        } else {
          setError(data.message || "Failed to load cart");
        }
      } catch (err) {
        console.error("Fetch cart error:", err);
        setError("Error loading cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (jewelryId, delta) => {
    console.log("handleQuantityChange start:", { jewelryId, delta });
    try {
      // Validate token
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        alert("Please log in to update your cart");
        navigate("/login");
        return;
      }
      console.log("Token validated:", token.slice(0, 10) + "...");

      // Validate item
      const item = cart.find((item) => item.jewelryId.toString() === jewelryId.toString());
      if (!item) {
        console.error("Item not found in cart:", jewelryId);
        alert("Item not found in cart");
        return;
      }
      console.log("Item found:", { jewelryId, title: item.title, currentQuantity: item.quantity });

      // Calculate new quantity
      const newQuantity = item.quantity + delta;
      if (newQuantity < 1) {
        console.log("Quantity cannot be less than 1");
        return;
      }
      console.log("New quantity calculated:", newQuantity);

      // Optimistic update
      setItemLoading((prev) => ({ ...prev, [jewelryId]: true }));
      const previousCart = JSON.parse(JSON.stringify(cart)); // Deep copy
      const updatedCart = cart.map((cartItem) =>
        cartItem.jewelryId.toString() === jewelryId.toString()
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      );
      setCart(updatedCart);
      const newSubtotal = updatedCart.reduce(
        (sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity,
        0
      );
      setSubtotal(newSubtotal);
      console.log("Optimistic update applied:", { newQuantity, newSubtotal, updatedCartLength: updatedCart.length });

      // API call
      console.log("Sending PUT request:", {
        url: `https://mahesh-gems-api.vercel.app/api/cart/${jewelryId}`,
        body: { quantity: newQuantity },
      });
      const response = await fetch(`https://mahesh-gems-api.vercel.app/api/cart/${jewelryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();
      console.log("PUT response:", { status: response.status, data });

      if (response.ok) {
        console.log("Update successful, syncing with backend");
        setCart(data.items || updatedCart);
        setSubtotal(data.subtotal || newSubtotal);
      } else if (response.status === 401) {
        console.log("Unauthorized: Redirecting to login");
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (response.status === 400 && data.message.includes("items in stock")) {
        console.log("Stock limit error:", data.message);
        setCart(previousCart);
        setSubtotal(
          previousCart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0)
        );
        alert(data.message);
      } else if (response.status === 404) {
        console.log("Item or cart not found:", data.message);
        setCart(previousCart);
        setSubtotal(
          previousCart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0)
        );
        alert(data.message || "Item not found in cart");
      } else {
        console.log("Update failed:", data.message);
        setCart(previousCart);
        setSubtotal(
          previousCart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0)
        );
        alert(data.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("handleQuantityChange error:", err);
      setCart(previousCart);
      setSubtotal(
        previousCart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0)
      );
      alert("Error updating quantity: " + err.message);
    } finally {
      setItemLoading((prev) => ({ ...prev, [jewelryId]: false }));
      console.log("handleQuantityChange complete");
    }
  };

  const handleRemove = async (jewelryId) => {
    console.log("Remove triggered:", { jewelryId });
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        alert("Please log in to remove items from your cart");
        navigate("/login");
        return;
      }

      const item = cart.find((item) => item.jewelryId.toString() === jewelryId);
      if (!item) {
        console.error("Item not found in cart:", jewelryId);
        alert("Item not found in cart");
        return;
      }

      setItemLoading((prev) => ({ ...prev, [jewelryId]: true }));
      const previousCart = JSON.parse(JSON.stringify(cart));
      const updatedCart = cart.filter((item) => item.jewelryId.toString() !== jewelryId);
      setCart(updatedCart);
      const newSubtotal = updatedCart.reduce(
        (sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity,
        0
      );
      setSubtotal(newSubtotal);
      console.log("Item removed locally:", { jewelryId, newSubtotal, updatedCart });

      console.log("Sending DELETE request:", { url: `https://mahesh-gems-api.vercel.app/api/cart/${jewelryId}` });
      const response = await fetch(`https://mahesh-gems-api.vercel.app/api/cart/${jewelryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Remove item response:", { status: response.status, data });
      if (response.ok) {
        setCart(data.items || updatedCart);
        setSubtotal(data.subtotal || newSubtotal);
        alert("Removed from cart!");
      } else if (response.status === 401) {
        console.log("Unauthorized: Redirecting to login");
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.log("Remove failed:", data.message);
        setCart(previousCart);
        setSubtotal(
          previousCart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0)
        );
        alert(data.message || "Failed to remove from cart");
      }
    } catch (err) {
      console.error("Remove item error:", err);
      setCart(previousCart);
      setSubtotal(
        previousCart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0)
      );
      alert("Error removing from cart: " + err.message);
    } finally {
      setItemLoading((prev) => ({ ...prev, [jewelryId]: false }));
    }
  };

  const handleClearCart = async () => {
    console.log("Clear cart triggered");
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        alert("Please log in to clear your cart");
        navigate("/login");
        return;
      }

      setLoading(true);
      const previousCart = JSON.parse(JSON.stringify(cart));
      setCart([]);
      setSubtotal(0);
      console.log("Cart cleared locally");

      console.log("Sending DELETE request to clear cart");
      const response = await fetch("https://mahesh-gems-api.vercel.app/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Clear cart response:", { status: response.status, data });
      if (response.ok) {
        alert("Cart cleared!");
      } else if (response.status === 401) {
        console.log("Unauthorized: Redirecting to login");
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.log("Clear cart failed:", data.message);
        setCart(previousCart);
        setSubtotal(
          previousCart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0)
        );
        alert(data.message || "Failed to clear cart");
      }
    } catch (err) {
      console.error("Clear cart error:", err);
      setCart(previousCart);
      setSubtotal(
        previousCart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * item.quantity, 0)
      );
      alert("Error clearing cart: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToCheckout = () => {
    console.log("Proceed to checkout triggered");
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
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
                    <p className="mt-1 text-lg font-bold text-gray-900">
                      ₹{parseFloat(item.price || 0).toFixed(2)}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          className="px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          onClick={() => handleQuantityChange(item.jewelryId, -1)}
                          disabled={itemLoading[item.jewelryId] || item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-gray-900">{item.quantity}</span>
                        <button
                          className="px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                          onClick={() => handleQuantityChange(item.jewelryId, 1)}
                          disabled={itemLoading[item.jewelryId]}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                        onClick={() => handleRemove(item.jewelryId)}
                        disabled={itemLoading[item.jewelryId]}
                      >
                        Remove
                      </button>
                      {itemLoading[item.jewelryId] && (
                        <span className="ml-2 text-gray-500">Updating...</span>
                      )}
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}
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
                className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 disabled:opacity-50"
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