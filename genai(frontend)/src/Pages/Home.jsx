import React, { useEffect } from 'react'
import CreateAxiosInstance from '../axios/axios'
import { useNavigate } from 'react-router-dom'
import google1 from '../Assets/google1.png'
import google2 from '../Assets/google2.png'
import google3 from '../Assets/google3.png'
// import HandleError from './Error/Error'

const Home = () => {
  const navigate = useNavigate()
  const axiosInstance = CreateAxiosInstance();

  const NewChat = async () => {
    try {
      const res = await axiosInstance.post('chat/start-session/', {})
      navigate(`/chat/${res.data.session_id}`)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      {/* <button onClick={NewChat} className='p-3 border-2'>New Chat</button> */}
      <div className='grid grid-cols-3 gap-3 mt-6 px-20'>
        <div className='col-span-1 bg-[#F2A4FF] rounded-3xl'>
          <h1 className='text-5xl font-bold p-7 text-white'>Discover Inner
            Serenity</h1>
          <div className='flex justify-end'>
            <h1 className='text-5xl text-[#BDFF7B] rounded-full px-9 mx-10  p-2 bg-white'>With</h1>
          </div>
          <h1 className='text-7xl font-normal px-7  text-[#A700AA]'>aura</h1>
          <h1 className='p-7 px-24 my-5 text-[#52517B] text-2xl'>We develop a consistent and uplifting meditation practice that can bring about life-changing results.</h1>
        </div>
        <div className='col-span-2 bg-[#BDFF7B] rounded-3xl '>
          <div className='grid grid-cols-6 w-full'>
            <div className=' col-span-2 flex items-center justify-end   '>
              <img src={google1} alt='image' className='rounded-3xl h-2/4 mb-2 object-fill' />
            </div>
            <div className=' col-span-1 flex justify-end'>
              <img src={google2} alt='image' className='rounded-3xl w-1/10 h-40' />
            </div>
            <div className='col-span-3 relative flex items-end justify-end'>
              <button onClick={NewChat} className='p-3  bg-[#F2A4FF] text-white rounded-2xl absolute top-0 right-0 m-4'>
                Start New Chat
              </button>
              <img src={google3} alt='image' className='rounded-3xl h-4/5' />
            </div>


          </div>
        </div>

      </div>
    </div>   
  );
};

export default Home;
