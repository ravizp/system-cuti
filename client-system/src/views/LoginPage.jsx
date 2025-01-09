import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ url }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${url}/login`, { email, password });

      localStorage.setItem("access_token", data.access_token);

      navigate("/");
      Swal.fire({
        title: "Logged In",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "error",
      });
    }
  }

  function emailOnChange(event) {
    setEmail(event.target.value);
  }

  function passwordOnChange(event) {
    setPassword(event.target.value);
  }

  return (
    <>
      <div className="relative flex flex-col justify-center h-[85dvh] overflow-hidden bg-base-100">
        <div className="w-full p-6 m-auto rounded-lg shadow-md lg:max-w-lg bg-base-200">
          <h1 className="text-3xl font-semibold text-center text-white-600">
            PT. LAPI LABORATORIUS
          </h1>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="label">
                <span className="text-base label-text text-white-600">
                  Email
                </span>
              </label>
              <input
                type="text"
                placeholder="Email Address"
                className="w-full input input-bordered input-accent"
                onChange={emailOnChange}
                value={email}
              />
            </div>
            <div>
              <label className="label">
                <span className="text-base label-text text-white-600">
                  Password
                </span>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                className="w-full input input-bordered input-accent"
                onChange={passwordOnChange}
                value={password}
              />
            </div>
            <br />
            <div>
              <button className="btn btn-accent w-full" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
