import React, { useContext, useEffect, useState, useRef } from 'react'
import { BiSend } from 'react-icons/bi';
import { IoMdAttach } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import CreateAxiosInstance from '../axios/axios';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { ThreeDot } from 'react-loading-indicators';
import { OnPressKey } from '../Hooks/useOnKeyPress';
import { MyContext } from "../Context/MyContext"
import bot from "../Assets/chatbot.png"
import { IoAdd } from "react-icons/io5";
import img from "../Assets/testing.gif"
import { useSpeechRecognition } from 'react-speech-kit';
import { FaMicrophone } from "react-icons/fa";
import { FaRegCircleStop } from "react-icons/fa6";
import { HiOutlineSpeakerWave } from "react-icons/hi2";
import { CiSettings } from "react-icons/ci";
import Settings from "../Components/Settings"
import { useSelector } from 'react-redux';


const AnimatedText = ({ text, isTyping }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const intervalRef = useRef(null);
  const speechRef = useRef(null);

  useEffect(() => {
    if (isTyping) {
      let i = 0;
      intervalRef.current = setInterval(() => {
        setDisplayedText(text.slice(0, i));
        i++;
        if (i > text.length) {
          clearInterval(intervalRef.current);
          setAnimationComplete(true);
        }
      }, 20);
    } else {
      setDisplayedText(text);
      setAnimationComplete(true);
    }
    return () => clearInterval(intervalRef.current);
  }, [text, isTyping]);

  const handleStartSpeech = () => {
    if (!isSpeaking) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      speech.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(speech);
      setIsSpeaking(true);
      speechRef.current = speech;
    }
  };



  const handleStopSpeech = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }

  return (
    <h1 className={`py-3 px-5 text-lg max-w-[38rem] rounded-3xl text-primary flex flex-col`}>
      {displayedText}
      {animationComplete && (
        <>
          {!isSpeaking ? (
            <HiOutlineSpeakerWave
              className='cursor-pointer transition-all ease-in-out delay-700'
              onClick={handleStartSpeech}
            />
          ) : (
            <FaRegCircleStop
              className='cursor-pointer transition-all ease-in-out delay-700 text-red-600'
              onClick={handleStopSpeech}
            />
          )}
        </>
      )}
    </h1>
  );
};

