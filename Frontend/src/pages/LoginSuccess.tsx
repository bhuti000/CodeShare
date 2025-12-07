import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export default function LoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        console.log("🚀 Starting Google login flow...");

        // ✅ STEP 1: Decode JWT to get user ID FIRST
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;
        console.log("🔍 Decoded userId from token:", userId);

        // ✅ STEP 2: Clear ALL old user data before storing new token
        console.log("🧹 Clearing old localStorage data...");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        
        // Force a small delay to ensure localStorage is cleared
        await new Promise(resolve => setTimeout(resolve, 50));

        // ✅ STEP 3: Store new token
        localStorage.setItem("token", token);
        console.log("✅ New token stored");

        // ✅ STEP 4: Fetch user data with the new token
        console.log("📡 Fetching user data for userId:", userId);
        const res = await api.get(`/auth/user/${userId}`);
        console.log("✅ User data fetched from backend:", res.data);

        // ✅ STEP 5: Store new user data
        localStorage.setItem("user", JSON.stringify(res.data));
        localStorage.setItem("userId", userId);
        console.log("✅ New user data stored in localStorage");
        console.log("📋 Stored user name:", res.data.name);
        console.log("📋 Stored user email:", res.data.email);

        // ✅ STEP 6: Verify data was stored correctly
        const verifyUser = localStorage.getItem("user");
        console.log("✅ Verification - user data in localStorage:", JSON.parse(verifyUser));

        // ✅ STEP 7: Dispatch custom event to notify Header
        window.dispatchEvent(new Event("userLoggedIn"));
        console.log("✅ userLoggedIn event dispatched");

        // ✅ STEP 8: Navigate to home with a hard refresh
        console.log("🔄 Redirecting to home...");
        setTimeout(() => {
          window.location.href = "/";
        }, 200);
      } catch (err) {
        console.error("❌ Failed to fetch user data:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        navigate("/login");
      }
    };

    handleGoogleLogin();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">Signing you in...</p>
    </div>
  );
}
