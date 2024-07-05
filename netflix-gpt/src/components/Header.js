import React from "react";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { addUsers, removeUser } from "../utils/userslice";
import { NetflixURL } from "../utils/constant";
import { toggleGptSearchView } from "../utils/gptSlice";
import Logout from "../Image/logout.jpg";
import "./header.css";
import axios from "axios";
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const gptsearch = useSelector((store) => store.gpt.showGptSearch);

  useEffect(() => {
    const storedUserData = localStorage.getItem("NetflixGPT token");
    if (
      storedUserData == null ||
      storedUserData === "" ||
      storedUserData == undefined
    ) {
      navigate("/");
    } else {
      const fetchDetails = async () => {
        try {
          const res = await axios.post("https://netflix-gp-twith-mern.vercel.app/userInfo", {
            userId: storedUserData,
          });
          const user = {
            fullName: res?.data?.fullName,
            email: res?.data?.email,
          };
          setUser(user);
        } catch (error) {
          console.log(error);
        }
      };
      fetchDetails();
    }
  }, []);

  const [showMenu, setShowMenu] = useState(false);
  function showMenuHandler() {
    setShowMenu(!showMenu);
  }

  const handleGPT = () => {
    dispatch(toggleGptSearchView());
  };

  const handleLogout=()=>{

    localStorage.setItem('NetflixGPT token',"") 
    navigate("/")
  }

  return (
    <div
      className={`absolute w-[100%] md:flex md:h-24 justify-between bg-gradient-to-b from-black z-30 font-bold`}
    >
      <div className=" px-8 md:py-2 bg-gradient-to-b from-black ">
        <img className=" w-[175px] md:w-60" src={NetflixURL} alt="" srcset="" />
      </div>
      {user && (
        <div className="flex nav ">
          <div
            className="absolute top-2 right-4 w-[40px] flex-col justify-between z-10 flex object-none menu"
            onClick={showMenuHandler}
          >
            <span className="h-[6px] bg-white w-[100%] m-[2px] "></span>
            <span className="h-[6px] bg-white w-[100%] m-[2px]"></span>
            <span className="h-[6px] bg-white w-[100%] m-[2px]"></span>
          </div>
          <div
            className={`list-none flex-row header ${
              showMenu ? "openkijiye" : ""
            }`}
          >
            <div className="flex justify-between mx-2 my-4">
              <button
                onClick={handleGPT}
                className="bg-green-500 w-[100px] md:mx-4 md:my-auto p-2 rounded-lg font-bold text-white"
              >
                {gptsearch ? "HomePage" : "GPT search"}
              </button>
              <div className=" text-white my-auto mx-1 text-black  text-[20px]  rounded-full hover:bg-opacity-80">
                {user?.fullName}
              </div>
              <div onClick={handleLogout}>
                <img className="h-[50px] w-[50px] rounded-full cursor-pointer" src={Logout} alt="" srcset="" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
