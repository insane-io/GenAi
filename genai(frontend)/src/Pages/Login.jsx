import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../Context/MyContext";
import axios from "axios";

const Login = () => {
    const { setLogin, login } = useContext(MyContext); 
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = new FormData();
        postData.append("email", formData.email);
        postData.append("password", formData.password);

        try {
            const res = await axios.post(`http://13.53.78.41:8000/user/login/`, postData);
            localStorage.setItem("access_token", res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);
            setLogin(true); // Set login to true
        } catch (error) {
            console.error("Error:", error);
            setError("Invalid email or password");
        }
    };

    useEffect(() => {
        if (login) {
            navigate("/"); // Navigate only after successful login
        }
    }, [login, navigate]); // Triggers navigation when `login` state changes

    return (
        <>
            <div className="grid grid-cols-5 ">
                <div className="col-start-2 col-span-3 m-16 flex flex-col justify-center">
                    <h1
                        style={{ fontSize: '2rem', textAlign: 'center', fontWeight: 'bold', margin: '20px 0' }}>
                        Login
                    </h1>
                    <label
                        htmlFor="user-email"
                        className="block text-md font-bold mb-2"
                        style={{ paddingTop: "13px" }}>
                        Email
                    </label>
                    <input
                        id="user-email"
                        className="rounded-md w-full py-3 px-3  focus:outline-none bg-[#E3FEF0]"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        autoComplete="on"
                        required
                    />
                    <label
                        htmlFor="user-password"
                        className="block text-md font-bold mb-2"
                        style={{ paddingTop: "22px" }}>
                        Password
                    </label>
                    <input
                        id="user-password"
                        className="rounded-md w-full py-3 px-3  focus:outline-none bg-[#E3FEF0]"
                        type="password"
                        name="password"
                        placeholder="******"
                        onChange={handleChange}
                        required
                    />
                    {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
                    <input
                        id="submit-btn"
                        type="submit"
                        name="submit"
                        value="LOGIN"
                        className="bg-[#0A9D50] hover:bg-gray-900 w-full mt-3 cursor-pointer text-white font-thin py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline"
                        onClick={handleSubmit}
                    />
                    {/* Uncomment this link if necessary */}
                    {/* <Link to="/signup" className="mb-4 flex justify-center my-3 text-sm hover:text-blue-800">
                        Don't Have an account?
                    </Link> */}
                </div>
            </div>
        </>
    );
};

export default Login;
