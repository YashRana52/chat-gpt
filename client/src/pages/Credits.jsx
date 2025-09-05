import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { Check } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

function Credits() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const { axios, token } = useAppContext();

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get("/api/credit/plan", {
        headers: { Authorization: token },
      });

      console.log("📥 Plans API Response:", data);

      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(data.message || "Failed to fetch plan.");
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const purchasePlan = async (planId) => {
    try {
      console.log("➡️ Sending purchase request for planId:", planId);

      const { data } = await axios.post(
        "/api/credit/purchase",
        { planId },
        {
          headers: {
            Authorization: token,
            Origin: window.location.origin,
          },
        }
      );

      console.log("📥 Purchase Response:", data); // log response

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "No redirect URL provided.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-4xl font-extrabold text-center mb-14 text-gray-800 dark:text-white">
        Choose Your <span className="text-purple-600">Credit Plan</span>
      </h2>

      <div className="flex flex-wrap justify-center gap-10">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`relative rounded-2xl shadow-lg p-8 w-[300px] flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl
              ${
                plan._id === "pro"
                  ? "bg-gradient-to-b from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 border-2 border-purple-500"
                  : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
              }`}
          >
            {plan._id === "pro" && (
              <span className="absolute top-3 right-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {plan.name}
            </h3>

            <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mb-6">
              ${plan.price}
              <span className="text-base font-medium text-gray-600 dark:text-gray-300 ml-1">
                / {plan.credits} credits
              </span>
            </p>

            <ul className="flex-1 mb-6 space-y-3 text-gray-700 dark:text-gray-300">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                console.log("🖱️ Selected Plan:", plan);
                console.log("🆔 Plan ID:", plan?._id);

                toast.promise(purchasePlan(plan._id), {
                  loading: "Processing...",
                });
              }}
              className={`px-5 py-3 rounded-lg font-semibold transition-all
                ${
                  plan._id === "pro"
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-800 text-white hover:bg-gray-900 dark:bg-purple-700 dark:hover:bg-purple-800"
                }`}
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Credits;
