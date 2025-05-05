import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Lottie from "lottie-react";
import loader from "./assets/loading.json";
import { Country, State, City } from "country-state-city";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { buyNowItem } = location.state || {}; // Item passed from "Buy Now"

  const [cart, setCart] = useState([]); // For cart checkout
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    isDefault: false,
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false); // For address saving and payment
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script on mount
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => setError("Failed to load Razorpay payment system");
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  // Load countries on component mount
  useEffect(() => {
    const countryList = Country.getAllCountries().map((country) => ({
      isoCode: country.isoCode,
      name: country.name,
    }));
    setCountries(countryList);
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (newAddress.country) {
      const stateList = State.getStatesOfCountry(newAddress.country).map((state) => ({
        isoCode: state.isoCode,
        name: state.name,
      }));
      setStates(stateList);
      setCities([]);
      setNewAddress((prev) => ({ ...prev, state: "", city: "" }));
    } else {
      setStates([]);
      setCities([]);
    }
  }, [newAddress.country]);

  // Update cities when state changes
  useEffect(() => {
    if (newAddress.country && newAddress.state) {
      const cityList = City.getCitiesOfState(newAddress.country, newAddress.state).map(
        (city) => ({
          name: city.name,
        })
      );
      setCities(cityList);
      setNewAddress((prev) => ({ ...prev, city: "" }));
    } else {
      setCities([]);
    }
  }, [newAddress.state]);

  // Fetch cart (if not "Buy Now") and addresses
  useEffect(() => {
    const fetchCartAndAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to proceed to checkout");
          setLoading(false);
          return;
        }

        const fetchWithRetry = async (url, options, retries = 1) => {
          try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error((await response.json()).message || "Request failed");
            return response.json();
          } catch (err) {
            if (retries > 0) {
              await new Promise((resolve) => setTimeout(resolve, 2000));
              return fetchWithRetry(url, options, retries - 1);
            }
            throw err;
          }
        };

        const headers = { Authorization: `Bearer ${token}` };
        const [cartData, addressesData] = await Promise.all([
          !buyNowItem
            ? fetchWithRetry("https://mahesh-gems-api.vercel.app/api/cart", { headers })
            : Promise.resolve(null),
          fetchWithRetry("https://mahesh-gems-api.vercel.app/api/orders/addresses", { headers }),
        ]);

        if (addressesData.addresses) {
          setAddresses(addressesData.addresses);
          const defaultAddress = addressesData.addresses.find((addr) => addr.isDefault);
          setSelectedAddress(defaultAddress?._id || null);
        } else {
          setError(addressesData.message || "Failed to load addresses");
        }

        if (!buyNowItem) {
          if (cartData.items) {
            setCart(cartData.items);
          } else {
            setError(cartData.message || "Failed to load cart");
          }
        }
      } catch (err) {
        setError(err.message || "Error loading checkout data");
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndAddresses();
  }, [buyNowItem]);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsActionLoading(true);
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
          country: "",
          phone: "",
          isDefault: false,
        });
        alert("Address added successfully!");
      } else {
        alert(data.message || "Failed to add address");
      }
    } catch (err) {
      alert("Error adding address");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select or add a shipping address");
      return;
    }
    if (!razorpayLoaded) {
      alert("Payment system is not loaded. Please try again.");
      return;
    }

    setIsActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      const body = buyNowItem
        ? { addressId: selectedAddress, items: [buyNowItem] }
        : { addressId: selectedAddress };

      const response = await fetch("https://mahesh-gems-api.vercel.app/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create order");
      }

      const { orderId, razorpayOrderId, amount, currency, key } = data;

      const options = {
        key: key,
        amount: amount * 100,
        currency: currency,
        name: "Mahesh Gems",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch(
              "https://mahesh-gems-api.vercel.app/api/orders/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  orderId: orderId,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              }
            );

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
      alert(err.message || "Error initiating checkout");
    } finally {
      setIsActionLoading(false);
    }
  };

  const items = buyNowItem ? [buyNowItem] : cart;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

  if (items.length === 0) {
    return (
      <div className="container px-4 mx-auto mt-6 font-montserrat">
        <p className="text-gray-600">Your cart is empty.</p>
        <button
          className="mt-4 text-sm text-blue-600 hover:underline"
          onClick={() => navigate("/jewelry")}
        >
          Continue Shopping
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
            disabled={isActionLoading}
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
                disabled={isActionLoading}
              />
              <input
                type="text"
                placeholder="Address Line 1"
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                required
                disabled={isActionLoading}
              />
              <input
                type="text"
                placeholder="Address Line 2 (Optional)"
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                disabled={isActionLoading}
              />
              <select
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                required
                disabled={isActionLoading}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                required
                disabled={!newAddress.country || isActionLoading}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                required
                disabled={!newAddress.state || isActionLoading}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Postal Code"
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                required
                disabled={isActionLoading}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-2 mb-3 border rounded"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                required
                disabled={isActionLoading}
              />
              <label className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  className="mr-2"
                  disabled={isActionLoading}
                />
                Set as default address
              </label>
              <button
                type="submit"
                className="w-full p-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                disabled={isActionLoading}
              >
                {isActionLoading ? "Saving..." : "Save Address"}
              </button>
            </form>
          )}
        </div>

        <div className="lg:w-80">
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
            {items.map((item, index) => (
              <div
                key={item.jewelryId?._id || item.jewelryId || index}
                className="flex items-center mb-4"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-contain w-16 h-16 mr-4 rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.title} (x{item.quantity})
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-4 font-semibold">
              <span>Total:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <button
              className={`w-full px-6 py-3 mt-4 text-lg font-medium text-white rounded-md ${
                isActionLoading || !selectedAddress || !razorpayLoaded
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
              onClick={handleCheckout}
              disabled={isActionLoading || !selectedAddress || !razorpayLoaded}
            >
              {isActionLoading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;