const Chat = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const axiosInstance = CreateAxiosInstance();
  const [siderBar, setSiderBar] = useState(localStorage.getItem('sidebar'))
  const [message, setMessage] = useState([])
  const [userMessage, setUserMessage] = useState("")
  const [input, setInput] = useState(null)
  const { login } = useContext(MyContext)
  const [theme, setTheme] = useState("theme-focus-and-clarity")
  const [history, setHistory] = useState([])
  const [check, setCheck] = useState(false)
  const [voice, setvoice] = useState(false)
  const [settings, setSettings] = useState(false)
  const [name, setName] = useState()

  const mainTheme = useSelector((state) => state.theme)

  useEffect(() => {
    async function getData() {
      try {
        const res = await axiosInstance.get("user/profile/")
        setName(res.data.first_name)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  }, [])

  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      setUserMessage(result)
    }
  })

  const startvoice = () => {
    setvoice(true)
    listen()
  }

  const stopvoice = () => {
    setvoice(false)
    stop()
  }

  useEffect(() => {
    localStorage.setItem("sidebar", siderBar)
  }, [siderBar])

  const handleMessage = (e) => {
    setUserMessage(e.target.value);
  };

  const sendMessage = () => {
    if (userMessage) {
      const newMessage = userMessage;
      setInput(userMessage)
      setMessage(prevMessages => [...prevMessages, { user: newMessage, response: "", isTyping: false }])
      setUserMessage("");
      stopvoice()
    }
  };

  OnPressKey(sendMessage, "Enter")

  useEffect(() => {
    if (input) {
      async function Message() {
        try {
          const res = await axiosInstance.post("chat/start_chat/", { message: input, session_id: id });
          console.log(res.data.theme)
          const botResponse = res.data.message;
          setMessage(prevMessages => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1].response = botResponse;
            updatedMessages[updatedMessages.length - 1].isTyping = true;
            return updatedMessages;
          });
          setCheck(!check)
          setTheme(res.data.theme)
        } catch (error) {
          console.log(error);
        }
      }
      Message();
    }
  }, [input]);

  useEffect(() => {
    async function getData() {
      try {
        const res = await axiosInstance.get("chat/get_chat_session/")
        setHistory(res.data)
      } catch (error) {
        console.log(error);
      }
    } getData()
  }, [check, setCheck])

  useEffect(() => {
    async function getChat() {
      try {
        const response = await axiosInstance.get(`chat/get_chat/?session_id=${id}`)
        const processedMessages = response.data.map(item => ({
          user: item.user_message,
          response: item.bot_response,
          isTyping: false
        }));
        setMessage(processedMessages)
      } catch (error) {
        console.log(error)
      }
    } getChat()
  }, [id])


  const newSession = async () => {
    const res = await axiosInstance.post("chat/start-session/", {})
    navigate(`/chat/${res.data.session_id}`)
  }

  return (
    <div className={`flex h-screen ${mainTheme === "Dark" ? "bg-[#171717] text-white" : theme}`}>
      {settings && <Settings onClose={() => setSettings(false)} />}
      <div className={`transition-all duration-300 ${siderBar ? 'w-60' : 'w-16'} hidden  h-full md:flex md:flex-col`}>
        <div className={`p-4 cursor-pointer flex ${siderBar ? "flex-row" : "flex-col"} justify-between items-center`}>
          <RxHamburgerMenu onClick={() => setSiderBar(!siderBar)} className='size-6' />
          {siderBar ? (<button onClick={newSession}>New Chat</button>) : (<IoAdd onClick={newSession} className='mt-5 size-8' />)}
        </div>
        <div className={`mt-10 flex-1 overflow-y-auto`}>
          <div className={`flex flex-col gap-1`}>
            {siderBar && [...history].reverse().map((d) => (
              <NavLink key={d.session_id} to={`/chat/${d.session_id}`} className={({ isActive }) => isActive ? `  mx-3  p-3 rounded-lg ${mainTheme === "Dark" ? "bg-[#343541]" : `active`} duration-500 text-theme` : `hover:bg-hover mx-3 p-3 rounded-lg text-theme`}>{d.summary}</NavLink>
            ))}
          </div>
        </div>
      </div>
      <div className={`flex-1 flex flex-col `}>
        <div className={`${mainTheme === "Dark" ? "bg-[#171717]" : theme} gap-5 h-20 flex flex-row justify-end px-10 items-center shadow-md`}>
          <div
            className="p-2 rounded-full hover:cursor-pointer hover:scale-125 transition-all"
            onClick={() => setSettings(true)} >
            <CiSettings className="size-8" />
          </div>
          <button className='border-2' onClick={() => navigate("/appointment")}>Relif</button>
          {
            login ? (
              <Link to="/profile" className='size-10'><img src={`https://api.dicebear.com/9.x/initials/svg?seed=${name}`} alt="" className='rounded-full' /></Link>
            ) : (
              <button onClick={() => navigate("/login")} className='border-2 text-theme'>Login</button>
            )
          }
        </div>
        <div className={`flex-1 overflow-y-auto ${mainTheme === "Dark" ? "bg-[#212121]" : "bg-theme"}`}>
          <div className='flex items-center flex-col gap-y-2 p-4'>
            {message.length > 0 ?
              message.map((d, i) => (
                <div key={i} className='lg:w-7/12'>
                  <div className='flex justify-end my-3'>
                    <h1 className={`text-lg py-3 px-5 max-w-[30rem] rounded-3xl ${mainTheme === "Dark" ? "bg-[#2f2f2f] text-white" : `${theme} text-theme`}`}>
                      {d.user}
                    </h1>
                  </div>
                  {d.response === "" ? (
                    <div className='flex justify-start flex-row'>
                      <img src={bot} className='size-12' alt="" />
                      <div className='lg:ms-4'><ThreeDot variant="pulsate" color="#484848" size="medium" text="" textColor="" /></div>
                    </div>
                  ) : (
                    <div className='flex text-theme justify-start flex-row items-start'>
                      <img src={bot} className='size-12' alt="" />
                      <div className='flex flex-col items-start'>
                        <AnimatedText text={d.response} isTyping={d.isTyping} />
                      </div>
                    </div>
                  )}
                </div>
              )) : (
                <div className='flex justify-center items-center mt-32 flex-col'>
                  <img src={img} alt="" className='size-40' />
                  <h1 className='text-2xl mt-5'>Hello <span className='font-bold'>{name}</span>! how can i help you today </h1>
                </div>
              )
            }
          </div>
        </div>
        <div className={`w-full flex justify-center items-center flex-row gap-x-2 p-4 ${mainTheme === "Dark" ? "bg-[#212121]" : "bg-theme"}`}>
          {
            voice === false ? (
              <FaMicrophone className="text-3xl text-theme cursor-pointer" onClick={startvoice} />
            ) : (
              <FaRegCircleStop className="text-3xl cursor-pointer text-red-600" onClick={stopvoice} />
            )
          }
          <input
            type="text"
            className={`focus:outline-none placeholder:text-gray-600 lg:w-7/12 w-4/5 px-4 py-4 rounded-full ${mainTheme === "Dark" ? "bg-[#2f2f2f]" : theme} input-container`}
            placeholder="Type Message"
            onChange={handleMessage}
            value={userMessage}
          />
          <BiSend onClick={sendMessage} className="text-3xl text-theme cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Chat;