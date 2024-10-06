import { createContext, useState } from 'react';
export const MyContext = createContext("");

const UserProvider = ({ children }) => {
  const [login, setLogin] = useState(!!localStorage.getItem("access_token"));
  
  return (
    <MyContext.Provider value={{login, setLogin}}>
      {children}
    </MyContext.Provider>
  );
};

const withUser = (Child) => (props) => (
  <MyContext.Consumer>
    {(context) => <Child {...props} {...context} />}
  </MyContext.Consumer>
);

export { UserProvider, withUser };