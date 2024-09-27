"use client";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import Inputbox from "@/components/ui/input";
import useCart from "@/hooks/use-cart";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

// Define the Razorpay interface
interface RazorpayOptions {
  key: string | undefined;
  name: string;
  currency: string;
  amount: number;
  order_id: string;
  description: string;
  callback_url: string;
  notes: {
    name: string;
    contact: string;
    email: string;
    address: string;
  };
}

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): {
        open: () => void;
      };
    };
  }
}

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const paymentHandledRef = useRef(false);
  const [userDetails, updateUserDetails] = useState({
    Fullname: "",
    Address: "",
    Phone: "",
    Email: ""
  });
  const removeAll = useCart((state) => state.removeAll);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (searchParams.get("success") && !paymentHandledRef.current) {
      toast.success("Payment Completed");
      removeAll();
      paymentHandledRef.current = true; // Mark as handled
    }
    if (searchParams.get("cancelled")) {
      toast.error("Something went wrong");
    }
  }, [searchParams,removeAll]);

  const onCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (userDetails.Phone === "" || userDetails.Address === "" || userDetails.Email === "" || userDetails.Fullname === "") {
      toast.error("User Details are required");
      return;
    }

    const resp = await initializeRazorpay();

    if (!resp) {
      alert("Razorpay SDK Failed to load");
      return;
    }

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        name: userDetails.Fullname,
        contact: userDetails.Phone,
        email: userDetails.Email,
        address: userDetails.Address,
        productIds: items.map((item) => item.id),
      }
    );

    const data = await res.data;

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RZP_KEY_ID,
      name: "ShivanshPlays",
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      description: "Thank you for your purchase",
      callback_url: `${window.location.origin}/api/signaturevalidator`,
      notes: {
        name: userDetails.Fullname,
        contact: userDetails.Phone,
        email: userDetails.Email,
        address: userDetails.Address
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const handleInputChange = (field: keyof typeof userDetails) => (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUserDetails({
      ...userDetails, // Spread the previous state
      [field]: e.target.value // Update the specific field
    });
  };

  return (
    <div
      className="
            mt-16 
            rounded-lg 
            bg-gray-50
            px-4
            py-6
            sm:p-6
            lg:col-span-5
            lg:mt-0
            lg:p-8
            "
    >
      <div>
        <h2 className="text-lg font-medium text-gray-900 pb-2">Order Summary</h2>
        <h3 className="text-m font-medium text-gray-900 py-4 border-t">Your Details</h3>
        {/* Each Inputbox component handles its respective field */}
        <div className="lg:grid grid-cols-2">
          <Inputbox
            label="Name"
            onChange={handleInputChange("Fullname")} // Call handleInputChange with the specific field
            data={userDetails.Fullname}
          />
          <Inputbox
            label="Address"
            onChange={handleInputChange("Address")}
            data={userDetails.Address}
          />
          <Inputbox
            label="Phone"
            onChange={handleInputChange("Phone")}
            data={userDetails.Phone}
          />
          <Inputbox
            label="Email"
            onChange={handleInputChange("Email")}
            data={userDetails.Email}
          />
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order Total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button onClick={onCheckout} className="w-full mt-6">
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
