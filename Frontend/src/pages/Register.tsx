import { useState } from "react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submit = async () => {
    await api.post("/auth/register", { name, email, password });
    navigate("/login");
  };

  return (
    <div className="container max-w-md py-12">
      <h1 className="text-3xl font-bold mb-6">Create Account</h1>

      <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="mb-4" />
      <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="mb-4" />
      <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />

      <Button onClick={submit} className="w-full mt-6">Register</Button>
    </div>
  );
}
