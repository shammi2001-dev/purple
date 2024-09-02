import React, { useState } from 'react'
import { IoEyeSharp } from "react-icons/io5";
import { PiEyeSlashFill } from "react-icons/pi";
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../../slices/userSlice';

const Login = () => {
  const auth = getAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [emailerr, setEmailerr] = useState('')
  const [passworderr, setPassworderr] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState('')
 
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailerr('')
  }

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPassworderr('')
  }
  const handleSignIn = () => {
    if (!email) {
      setEmailerr('PLEASE ENTER YOUR EMAIL FIRST');
    } else {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        setEmailerr('INVALID EMAIL')
      }
    }

    if (!password) {
      setPassworderr('PLEASE ENTER YOUR PASSWORD FIRST');
    }
    if (email && password && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          setSuccess('LOGIN SUCCESSFULL');
          console.log(user.user);
          dispatch(userLoginInfo(user.user))
          localStorage.setItem('userLoginInfo', JSON.stringify(userLoginInfo(user.user)))
          setEmail("")
         
          setPassword("")
          setTimeout(() => {
              navigate('/')
          }, 2000)    
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          if (errorCode.includes('auth/invalid-credential')) {
            setEmailerr('PLEASE ENTER RIGHT EMAIL & PASSWORD');
          }
        });

    }

  }
  return (
    <div className='flex justify-center mt-[100px]'>
      <div>
        <h1 className='font-rbt text-[24px] text-center text-purple'>Login to your account</h1>
        <p className='font-rbt text-center bg-green-600 text-white'>{success}</p>
        <div>
          <input onChange={handleEmail}  value={email} className='w-96 border border-purple outline-none rounded-lg p-3 mt-6' type="email" placeholder='Email Address' />
          <p className='font-rbt text-red-600 text-[10px] font-bold'>{emailerr}</p>
        </div>

        <div className='relative'>
          <input onChange={handlePassword} value={password} className='w-96 border border-purple outline-none rounded-lg p-3 mt-4' type={showPassword ? 'text' : 'password'} placeholder='Password' />
          <p className='font-rbt text-red-600 text-[10px] font-bold'>{passworderr}</p>
          {
            showPassword ?
              <IoEyeSharp onClick={() => setShowPassword(!showPassword)} className='absolute top-[34px] right-[20px] text-purple' />
              :
              <PiEyeSlashFill onClick={() => setShowPassword(!showPassword)} className='absolute top-[34px] right-[20px] text-purple' />
          }

        </div>
        <div onClick={handleSignIn} className='ml-[90px] mt-7 bg-purple text-white w-[200px] p-3 rounded-full text-center cursor-pointer'>
          <button>Login To Continue</button>
        </div>
        <p className='text-center mt-6 font-rb text-[13px]'>Don't have an account ? <span className='font-bold text-purple'><Link to='/registration'>Sign Up</Link></span> </p>
      </div>

    </div>
  )
}

export default Login