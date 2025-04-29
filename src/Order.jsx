import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loader from "./assets/loading.json";
import emptyBox from "./assets/empty_box.json";

const Order = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your orders");
          setLoading(false);
          return;
        }

        const response = await fetch("https://mahesh-gems-api.vercel.app/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setOrders(data.orders || []);
        } else {
          setError(data.message || "Failed to load orders");
        }
      } catch (err) {
        setError("Error loading orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="p-6 mt-6 text-center bg-white border rounded-lg shadow-sm">
          <div className="mx-auto" style={{ width: "350px" }}>
            <Lottie animationData={emptyBox} loop autoPlay />
          </div>
          <p className="text-gray-600">You have no orders yet.</p>
          <button
            className="mt-4 text-sm text-blue-600 hover:underline"
            onClick={() => navigate("/jewelry")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="p-6 bg-white border rounded-lg shadow-sm">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Order placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-lg font-semibold">Order #{order._id}</p>
                </div>
                <p
                  className={`text-sm font-medium ${
                    order.paymentStatus === "completed"
                      ? "text-green-600"
                      : order.paymentStatus === "failed"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-md">Shipping Address</h3>
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-md">Items</h3>
                {order.items.map((item) => (
                  <div
                    key={item.jewelryId._id || item.jewelryId}
                    className="flex items-center py-2"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="object-contain w-16 h-16 mr-4 rounded"
                    />
                    <div className="flex-1">
                      <p
                        className="font-semibold cursor-pointer text-md hover:text-blue-600"
                        onClick={() =>
                          navigate(`/jewelry/${item.jewelryId._id || item.jewelryId}`)
                        }
                      >
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="font-bold text-md">₹{item.price}</p>
                    </div>
                    <p className="font-bold text-md">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 font-semibold">
                <span>Total:</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;