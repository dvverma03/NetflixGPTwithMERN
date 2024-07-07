import React, { useState, useRef, useEffect } from "react";
import Header from "./Header";
import { FormValidation } from "../utils/validate";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUsers } from "../utils/userslice";

const Login = () => {
  const email = useRef(null);
  const navigate = useNavigate();
  const password = useRef(null);
  const name = useRef();
  const dispatch= useDispatch()
  const [errMessage, setErrMessage] = useState(null);
  
  useEffect(()=>{
    const storedUserData = localStorage.getItem('NetflixGPT token');
    if(storedUserData){
         navigate("/browse")
    }
  },[])

  const handleButton = async () => {
    const message = FormValidation(email.current.value, password.current.value);
    setErrMessage(message);
    if (message) return;
    if (!isSignForm) {
      if (name.current.value === "") {
        setErrMessage("Name should not be empty");
        setTimeout(() => {
          setErrMessage("");
        }, 2000);
        return;
      }
      try {
        const res = await axios.post("https://netflix-gp-twith-mern.vercel.app/register", {
          email: email.current.value,
          password: password.current.value,
          fullName: name.current.value,
        });
        const user = {
          email: email.current.value,
          fullName: name.current.value,
        };
        dispatch(addUsers(user))
        console.log(res)
        localStorage.setItem('NetflixGPT token',res?.data?.user);
        navigate("/browse")
      } catch (error) {
        setErrMessage(error?.response?.data?.error);
        setTimeout(() => {
          setErrMessage("");
        }, 2000);
        console.log(error);
      }
    } else {
      // sign in
      try {
        const res = await axios.post("https://netflix-gp-twith-mern.vercel.app/login", {
          email: email.current.value,
          password: password.current.value,
        });
        const user = {
          email: email.current.value,
          fullName: res?.data?.fullName,
        };
        dispatch(addUsers(user))
        localStorage.setItem('NetflixGPT token',res?.data?._id);
        navigate("/browse")
      } catch (error) {
        setErrMessage(error?.response?.data?.error);
        setTimeout(() => {
          setErrMessage("");
        }, 2000);
        console.log(error);
      }
    }
  };

  const [isSignForm, setIsSignForm] = useState(true);
  const toggleSignForm = () => {
    setIsSignForm(!isSignForm);
  };
  return (
    <div>
      <Header />
      <div>
        <img
          className="absolute opacity-85 h-[110vh] md:h-[100vh] w-[100vw]"
          src="https://assets.nflxext.com/ffe/siteui/vlv3/c38a2d52-138e-48a3-ab68-36787ece46b3/eeb03fc9-99c6-438e-824d-32917ce55783/IN-en-20240101-popsignuptwoweeks-perspective_alpha_website_large.jpg"
          alt=""
          srcset=""
        />
      </div>
      <div className="absolute p-12 bg-black w-[90%] md:w-3/12 my-36 mx-auto text-white right-0 left-0 rounded-lg bg-opacity-80">
        <h1 className="font-900 text-4xl py-4">
          {isSignForm ? "Sign in" : "Sign up"}
        </h1>

        {!isSignForm && (
          <input
            ref={name}
            type="text"
            placeholder="Name"
            className="p-3 my-4 w-full bg-gray-800 rounded-lg"
          />
        )}
        <input
          ref={email}
          type="email"
          placeholder="Email Address"
          className="p-3 my-4 w-full bg-gray-800 rounded-lg"
        />
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-3 my-4 w-full bg-gray-800 rounded-lg"
        />
        <p className="text-red-500">{errMessage}</p>
        <button
          className="bg-red-700 p-3 my-6 w-full rounded-lg"
          onClick={handleButton}
        >
          {isSignForm ? "Sign in" : "Sign up"}
        </button>
        <p className="cursor-pointer" onClick={toggleSignForm}>
          {" "}
          {isSignForm
            ? "New to Netflix? Sign up now"
            : "Already resiter User? Sign in now"}
        </p>
      </div>
    </div>
  );
};

export default Login;
