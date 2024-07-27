import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { TextGenerateEffect } from "./ui/text-generate-effect.tsx";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import GlossyContainer from "./GlossyContainer.js";
import VerticalScrollingTracks from "./VerticalScrollingTracks.js";
import AnimatedDivider from "./AnimatedDivider.js";
import VideoEmbed from "./VideoEmbed.js";
import { HoverBorderGradient } from "./ui/hover-border-gradient.tsx";
import AnimatedCounter from "./AnimatedCounter.js";
import useScrollAnimation from "./ScrollAnimation.js";
import useDelayAnimation from "./DelayAnimation.js";
import DemoContainer from "./DemoContainer.js";

import "../styles/Components/HomePage.css";

export default function HomePage() {
  const DEFAULT_TRACK_IDS = [
    "2IwL0fwckPbO9sau1EHslH", // Live from kitchen
    "5gcYcp5Tg5u4SO8zVa4nSS", // Pol
    "5bemClhFeQ7fcth7mjjnKO",
    "1LLgtfY4umP78sh5LmyVpW",
    "1AJHaJFNM2Q4UpJ1fG1bIi",
    "0y5CnV2idm2KkQEudDjfDT",
    "4vjvx7Zxkb4AltGcZ0BBvI",
    "1UbwpyozDvufPs6aNPW3ti",
    "6zMQAgnWYRvzNIQGfjmXad",
    "5GUYJTQap5F3RDQiCOJhrS",
  ];
  const [trackIds, setTrackIds] = useState(DEFAULT_TRACK_IDS);
  const [totalRecs, setTotalRecs] = useState(0);
  const [trendingGenres, setTrendingGenres] = useState([
    "Electronic",
    "Alternative",
    "Reggaeton",
  ]);
  const [hourlyIncrease, setHourlyIncrease] = useState(0);

  const [isTextGenComplete, setIsTextGenComplete] = useState(false);
  const [isDescVisible, setIsDescVisible] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isRandomLoading, setIsRandomLoading] = useState(true);

  const [isMouseOver, setIsMouseOver] = useState(false);

  const [scrollDiv1Ref, isDiv1Visible] = useScrollAnimation();
  const isTotalRecsVisible = useDelayAnimation(isDiv1Visible, 300);
  const isMoreInfoVisible = useDelayAnimation(isTotalRecsVisible, 500);

  const [scrollDiv2Ref, isDiv2Visible] = useScrollAnimation();
  const isVideoEmbedVisible = useDelayAnimation(isDiv2Visible, 500);

  const [scrollDemoRef, isDemoVisible] = useScrollAnimation();
  const isGradientVisible = useDelayAnimation(isDemoVisible, 500);
  const searchAnimate = useDelayAnimation(isDemoVisible, 50);
  const recAnimate = useDelayAnimation(isDemoVisible, 50);

  const [isTotalRecsHovered, setIsTotalRecsHovered] = useState(false);
  const [isMoreInfoHovered, setIsMoreInfoHovered] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const [isDemoContainerHovered, setIsDemoContainerHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleContainerClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsSwapped(!isSwapped);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const getBackgroundPosition = () => {
    if (isSwapped) {
      return {
        x: isMoreInfoHovered ? "31%" : "30%",
        y: isMoreInfoHovered ? "5%" : "0%",
        scale: 1,
        zIndex: 20,
        opacity: isAnimating ? 0.5 : 1,
        // rotate: isAnimating ? 3 : 0,
      };
    }

    return {
      x:
        isTotalRecsHovered && !isMoreInfoHovered
          ? "40%"
          : isMoreInfoHovered && isTotalRecsHovered
            ? "43%"
            : isTotalRecsVisible
              ? isMoreInfoVisible
                ? "32.5%" // Starting State
                : "30%"
              : "28%",
      y:
        isTotalRecsHovered && !isMoreInfoHovered
          ? "13%"
          : isMoreInfoHovered && isTotalRecsHovered
            ? "40%"
            : isMoreInfoVisible
              ? "7.5%" // Starting State
              : "0%",

      scale: isTotalRecsHovered ? 0.98 : isMoreInfoVisible ? 0.98 : 1,
      zIndex: 10,
      opacity: isAnimating ? 0.5 : 1,
    };
  };

  const getForegroundPosition = () => {
    if (isSwapped) {
      return {
        x:
          isMoreInfoHovered && !isTotalRecsHovered
            ? "40%"
            : isMoreInfoHovered && isTotalRecsHovered
              ? "43%"
              : isTotalRecsVisible
                ? isMoreInfoVisible
                  ? "32.5%"
                  : "30%"
                : "28%",
        y:
          isMoreInfoHovered && !isTotalRecsHovered
            ? "13%"
            : isMoreInfoHovered && isTotalRecsHovered
              ? "40%"
              : isMoreInfoVisible
                ? "7.5%"
                : "0%",
        scale: isMoreInfoHovered ? 0.98 : 0.98,
        zIndex: 10,
        opacity: isAnimating ? 0.5 : 1,
      };
    }

    return {
      x: isTotalRecsHovered ? "31%" : isTotalRecsVisible ? "30%" : "28%",
      y: isTotalRecsHovered ? "5%" : "0%",

      scale: 1,
      zIndex: 20,
      opacity: isAnimating ? 0.5 : 1,
    };
  };

  useEffect(() => {
    const getRandomRecs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/t4/random-recommendations`,
          { withCredentials: true }
        );
        if (response.data && response.data.length > 0) {
          setTrackIds(response.data);
          console.log("Random recommendations fetched:", response.data);
          console.log(trackIds, "Track ids");
        } else {
          console.log("Response null, setting default track ids");
          setTrackIds(DEFAULT_TRACK_IDS);
        }
      } catch (error) {
        console.error("Error fetching random recommendations", error);
        setTrackIds(DEFAULT_TRACK_IDS);
      } finally {
        setIsRandomLoading(false);
      }
    };
    getRandomRecs();
  }, []);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function handleMouseEnter() {
    setIsMouseOver(true);
  }

  function handleMouseLeave() {
    setIsMouseOver(false);
  }

  const handleTextGenComplete = useCallback(() => {
    setIsTextGenComplete(true);
    setIsDescVisible(true);
    // setIsScrollVisible(true);
  }, []);

  useEffect(() => {
    const getTotalRecs = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/t4/total-recommendations`,
          { withCredentials: true }
        );
        const [total, hourly] = response.data;
        setTotalRecs(total);
        setHourlyIncrease(hourly);
        // console.log("Total recommendations fetched:", response.data);
      } catch (error) {
        console.error("Error fetching total recommendations", error);
      }
    };

    getTotalRecs();
    const intervalId = setInterval(getTotalRecs, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const getTrendingGenres = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/t4/trending-genres`,
          { withCredentials: true }
        );
        setTrendingGenres(response.data || []);
      } catch (error) {
        console.error("Error fetching trending recommendations", error);
      }
    };

    getTrendingGenres();
  }, []);

  return (
    <div className="mt-[55px]">
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="h-[60vh] w-full bg-slate-800 relative flex flex-col items-center justify-center overflow-visible"
      >
        {/* Dot background div with enhanced mask */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-dot-white/[0.4]"></div>
          <motion.div
            className="absolute inset-0 bg-dot-thick-amber-500 transition-opacity duration-1000 ease-in-out"
            animate={{ opacity: isMouseOver ? 1 : 0 }}
            initial={{ opacity: 0 }}
            style={{
              WebkitMaskImage: useMotionTemplate`
                radial-gradient(
                  250px circle at ${mouseX}px ${mouseY}px,
                  black 0%,
                  transparent 100%
                )
              `,
              maskImage: useMotionTemplate`
                radial-gradient(
                  250px circle at ${mouseX}px ${mouseY}px,
                  black 0%,
                  transparent 100%
                )
              `,
            }}
          />
          <div className="absolute inset-0 bg-gray-900 [mask-image:radial-gradient(ellipse_at_20%_50%,transparent_0%,rgba(0,0,0,0.5)_30%,black_70%)]"></div>
        </div>

        {/* Additional gradient overlay for smoother transition */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/10 to-gray-900"></div>

        <div className="w-full justify-start translate-y-[10%] translate-x-[10%]  montserrat-reg text-3xl relative">
          <TextGenerateEffect
            words={"Built, by design,\nFor the way\nYou listen."}
            highlightText="Built, For You"
            onComplete={handleTextGenComplete}
          />
          <div
            className={`
            text-sm mt-6 
            sm:w-[35vw]
            bg-gradient-to-br from-gray-400 to-gray-200 
            bg-clip-text text-transparent 
            transition-opacity duration-1000 
            ${isDescVisible && isTextGenComplete ? "opacity-100" : "opacity-0"}
            `}
          >
            An{" "}
            <div className="relative inline-block">
              <a
                onMouseEnter={() => setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
                href="https://github.com/Stanley-Wang910/spotify-rec-engine"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-effect-link"
                data-replace="open-source"
              >
                <span>open-source</span>
              </a>

              <div
                className={`
                absolute top-3/4 transform -translate-y-8
                ml-2 px-2 py-0.5 bg-gray-700 text-slate-300 text-xs font-slim rounded-lg shadow-md
                whitespace-nowrap z-10 transition-all duration-300 ease-in-out flex items-center
                ${
                  isTooltipVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 pointer-events-none translate-x-12"
                }
              `}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <path
                    d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                GitHub
              </div>
            </div>
            , solo-dev Spotify recommender, <br />
            meant to inspire your streamlined discovery of good music. <br />
            <div className="absolute mt-6 translate-x-[0vw]">
              <HoverBorderGradient
                containerClassName="rounded-xl"
                as="button"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  (window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/login`)
                }
                className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800/70 via-gray-900/70 to-slate-900/80 text-sm text-gray-300 flex items-center space-x-2"
              >
                <span className="montserrat-reg">
                  <div className="font-semibold">Sign Up!</div>
                </span>
              </HoverBorderGradient>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div
            className={`group absolute sm:right-[10%] lg:right-[15%] top-0 lg:w-[30vw] sm:w-[40vw] sm:translate-x-[20%] transition-all duration-1000 ease-in-out 
                        ${isTextGenComplete ? "opacity-100" : "opacity-0"}`}
          >
            {!isRandomLoading && (
              <VerticalScrollingTracks
                trackIds={trackIds}
                direction="up"
                speed="very-slow"
                pauseOnHover={true}
              />
            )}
            <div
              className={`bg-gradient-to-br w-full from-gray-300 to-slate-400 bg-clip-text text-transparent text-sm montserrat-reg absolute bottom-0 lg:translate-x-[105%] sm:translate-x-[67%] right-1/2 translate-y-[7vh] opacity-100  
            `}
            >
              <div className="font-semibold">Some of Today's Discoveries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Animations Refs */}
      <div ref={scrollDiv1Ref} className="h-1 w-full mt-[35vh] absolute" />
      <div ref={scrollDiv2Ref} className="h-1 w-full mt-[50vh] absolute" />
      <div ref={scrollDemoRef} className="h-1 w-full mt-[80vh] absolute" />

      <div className="relative mt-[10vh]">
        <motion.div
          className="mb-6 translate-x-[10vw] montserrat-reg w-full text-lg flex-col flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: isDiv1Visible ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <span className="bg-gradient-to-r from-gray-300 to-gray-200 bg-clip-text text-transparent font-bold">
            A Look{" "}
            <span className="bg-gradient-to-r from-custom-brown to-amber-400 bg-clip-text text-transparent font-bold">
              Inside
            </span>
          </span>
        </motion.div>
        <AnimatedDivider
          direction="left"
          isVisible={isDiv1Visible}
          className=""
          width="90vw"
          xOffset="8vw"
          yOffset={-20}
        />
        <div className="flex flex-col ">
          <div className="sm:-translate-x-8 lg:translate-x-0">
            <motion.div // Background Glossy Container
              className={`absolute z-30 inline-flex ${isTotalRecsVisible ? "cursor-pointer" : ""}`}
              initial={{ scale: 1.0, opacity: 0 }}
              animate={{
                ...getBackgroundPosition(),
                opacity: isTotalRecsVisible ? 1 : 0,
              }}
              transition={
                isAnimating
                  ? { duration: 0.5, ease: [0.68, -0.55, 0.27, 1.55] }
                  : { duration: 0.5, ease: [0.22, 0.68, 0.31, 1.0] }
              }
              onClick={handleContainerClick}
              onHoverStart={() => {
                if (!isSwapped) {
                  setIsTotalRecsHovered(true);
                }
                setIsMoreInfoHovered(true);
              }}
              onHoverEnd={() => {
                if (!isSwapped) {
                  setIsTotalRecsHovered(false);
                }
                setIsMoreInfoHovered(false);
              }}
            >
              <GlossyContainer gradientColor="from-slate-700/50  to-slate-900">
                <div className="text-sm montserrat-reg text-slate-300  py-3 px-3 ">
                  <motion.div
                    animate={{
                      opacity: isMoreInfoVisible && isSwapped ? 1 : 0,

                      color:
                        isMoreInfoHovered && isSwapped
                          ? "rgb(148 163 184)"
                          : "rgb(203 213 225)",
                    }} // Using Tailwind colors: amber-400 and slate-400
                    transition={{ duration: 0.3 }}
                  >
                    This Week's Trending Genres
                  </motion.div>
                </div>
                <motion.div
                  className={`text-[1.5em] px-4 py-1 lato-regular inline-flex 
                  }`}
                  animate={{
                    scale: isMoreInfoHovered && isSwapped ? 1.02 : 1,
                    opacity: isMoreInfoVisible && isSwapped ? 1 : 0,
                    x: isMoreInfoHovered && isSwapped ? 3 : 0,
                    y: isMoreInfoHovered && isSwapped ? -3 : 0,
                    color:
                      isMoreInfoHovered && isSwapped
                        ? "rgb(203,213,225)" //slate-300
                        : "rgb(148 163 184)", //slate-400
                  }}
                  transition={{
                    color: { duration: 0.3, ease: "easeInOut" }, // Change if needed
                    scale: { duration: 0.75, ease: [0.22, 0.68, 0.31, 1.0] },
                    x: { duration: 0.75, ease: [0.22, 0.68, 0.31, 1.0] },
                    y: { duration: 0.75, ease: [0.22, 0.68, 0.31, 1.0] },
                    opacity: { duration: 0.3, ease: "easeInOut" },
                  }}
                  style={{
                    willChange: "transform",
                  }}
                >
                  <span className="tracking-tight  ">
                    {trendingGenres.join(", ")}
                  </span>
                </motion.div>
              </GlossyContainer>
            </motion.div>
            <motion.div
              className={`relative z-30 inline-flex ${isTotalRecsVisible ? "cursor-pointer" : ""}`}
              initial={{ scale: 1, opacity: 0 }}
              animate={{
                ...getForegroundPosition(),

                opacity: isTotalRecsVisible ? 1 : 0,
              }}
              transition={
                isAnimating
                  ? { duration: 0.5, ease: [0.68, -0.55, 0.27, 1.55] }
                  : { duration: 0.5, ease: [0.22, 0.68, 0.31, 1.0] }
              }
              onClick={handleContainerClick}
              onHoverStart={() => {
                if (isSwapped) {
                  setIsMoreInfoHovered(true);
                }
                setIsTotalRecsHovered(true);
              }}
              onHoverEnd={() => {
                if (isSwapped) {
                  setIsMoreInfoHovered(false);
                }
                setIsTotalRecsHovered(false);
              }}
            >
              <GlossyContainer gradientColor="from-slate-700/50 to-slate-900">
                <div className="w-full flex flex-col justify-center items-start  overflow-hidden">
                  <motion.div
                    className="text-sm montserrat-reg text-slate-300 pl-3 pt-3 "
                    animate={{
                      opacity: isTotalRecsVisible && !isSwapped ? 1 : 0,
                      color:
                        isTotalRecsHovered && !isSwapped
                          ? "rgb(148 163 184)"
                          : "rgb(203 213 225)",
                    }} // Using Tailwind colors: amber-400 and slate-400
                    transition={{ duration: 0.3 }}
                    // onMouseEnter={() => {
                    //   console.log("hovered on new songs");
                    // }}
                    // onMouseLeave={() => {
                    //   console.log("hovered off new songs");
                    // }}
                  >
                    New Songs Discovered
                  </motion.div>
                </div>
                <motion.div
                  className={`text-5xl pl-4 lato-regular inline-flex items-center mt-[0.5em] 
                  }`}
                  animate={{
                    scale: isTotalRecsHovered && !isSwapped ? 1.08 : 1,
                    opacity: isTotalRecsVisible && !isSwapped ? 1 : 0,
                    x: isTotalRecsHovered && !isSwapped ? -10 : 0,
                    y: isTotalRecsHovered && !isSwapped ? "-2vh" : "-1.5vh",
                    color:
                      isTotalRecsHovered && !isSwapped
                        ? "rgb(203,213,225)" //slate-300
                        : "rgb(148 163 184)", //slate-400
                  }}
                  transition={{
                    color: { duration: 0.3, ease: "easeInOut" }, // Change if needed

                    scale: { duration: 0.75, ease: [0.22, 0.68, 0.31, 1.0] },
                    x: { duration: 0.75, ease: [0.22, 0.68, 0.31, 1.0] },
                    y: { duration: 0.75, ease: [0.22, 0.68, 0.31, 1.0] },
                    opacity: { duration: 0.3, ease: "easeInOut" },
                  }}
                  style={{
                    willChange: "transform",
                  }}
                  onMouseEnter={() => {
                    console.log("hovered on Total Recs Counter");
                  }}
                  onMouseLeave={() => {
                    console.log("hovered off Total Recs Counter");
                  }}
                >
                  <span className="tracking-tight ">
                    <AnimatedCounter
                      value={Number(totalRecs) || 0}
                      isCountVisible={isTotalRecsVisible}
                    />
                  </span>
                </motion.div>

                <div
                  className={`text-sm right-4 lato-regular absolute  bottom-0`}
                >
                  <motion.div
                    animate={{
                      opacity: isTotalRecsVisible && !isSwapped ? 1 : 0,
                      color:
                        isTotalRecsHovered && !isSwapped
                          ? "rgb(251, 191, 36, 0.8)"
                          : "#64748b",
                    }} // Using Tailwind colors: amber-400 and slate-400
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    onMouseEnter={() => {
                      console.log("hovered on Counter");
                    }}
                    onMouseLeave={() => {
                      console.log("hovered off Counter");
                    }}
                  >
                    ↑{" "}
                    <AnimatedCounter
                      value={Number(hourlyIncrease) || 0}
                      isCountVisible={isTotalRecsVisible}
                    />{" "}
                    in the past hour
                  </motion.div>
                </div>
              </GlossyContainer>
            </motion.div>

            <div className="mt-[8vh] sm:translate-x-[5vw] lg:translate-x-0">
              <motion.div
                className="mb-6  montserrat-reg w-full text-lg flex-col flex translate-x-[10vw] translate-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: isDiv2Visible ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <span className="bg-gradient-to-r from-gray-300 to-gray-200 bg-clip-text text-transparent font-bold">
                  Watch the{" "}
                  <span className="bg-gradient-to-r from-custom-brown to-amber-400 bg-clip-text text-transparent font-bold">
                    Showcase
                  </span>
                </span>
              </motion.div>
              <AnimatedDivider
                direction="left"
                isVisible={isDiv2Visible}
                className="absolute"
                width="39vw"
                xOffset="8vw"
                yOffset={0}
              />

              <VideoEmbed
                isVisible={isVideoEmbedVisible}
                id="tzjeOJVYI7o"
                title="Demo"
                className="rounded-lg mt-4 w-full lg:max-w-[35vw] sm:max-w-[45vw] mx-auto inline-flex my-auto "
              />
            </div>
          </div>
          <DemoContainer
            isDemoVisible={isDemoVisible}
            isDemoContainerHovered={isDemoContainerHovered}
            setIsDemoContainerHovered={setIsDemoContainerHovered}
            searchAnimate={searchAnimate}
            recAnimate={recAnimate}
          />
          <div
            className={`${isGradientVisible ? "fade-in-gradient " : "opacity-0"}  sm:invisible md:invisible lg:visible gradient-background absolute translate-x-[48vw] translate-y-[10vh] w-full h-full flex z-10 `}
          >
            <svg
              className="blur-[60px] sm:opacity-0 md:opacity-100"
              width="700"
              height="700"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="animate-colorChange3"
                cx="150"
                cy="150"
                r="125"
                fill="#B071FF"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
