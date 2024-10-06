import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateAxiosInstance from '../axios/axios';

export const Modal = ({ handleCloseModal, modalContent, showModal }) => {
    const [formData, setFormData] = useState({
        id: '',
        user_mood: '',
    });

    const axiosInstance = CreateAxiosInstance();

    useEffect(() => {
        setFormData({
            id: modalContent || '',
            user_mood: '',
        });
    }, [modalContent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        console.log("Posting data:", {
            id: formData.id,
            user_mood: formData.user_mood
        });

        try {
            const res = await axiosInstance.post('book_session/', formData)
            console.log(res.data);
        } catch (error) {
            console.log(error)
        }

        handleCloseModal();
    };

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    id="static-modal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden bg-opacity-50 bg-gray-900"
                >
                    <div className="relative p-4 w-1/5 max-h-full">
                        <div className="relative bg-white rounded-3xl border-[#FF6B66] border">
                            <div className="flex justify-center my-6">
                                <div className="bg-white">
                                    <div className="mb-4 flex flex-col items-center">
                                        <div className="flex gap-3 ">
                                            <div className="">
                                                <label className="block text-md font-bold mb-2" htmlFor="user_mood">
                                                    Enter Your Emotion
                                                </label>
                                                <input
                                                    className="rounded-md w-full py-3 px-3 focus:outline-none bg-[#E6E0E9]"
                                                    name="user_mood"
                                                    type="text"
                                                    value={formData.user_mood}
                                                    onChange={handleChange}
                                                    placeholder="Enter Emotion"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSave}
                                        type="submit"
                                        className="bg-[#DF73FF] hover:bg-gray-900 w-full text-white font-thin py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline"
                                    >
                                        Book
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center p-4 md:p-5">
                                <button
                                    onClick={handleCloseModal}
                                    type="button"
                                    className="text-white ml-auto focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm px-5 py-2.5 text-center bg-[#FF6B66]"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};