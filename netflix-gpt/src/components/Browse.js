import Header from "./Header";
import useNowPlayings from "../Hooks/useNowPlaying";
import MainConatiner from "./MainConatiner";
import SecondoryConatiner from "./SecondoryConatiner";
import usePopuarPlayings from "../Hooks/usePopularPlaying";
import useUpcoming from "../Hooks/useUpcoming";
import { useSelector } from "react-redux";
import GptSearch from "./GptSearch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Browse = () => {
  const showGpt = useSelector((store) => store?.gpt?.showGptSearch);

  useNowPlayings();
  usePopuarPlayings();
  useUpcoming();
  return (
    <div>
      <Header />
      {showGpt ? (
        <GptSearch />
      ) : (
        <>
          <MainConatiner />
          <SecondoryConatiner />
        </>
      )}
    </div>
  );
};

export default Browse;
