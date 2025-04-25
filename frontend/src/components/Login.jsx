import { useState } from "react";
import apiClient from "../service/apiClient";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      console.log(`Trying to perform Login`);
      const data = await apiClient.login(email, password);
      console.log("Login response :", data);
      if (data.success) {
        navigate("/me");
      } else {
        setError(data.message ?? "Login Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h1>Welcome to login page</h1>
      {error && <div>Error:{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Signup....." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default Login;
