import React, { createRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import cover from '../../assets/cover.jpg'
import profile from '../../assets/profile.png'
import { FaCamera } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";

export const Home = () => {
    //cropper
    const [image, setImage] = useState('');
    const [cropData, setCropData] = useState("");
    const cropperRef = createRef();
    const [post, setPost] = useState('')
    //cropper
    const dispatch = useDispatch()
    const [coverModal, setCoverModal] = useState(false)
    const auth = getAuth();
    const navigate = useNavigate()
    const data = useSelector(state => state.userLoginInfo.userInfo)
    const [verify, setVerify] = useState(false)
    useEffect(() => {
        if (!data) {
            navigate("/login");
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("auth");
            if (user && user.emailVerified) {
                setVerify(true);
                dispatch(userLoginInfo(user.user))
          localStorage.setItem('userLoginInfo', JSON.stringify(userLoginInfo(user.user)))
            }
        });

        return () => unsubscribe();
    }, [data, auth, navigate]);
    let handleCoverModal = () => {
        setCoverModal(true)
    }
    console.log(coverModal);

    //cropper
    const onChange = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };
    const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
            const storage = getStorage();
            const storageRef = ref(storage, 'some-child');
            const message4 = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
            uploadString(storageRef, message4, 'data_url').then((snapshot) => {
                getDownloadURL(storageRef).then((downloadURL) => {
                    console.log(downloadURL, 'downloadurl');
                    updateProfile(auth.currentUser, {
                        photoURL: downloadURL
                    })
                });
            });

        }
    };
    //cropper
    return (
        <div>
            {coverModal
                ?
                <div className='h-screen w-full bg-purple flex justify-center items-center'>
                    <div className='bg-white p-5'>
                        <h1 className='font-rbt text-purple font-semibold'>UPLOAD YOUR COVER PHOTO</h1>
                        <input onChange={onChange} className='mt-[15px]' type="file" />
                        <div className='w-[300px] h-[200px] overflow-hidden m-auto'>
                            <Cropper
                                ref={cropperRef}
                                style={{ height: 400, width: "100%" }}
                                zoomTo={0.5}
                                initialAspectRatio={1}
                                preview=".img-preview"
                                src={image}
                                viewMode={1}
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                                guides={true}
                            />
                        </div>
                        <div>
                            <button onClick={getCropData} className=' mt-7 bg-purple text-white w-[200px] py-2  rounded-full text-center cursor-pointer'>
                                Upload
                            </button>
                            <button onClick={() => setCoverModal(false)} className=' mt-7 bg-red-600 text-white w-[200px] py-2 rounded-full text-center cursor-pointer'>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
                :
                <div>
                    {
                        verify ?
                            <div>
                                <img className='h-screen w-full object-cover relative' src={cover} alt="" />
                                <div onClick={handleCoverModal} className='bg-white w-[60px] h-[60px] rounded-lg absolute bottom-[40px] right-[40px]'>
                                    <FaCamera className='text-purple text-[40px] ml-[9px] mt-[8px]' />
                                </div>
                                <div className='bg-white rounded-lg h-[330px] w-[330px] absolute bottom-[-150px] left-[50px]'>
                                    <div className='relative'>
                                        <img className='p-[5px]' src={profile} alt="" />
                                        <FaCamera className='text-purple text-[50px] rounded-lg ml-[9px] mt-[8px] absolute bottom-[20px] right-[20px] bg-white p-2 ' />
                                    </div>
                                </div>
                                <div className='mt-[180px] text-center'>
                                    <h1 className='font-rbt font-bold text-[30px]'>Shammi</h1>
                                    <p >I’m the most awesome person I know. </p>
                                </div>
                                <div className='flex justify-center items-center mt-[40px] gap-5'>
                                    <button className=' bg-purple text-white w-[200px] py-3  rounded-lg text-center cursor-pointer'>+ Add to story</button>
                                    <h1 className='bg-[#9940923a] text-black w-[200px] py-3  rounded-lg text-center cursor-pointer'>Edit profile</h1>
                                    <div className='bg-[#9940923a] h-[48px] w-[60px] rounded-lg'>
                                        <HiDotsHorizontal className='ml-[22px] mt-[18px]' />
                                    </div>
                                </div>
                                <div className='ml-[50px] mt-[80px] mr-[50px]'>
                                    <h1 className='font-bold font-rbt text-[20px]'>Posts</h1>
                                    <div className='flex justify-center items-center gap-10'>
                                
                                        <input onChange={(e)=>setPost(e.target.value)} className='py-3 text-center ' type="text" placeholder="Whats on your mind?" />
                                        <button className=' bg-purple text-white px-3 py-2 rounded-lg text-center cursor-pointer'>Post</button>
                                    </div>
                                </div>
                                <div className='ml-[50px] mt-[50px] mr-[50px]'>
                                    <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem aperiam voluptas expedita esse aliquid vel modi inventore accusantium, et autem laudantium illum earum sapiente adipisci ipsum velit facere tenetur optio.</h1>
                                </div>

                            </div>
                            :
                            <div className='h-screen w-full bg-purple flex justify-center items-center'>
                                <div className='bg-white p-[80px]'>
                                    <h1 className='font-rbt text-purple font-semibold'>PLEASE VERIFY YOUR EMAIL</h1>
                                    <button className=' mt-7 bg-purple text-white w-[200px] py-3  rounded-full text-center cursor-pointer'>
                                        <Link to='/login'>Back To Login</Link>
                                    </button>

                                </div>
                            </div>
                    }

                </div>

            }
        </div>


    )
}
