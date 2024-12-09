import React, { useState } from 'react';
import InputTxt from './InputTxt';
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { login as authLogin } from '../store/AuthSlice';
import authService from '../appwrite/Auth';
import { useDispatch } from 'react-redux';
import appwriteService from '../appwrite/Config';
import { no } from '.';

const SignUp = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");
    const [isError, setIsError] = useState(false); 


    const singup = async (data) => {
        setError("");
        try {
            const userData = await authService.createAccount(data);
            if (userData) {
                const userData = await authService.getCurrentUser(data);
                if (userData) {
                    dispatch(authLogin(userData));
                    const avatarUrl = authService.avatar({ Name: userData.name });                    
                    const userDetail = await appwriteService.createUserDetails(userData.$id, userData.name);
                    const AuthUser = await appwriteService.createAuthUser(userData.$id, userData.name, avatarUrl);                    

                    if (userDetail && AuthUser) {
                        navigate("/")
                        window.location.reload();
                    }
                }
            }
        } catch (error) {
            setIsError(true);
            setError(error.message);
            
            setTimeout(() => {
                setIsError(false);
                setError("");
            }, 5000);
        }
    }

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
                <div className="max-w-lg w-full bg-gray-100 mx-6 sm:mx-0 p-8 rounded-xl shadow-lg dark:bg-[#1a1b33]">
                    <h2 className="text-[12px] sm:text-lg md:text-xl lg:text-2xl font-bold text-center text-gray-800 mb-2 ms:mb-3 md:mb-4 dark:text-slate-200">SignUp</h2>
                    <form className="space-y-6" onSubmit={handleSubmit(singup)}>
                        <div>
                            <InputTxt
                                label='Name'
                                type='text'
                                className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-lg outline-none dark:bg-transparent dark:outline-none dark:text-slate-200'
                                placeholder='Enter the Name'
                                {...register("name", {
                                    required: true,
                                })}
                            />
                        </div>
                        <div>
                            <InputTxt
                                label='Email'
                                type='text'
                                className='mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-lg outline-none dark:bg-transparent dark:outline-none dark:text-slate-200'
                                placeholder='Enter the email'
                                {...register("email", {
                                    required: true,
                                    validate: {
                                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address",
                                    }
                                })}
                            />
                        </div>
                        <div>

                            <InputTxt
                                label='Password'
                                type='password'
                                className='mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-lg outline-none  dark:bg-transparent dark:outline-none dark:text-slate-200'
                                placeholder='Enter the password'
                                {...register("password", {
                                    required: true,
                                })}
                            />
                        </div>
                        {error && <p
                            className='text-red-600 mt-8 text-center text-sm sm:text-[12px] md:text-lg lg:text-xl'
                        >{error}
                        </p>}
                        <div>
                            <button

                                type="submit"
                                className="text-sm sm:text-md md:text-lg lg:text-xl w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
                            >
                                SignUp
                            </button>
                        </div>
                    </form>

                    <div className="mt-2 text-center text-xs md:text-sm text-gray-600">
                        <span className="text-black hover:text-black dark:text-slate-200">If you already have a account <Link to='/login' className="text-blue-500 hover:text-blue-700">Login</Link></span>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SignUp;