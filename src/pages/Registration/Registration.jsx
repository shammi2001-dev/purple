import React, { useState } from 'react'
import { IoEyeSharp } from "react-icons/io5";
import { PiEyeSlashFill } from "react-icons/pi";
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";

const Registration = () => {
    const auth = getAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [fullname, setFullname] = useState('')
    const [password, setPassword] = useState('')

    const [emailerr, setEmailerr] = useState('')
    const [fullnameerr, setFullnameerr] = useState('')
    const [passworderr, setPassworderr] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [success, setSuccess] = useState('')
    const handleEmail = (e) => {
        setEmail(e.target.value);
        setEmailerr('')
    }
    const handleFullname = (e) => {
        setFullname(e.target.value);
        setFullnameerr('')
    }
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setPassworderr('')
    }
    const handleSubmit = () => {
        if (!email) {
            setEmailerr('PLEASE ENTER YOUR EMAIL FIRST');
        } else {
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                setEmailerr('INVALID EMAIL')
            }
        }
        if (!fullname) {
            setFullnameerr('PLEASE ENTER YOUR FULLNAME FIRST');
        }
        if (!password) {
            setPassworderr('PLEASE ENTER YOUR PASSWORD FIRST');
        }
        if (email && fullname && password && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((user) => {
                    updateProfile(auth.currentUser, {
                        displayName: fullname,
                        photoURL: './src/assets/cover.jpg'
                    }).then(() => {
                        sendEmailVerification(auth.currentUser)
                        console.log(user, 'userrr');
                        setSuccess('REGISTRATION DONE & PLEASE VERIFY YOUR EMAIL');
                        setEmail("")
                        setFullname("")
                        setPassword("")
                        setTimeout(() => {
                            navigate('/login')
                        }, 2000)
                    })

                })
                .catch((error) => {
                    const errorCode = error.code;
                    console.log(errorCode);
                    if (errorCode.includes('auth/email-already-in-use')) {
                        setEmailerr('Email already in use');
                    }
                });
        }
    }
    return (
        <div className='flex justify-center mt-[100px]'>
            <div>
                <h1 className='font-rbt font-bold text-[30px] text-center text-purple'>Get started</h1>
                <p className='font-rbt text-center'>Free register and you can enjoy it</p>
                <p className='font-rbt text-center bg-green-600 text-white'>{success}</p>
                <div>
                    <input onChange={handleEmail} value={email} className='w-96 border border-purple outline-none rounded-lg p-3 mt-5' type="email" placeholder='Email Address' />
                    <p className='font-rbt text-red-600 text-[10px] font-bold'>{emailerr}</p>
                </div>
                <div>
                    <input onChange={handleFullname} value={fullname} className='w-96 border border-purple outline-none rounded-lg p-3 mt-4' type="text" placeholder='Full Name' />
                    <p className='font-rbt text-red-600 text-[10px] font-bold'>{fullnameerr}</p>
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
                <div onClick={handleSubmit} className='ml-[90px] mt-7 bg-purple text-white w-[200px] p-3 rounded-full text-center cursor-pointer'>
                    <button>Sign Up</button>
                </div>
                <p className='text-center mt-6 font-rb text-[13px]'>Already  have an account ? <span className='font-bold text-purple'><Link to='/login'>Sign In</Link></span> </p>
            </div>

        </div>
    )
}

export default Registration