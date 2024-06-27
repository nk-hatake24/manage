import React, { useEffect, useState } from "react";
import axios from "axios";
import LayoutGeneral from "../layouts/LayoutGeneral";
import { Link, useNavigate } from "react-router-dom";
import Switcher from "../components/Switcher";

const Modal = ({ message, onClose }) => {
  const username = localStorage.getItem('username')
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex gap-5  bg-gray-50 dark:bg-gray-900 dark:text-gray-50 text-gray-900  p-6 rounded  flex-col items-center shadow-md">
        <br/>
        <p>{message}</p>
        <p> {(username && username==! null)?`welcome ${username}`:''}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {

    if (token) {
      // Rediriger vers la page d'accueil ou une autre page protégée
      navigate('/homedash');
    }
  }, [navigate]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3500/api/employee/login', loginData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.employee.name);
      localStorage.setItem('id', response.data.employee.id);
      localStorage.setItem('userEmail', response.data.employee.email);
      localStorage.setItem('userFunction', response.data.employee.function);
      setModalMessage(response.data.message);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/homedash');

      }, 2000);
    } catch (error) {
      setModalMessage(error.response.data.message);
      setShowModal(true);
    }
  };

  return (
    <LayoutGeneral>
      {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="absolute top-3 left-3">
          <Switcher />
        </div>
        <div className="flex flex-col items-center justify-center h-screen px-8">
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://img.freepik.com/free-vector/hand-drawn-nerd-logo-template_23-2149199407.jpg?size=338&ext=jpg&ga=GA1.1.553209589.1715126400&semt=ais_use"
              alt="logo"
            />
            AgriManager
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleLoginSubmit}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="name@company.com"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <Link
                    to="/register"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-gray-300"
                  >
                    register now
                  </Link>
                </div>
                <button
                  type="submit"
                  className="w-full text-black border border-gray-700 bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-200 dark:bg-primary-600 dark:text-white dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayoutGeneral>
  );
};

export default Login;
