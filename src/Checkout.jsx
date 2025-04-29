import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loader from "./assets/loading.json";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
    isDefault: false,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartAndAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to proceed to checkout");
          setLoading(false);
          return;
        }

        const [cartResponse, addressesResponse] = await Promise.all([
          fetch("https://mahesh-gems-api.vercel.app/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("https://mahesh-gems-api.vercel.app/api/orders/addresses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const cartData = await cartResponse.json();
        const addressesData = await addressesResponse.json();

        if (cartResponse.ok && cartData.items) {
          setCart(cartData.items);
        } else {
          setError(cartData.message || "Failed to load cart");
        }

        if (addressesResponse.ok && addressesData.addresses) {
          setAddresses(addressesData.addresses);
          const defaultAddress = addressesData.addresses.find((addr) => addr.isDefault);
          setSelectedAddress(defaultAddress?._id || null);
        } else {
          setError(addressesData.message || "Failed to load addresses");
        }
      } catch (err) {
        setError("Error loading checkout data");
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndAddresses();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://mahesh-gems-api.vercel.app/api/orders/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });

      const data = await response.json();
      if (response.ok) {
        setAddresses(data.addresses);
        setSelectedAddress(data.addresses[data.addresses.length - 1]._id);
        setShowAddressForm(false);
        setNewAddress({
          name: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "India",
          phone: "",
          isDefault: false,
        });
      } else {
        alert(data.message || "Failed to add address");
      }
    } catch (err) {
      alert("Error adding address");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select or add a shipping address");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://mahesh-gems-api.vercel.app/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ addressId: selectedAddress }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || "Failed to create order");
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: data.currency,
        name: "Mahesh Gems",
        description: "Order Payment",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch("https://mahesh-gems-api.vercel.app/api/orders/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (verifyResponse.ok) {
              alert("Payment successful! Order confirmed.");
              window.dispatchEvent(new CustomEvent("cartUpdated"));
              navigate("/orders");
            } else {
              alert(verifyData.message || "Payment verification failed");
            }
          } catch (err) {
            alert("Error verifying payment");
          }
        },
        prefill: {
          name: JSON.parse(localStorage.getItem("user"))?.name || "",
          email: JSON.parse(localStorage.getItem("user"))?.email || "",
        },
        theme: {
          color: "#F4D03F",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Error initiating checkout");
    }
  };

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
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Shipping Address</h2>
          {addresses.length === 0 ? (
            <p className="text-gray-600">No addresses found. Please add one.</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedAddress === addr._id ? "border-yellow-500 bg-yellow-50" : ""
                  }`}
                  onClick={() => setSelectedAddress(addr._id)}
                >
                  <p className="font-medium">{addr.name}</p>
                  <p>{addr.addressLine1}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p>
                    {addr.city}, {addr.state} {addr.postalCode}
                  </p>
                  <p>{addr.country}</p>
                  <p>Phone: {addr.phone}</p>
                  {addr.isDefault && <p className="text-sm text-green-600">Default Address</p>}
                </div>
              ))}
            </div>
          )}

          <button
            className="mt-4 text-sm text-blue-600 hover:underline"
            onClick={() => setShowAddressForm(!showAddressForm)}
          >
            {showAddressForm ? "Cancel" : "Add New Address"}
          </button>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="p-4 mt-4 rounded-lg bg-gray-50">
              <h3 className="mb-4 text-lg font-medium">Add New Address</h3>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.name}
                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Address Line 1"
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Address Line 2 (Optional)"
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
              />
              <input
                type="text"
                placeholder="City"
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="State"
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state:  e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Country"
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                required
              />
              <label className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  className="mr-2"
                />
                Set as default address
              </label>
              <button
                type="submit"
                className="w-full p-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
              >
                Save Address
              </button>
            </form>
          )}
        </div>

        <div className="lg:w-80">
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
            {cart.map((item) => (
              <div key={item.jewelryId._id || item.jewelryId} className="flex justify-between mb-2">
                <span>
                  {item.title} (x{item.quantity})
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between mt-4 font-semibold">
              <span>Total:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <button
              className="w-full px-6 py-3 mt-4 text-lg font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
              onClick={handleCheckout}
              disabled={!selectedAddress}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;