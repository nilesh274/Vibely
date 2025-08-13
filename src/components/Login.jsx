import React, { useState } from 'react';
import InputTxt from './InputTxt';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as authLogin } from '../store/AuthSlice';
import authService from '../appwrite/Auth';
import { useForm } from 'react-hook-form';
import { no } from './index';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState(""); 
    const [isError, setIsError] = useState(false); 

    const login = async (data) => {
        setError(""); 
        setIsError(false); 

        try {
            const session = await authService.login(data);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) {
                    dispatch(authLogin(userData));
                    navigate("/"); 
                    window.location.reload();
                }
            }
        } catch (error) {
            setIsError(true);
            if (error.message && error.message.includes("Invalid credentials")) {
                setError("Invalid credentials. Please check your email and password.");
            } else {
                setError("An error occurred. Please try again.");
            }
            setTimeout(() => {
                setIsError(false);
                setError("");
            }, 5000);
        }
    };

    return (
        <>
            {isError && (
                <div className="fixed top-15 left-1/2 transform -translate-x-1/2 w-auto px-4 my-3">
                    <div className="bg-slate-100 border-2 text-black p-2 rounded-2xl text-center mx-auto">
                        <div className="flex items-center justify-center gap-3 md:gap-4">
                            <img src={no} alt="Error icon" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                            <span className="text-sm sm:text-md md:text-lg lg:text-xl font-semibold text-black">
                                {error}
                            </span>
                        </div>
                    </div>
                </div>
            )}
            <div className="min-h-screen bg-white flex items-center justify-center dark:bg-black">
                <div className="max-w-md w-full bg-gray-100 mx-6 sm:mx-0 p-8 rounded-xl shadow-lg dark:bg-[#1a1b33]">
                    <h2 className="text-[12px] sm:text-lg md:text-xl lg:text-2xl font-bold text-center text-gray-800 mb-2 dark:text-slate-200">
                        Login
                    </h2>
                    <form className="space-y-6" onSubmit={handleSubmit(login)}>
                        <div>
                            <InputTxt
                                label="Email"
                                className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-lg outline-none dark:text-slate-200 dark:bg-transparent"
                                placeholder="Enter your email"
                                {...register("email", {
                                    required: true,
                                    validate: {
                                        matchPattern: (value) =>
                                            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be valid",
                                    },
                                })}
                            />
                        </div>
                        <div>
                            <InputTxt
                                label="Password"
                                type="password"
                                className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-lg outline-none dark:text-slate-200 dark:bg-transparent"
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: true,
                                })}
                            />
                        </div>
                        {isError && (
                            <div className='text-red-600 mt-8 text-center text-sm sm:text-[12px] md:text-lg lg:text-xl'>
                                {error}
                            </div>
                        )}
                        <div>
                            <button
                                type="submit"
                                className="text-sm sm:text-md md:text-lg lg:text-xl w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <div className="mt-2 text-center text-xs md:text-sm text-gray-600">
                        <Link to="/SignUp" className="text-blue-500 hover:text-blue-700">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
