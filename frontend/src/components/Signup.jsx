import { useState } from "react";
import apiClient from "../service/apiClient";
import { useNavigate } from "react-router";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //for navigation
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    //Make an API call to backend with data
    // get response from backend
    // take action based on response
    try {
      console.log(`Trying to perform signup`);
      const data = await apiClient.signup(name, email, password);
      console.log("Signup response :", data);
      if (data.success) {
        navigate("/login");
      } else {
        setError(data.message ?? "Signup Failed");
      }
    } catch (error) {
      console.error("Signup error", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="signup">
      <h1>Welcome to Signup page</h1>
      {error && <div>Error:{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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

export default SignUp;
