import React from 'react';
import {Link} from 'react-router-dom';

const LoginBtn = () => {
  return (
    <>
      <Link
      to='/login'
      >
        <button
          className='border-[1px] border-slate-200 text-slate-200 text-xs items-center rounded-lg w-auto my-4 px-4 py-2 justify-end hover:bg-[#2a2ea8] transition duration-200 hover:scale-105 sm:text-sm md:text-md lg:text-xl'
        >
          login
        </button>
      </Link>
    </>
  )
}
export default LoginBtn;