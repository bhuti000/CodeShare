import { useState } from "react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      // ✅ Save token + user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userId", res.data.user._id);

      // redirect
      navigate("/");
      window.location.reload(); // refresh header state
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="container max-w-md py-12">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4"
      />

      <Input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={submit} className="w-full mt-6">
        Login
      </Button>
      <button
  onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
  className="bg-red-500 text-white p-2 w-full rounded-md"
>
  Continue with Google
</button>

    </div>
  );
}
