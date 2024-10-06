import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../Redux/Actions/themeactions';

const Modal = ({ onClose }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);

  const changeTheme = (e) => {
    const selectedTheme = e.target.value;
    dispatch(setTheme(selectedTheme));
  };
  const themes = ['Emotions', 'Dark'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${
        theme === "Dark" ? "bg-[#171717]" : "bg-white"
      } p-6 rounded-lg shadow-lg max-w-md w-full relative`}>
        <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" onClick={onClose}>
          &times;
        </button>
        <h1 className="text-lg font-semibold">Settings</h1>
        <label htmlFor="theme" className="block mb-2">Select Theme</label>
        <select
          value={theme} 
          onChange={changeTheme}
          name="theme"
          className={`border-2 p-2 w-full ${theme === "Dark" ? "bg-[#171717]" : "bg-white"} rounded-lg`}
        >
          {themes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Modal;
