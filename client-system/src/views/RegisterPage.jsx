import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function RegisterPage({ url }) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noTlp, setNoTlp] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const body = { nama, email, password, noTlp, address, role };

      // Lakukan POST request ke endpoint API
      await axios.post(`${url}/register`, body);

      // Arahkan pengguna ke halaman login setelah berhasil registrasi
      Swal.fire({
        title: "Success Register",
        icon: "success", // Perbaikan dari 'succes' menjadi 'success'
      });
      navigate("/login");
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Registration Failed",
        text: error.response?.data?.message || "Something went wrong!",
        icon: "error",
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4">
      <div className="w-full max-w-xl p-6 bg-base-200 rounded-lg shadow-md animate-fadeIn transform transition-transform duration-300 ease-out hover:scale-105">
        <h1 className="text-3xl font-semibold text-center text-accent-focus mb-6">
          Add New Employee
        </h1>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="label">
              <span className="text-base label-text">Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter Your Name"
              className="w-full input input-bordered input-accent"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="text-base label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full input input-bordered input-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input input-bordered input-accent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="text-base label-text">Phone Number</span>
            </label>
            <input
              type="tel"
              placeholder="Enter Phone Number"
              className="w-full input input-bordered input-accent"
              value={noTlp}
              onChange={(e) => setNoTlp(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">
              <span className="text-base label-text">Address</span>
            </label>
            <input
              type="text"
              placeholder="Enter Address"
              className="w-full input input-bordered input-accent"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="role">Select Departement: </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full select select-bordered select-accent"
              required>
              <option value="" disabled>
                -- Select a Departement --
              </option>
              <option value="Staff IT">Staff IT</option>
              <option value="Staff Produksi">Staff Produksi</option>
              <option value="Staff HRD">Staff HRD</option>
              <option value="Staff Farmasi">Staff Farmasi</option>
              <option value="Security">Security</option>
              <option value="Kurir">Kurir</option>
              <option value="SPV. IT">SPV. IT</option>
              <option value="SPV. Produksi">SPV. Produksi</option>
              <option value="SPV. HRD">SPV. HRD</option>
              <option value="SPV. Farmasi">SPV. Farmasi</option>
              <option value="SPV. Security">SPV. Security</option>
              <option value="SPV. Kurir">SPV. Kurir</option>
              <option value="Manager IT">Manager IT</option>
              <option value="Manager Produksi">Manager Produksi</option>
              <option value="Manager HRD">Manager HRD</option>
              <option value="Manager Farmasi">Manager Farmasi</option>
              <option value="Manager Security">Manager Security</option>
              <option value="Manager Kurir">Manager Kurir</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="btn btn-accent w-[48%] transition-transform duration-300 transform hover:scale-105">
              Add Employee
            </button>
            <button
              type="button"
              className="btn btn-secondary w-[48%] transition-transform duration-300 transform hover:scale-105"
              onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
