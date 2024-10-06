import React, { useContext, useEffect, useRef, useState } from 'react';
import { FiEdit } from "react-icons/fi";
// import { Modal2 } from '../Components/Modal2';
// import { motion } from "framer-motion";
import axiosInstance from '../axios/axios';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../Context/MyContext';
import axios from 'axios';
import CreateAxiosInstance from '../axios/axios';

const Profile = () => {

    const { setLogin } = useContext(MyContext)
    const axiosInstance = CreateAxiosInstance();

    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [appointment, setAppointment] = useState([])

    const handleOpenModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent('');
    };
    const [done, setDone] = useState([])

    useEffect(() => {
        async function getData() {
            try {
                const res = await axiosInstance.get("user/profile/")
                const response = await axiosInstance.get('get_appointment/')
                setAppointment(response.data)
                console.log(response.data)
                setDone(res.data)
            } catch (error) {

            }
        }
        getData()
    }, [showModal])

    const logOut = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate("/")
        setLogin(false)
    }
    return (
        <>
            <div className='flex flex-col items-center justify-center p-7 '>
                <div className="flex flex-col items-center mb-12">
                    <img src={`https://api.dicebear.com/9.x/initials/svg?seed=${done.first_name}`} alt="Profile" className="rounded-full" style={{ width: '170px', height: '170px' }} />
                    <span className="mt-4 text-lg font-semibold">{done?.first_name} {done?.last_name}</span>
                    <button className='mt-3 bg-red-400 px-4 py-2 rounded-xl text-white' onClick={logOut}>Log Out</button>
                </div>

                {/* About Me Section */}
                <div className="w-full max-w-screen-lg">
                    {/* Title, Line, and Edit Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-left text-2xl font-bold text-[#0A9D50]">About Me</h2>
                        <div className='ml-auto'>
                        </div>
                    </div>
                    <hr className="border-t-[1px] border-gray-300 w-full mb-6" />

                    {/* Input Field */}
                    <div className='sm:px-24'>
                        <div className=" grid grid-cols-3 gap-2">
                            <div className=' col-span-1'>
                                <h1 className='ps-5 font-semibold'>first name</h1>
                                <div className="w-full flex items-center ps-3 h-12 border-[2px] border-[#0A9D50] rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-400">{done.first_name}</div>
                            </div>
                            <div className=' col-span-1'>
                                <h1 className='ps-5 font-semibold'> last name</h1>
                                <div className="w-full flex items-center ps-3 h-12 border-[2px] border-[#0A9D50] rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-400">{done.last_name}</div>
                            </div>
                            <div className=' col-span-1'>
                                <h1 className='ps-5 font-semibold'>sex</h1>
                                <div className="w-full flex items-center ps-3 h-12 border-[2px] border-[#0A9D50] rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-400">{done?.sex}</div>
                            </div>
                        </div>
                        <div className=" grid grid-cols-5 gap-2 mt-3">
                            <div className=' col-span-5'>
                                <h1 className='ps-5 font-semibold'>email</h1>
                                <div className="w-full border-[2px] flex items-center ps-3 h-12 border-[#0A9D50] rounded-3xl focus:outline-none focus:ring-2 focus:ring-green-400">{done.email}</div>
                            </div>
                        </div>
                    </div>
                    <div className='my-10 rounded-xl'>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-left text-2xl font-bold text-[#0A9D50]">Appointments</h2>
                            <div className='ml-auto'>
                            </div>
                        </div>
                        <hr className="border-t-[1px] border-gray-300 w-full mb-6" />
                        {appointment.map((d) => (
                            <>
                                <div className='flex justify-between border-2 p-5 rounded-xl border-[#0A9D50]'>
                                    <div className='flex flex-col'>
                                        <h1 className='font-semibold text-2xl'>{d.specialist.name}</h1>
                                        <h1 className=' text-md'>{d.specialist.specialization}</h1>
                                    </div>
                                    <div>
                                        {/* <h1>Date: {d.date}</h1>
                                        <h1>Time: {d.time}</h1> */}
                                    </div>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
            {/* <Modal2 handleCloseModal={handleCloseModal} modalContent={modalContent} showModal={showModal} /> */}
        </>

    );
}

export default Profile;
