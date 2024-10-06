import React, { useEffect, useState } from 'react';
import CreateAxiosInstance from '../axios/axios';
import { Modal } from '../Components/Modal';

const Appointment = () => {
    const [selectedSection, setSelectedSection] = useState('therapist');
    const axiosInstance = CreateAxiosInstance()
    const [therapist, setTherapist] = useState([])
    const [exercise, setExercise] = useState([])
    const [education, setEducation] = useState([])

    useEffect(() => {
        async function getData() {
            try {
                const therapist = await axiosInstance.get('get_specialist/')
                setTherapist(therapist.data)
                const exercise = await axiosInstance.get('get_exercise/')
                setExercise(exercise.data)
                const education = await axiosInstance.get('get_exercise/')
                setEducation(education.data)
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    }, [])

    const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleOpenModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalContent('');
  };

    return (
        <div className='mt-6 px-20'>
            <div className='flex space-x-4 mb-4 bg-slate-300 items-center justify-center p-3'>
                <button
                    className={`${selectedSection === 'therapist' ? 'text-3xl font-bold' : 'text-xl'} p-3 text-white rounded-lg `}
                    onClick={() => setSelectedSection('therapist')}>
                    Therapist
                </button>
                <button
                    className={`${selectedSection === 'exercise' ? 'text-3xl font-bold' : 'text-xl'} p-3 text-white `}
                    onClick={() => setSelectedSection('exercise')}>
                    Exercise
                </button>
                <button
                    className={`${selectedSection === 'education' ? 'text-3xl font-bold' : 'text-xl'} p-3 text-white `}
                    onClick={() => setSelectedSection('education')}>
                    Education
                </button>
            </div>

            {selectedSection === 'therapist' ? (
                <div>
                    <h2 className='text-2xl font-bold'>Therapist Section</h2>
                    <p>This is where you can book an appointment with a therapist.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {therapist.map((d) => (
                            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6" key={d.id}>
                                <div className="flex">
                                    <img
                                        className="w-24 h-24 rounded-full"
                                        src={`${d.photo}`}
                                        alt="Therapist"
                                    />
                                    <div className="ml-4">
                                        <h2 className="text-xl font-bold">{d.name}</h2>
                                        <p className="text-gray-600">{d.degree}</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center">
                                        <span className="text-orange-500 text-lg mr-2">★</span>
                                        <h3 className="text-lg font-semibold">Specialization</h3>
                                    </div>
                                    <p className="text-gray-700">
                                        {d.specialization}
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center">
                                        <span className="text-orange-500 text-lg mr-2">✔</span>
                                        <h3 className="text-lg font-semibold">Next Available at</h3>
                                    </div>
                                    <p className="text-gray-700">{d.time}</p>
                                </div>
                                <div className="mt-6 flex justify-between">
                                    <button className="bg-orange-500 text-white py-2 px-4 rounded-lg" onClick={() => handleOpenModal(d.id)}>
                                        Book Session
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : selectedSection === 'exercise' ? (
                <div>
                    <h2 className='text-2xl font-bold'>Exercise Section</h2>
                    <p>This s   ection contains recommended exercises for your health.</p>
                    <div className="flex items-center justify-center">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {exercise.map((d) => (
                                <div key={d.id} className="relative bg-white rounded-3xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden">
                                    <img
                                        className="w-full h-48 object-cover"
                                        src={`${d.photo}`}
                                        alt="Exercise"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-2xl font-semibold text-gray-800">{d.name}</h3>
                                        <p className="text-gray-600 mt-2">{d.description}</p>
                                        <div className="mt-4">
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                {d.duration}
                                            </span>
                                        </div>
                                        <div className="mt-6 flex justify-between items-center">
                                            <button className="bg-blue-500 text-white py-2 px-4 rounded-lg transform hover:scale-105 transition-transform duration-300">
                                                Start Exercise
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                </div>
                
            ) : (
                <div>
                    <h2 className='text-2xl font-bold'>Education Section</h2>
                    <p>This section provides educational resources for mental and physical health.</p>
                    <div className="min-h-screen py-10 px-6">
                        {/* Header */}
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Relaxation Videos</h1>
                            <p className="text-lg text-gray-600">Curated videos to help you relax and unwind</p>
                        </div>

                        {/* Video Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Video 1 */}
                            {
                                education.map((d) => (
                                    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300">
                                        <iframe
                                            className="w-full h-48"
                                            src={`https://www.youtube.com/embed/${d.link}`}
                                            title="Relaxation Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                        <div className="p-4">
                                            <h3 className="text-xl font-semibold text-gray-800">{d.name}</h3>
                                            <p className="text-gray-600 mt-2">{d.description}</p>
                                        </div>
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>
            )}
            <Modal handleCloseModal={handleCloseModal}  modalContent={modalContent} showModal={showModal}/>
        </div>
    );
};

export default Appointment;
