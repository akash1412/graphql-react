import React, { useState, useRef } from "react";

import "./auth.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    let requestBody = {
      query: `
        query {
          login(email:"${email}",password:"${password}"){
            token
            tokenExpiration
            userId
          }
        }
      `,
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput:{email:"${email}",password:"${password}"}){
              _id
              email
            }
          }
        `,
      };
    }

    try {
      const request = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await request.json();

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(isLogin);

  const handleSwitchModeClick = () => {
    setIsLogin(!isLogin);
  };

  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      <div className='form-control'>
        <label htmlFor='email'>E-mail</label>
        <input type='email' id='email' ref={emailRef} required />
      </div>
      <div className='form-control'>
        <label htmlFor='password'>Password</label>
        <input type='password' id='password' ref={passwordRef} required />
      </div>
      <div className='form-actions'>
        <button type='submit'>submit</button>
        <button type='button' onClick={handleSwitchModeClick}>
          Switch to {isLogin ? "signup" : "login"}
        </button>
      </div>
    </form>
  );
};

export default AuthPage;
