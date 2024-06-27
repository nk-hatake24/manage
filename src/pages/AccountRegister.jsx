import React, { useState } from "react";
import axios from "axios";
import LayoutGeneral from "../layouts/LayoutGeneral";
import { useNavigate } from "react-router-dom";
import Switcher from "../components/Switcher";

export const AccountRegister = () => {
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState({
    name_account: "",
    email_account: "",
    budget: "",
    employee: "",
    resource: "",
    supplier: "",
    transaction: "",
    stock: "",
    report: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountData({
      ...accountData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3500/api/account/register",
        accountData
      );
      alert(response.data.message);
      navigate("/accounts");
    } catch (error) {
      alert(error.response.data.error);
      console.error("Error:", error);
    }
  };

  return (
    <LayoutGeneral>
      <section className="h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
        <div className="absolute top-2 left-2"> <Switcher /></div>
        <div className="w-full m-5 max-w-md bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="p-6 space-y-4 sm:p-8">
            <div className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
              <img
                className="w-8 h-8 mr-2"
                src="https://img.freepik.com/free-vector/hand-drawn-nerd-logo-template_23-2149199407.jpg?size=338&ext=jpg&ga=GA1.1.553209589.1715126400&semt=ais_use"
                alt="logo"
              />
              AgriManager
            </div>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
              Create a new account
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name_account"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Account Name
                </label>
                <input
                  type="text"
                  name="name_account"
                  id="name_account"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Account Name"
                  value={accountData.name_account}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email_account"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email_account"
                  id="email_account"
                  className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="name@company.com"
                  value={accountData.email_account}
                  onChange={handleChange}
                  required
                />
              </div>
              
              
              
              
              <button
                type="submit"
                className="w-full px-5 py-2.5 text-sm font-medium text-black border border-gray-700 rounded-lg bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 dark:bg-primary-600 dark:text-white dark:border-gray-200 dark:hover:bg-primary-700"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      </section>
    </LayoutGeneral>
  );
};


