import React, { useState, useEffect } from "react";
import { Session, buildDateStringFromStamp } from "../bin/SessionLogic";
import { useAppName } from "./AppNameProvider";
import { checkIfOwnGame, GameData } from "../bin/GetOwnedGames";
import { useNavigate } from "react-router-dom";
import { UserProfileInterface } from "../bin/UserProfileLogic";
import { getUserFromID } from "../bin/UserProfileLogic";
import { isTimeInPast } from "../bin/SessionLogic";
interface SessionPreviewProps {
  PreviewSession: Session | null;
}

export const SessionPreview: React.FC<SessionPreviewProps> = ({
  PreviewSession,
}) => {
  if (PreviewSession == null) {
    //empty div for spacing on an odd numbered session list
    return (
      <div className="SESSION_PREVIEW_CONTAINER justify-center w-full mb-5 mt-5 mr-2 ml-2 flex flex-row items-top  p-1"></div>
    );
  } else {
    const appNameDictionary = useAppName();
    const ownedGamesString: string | null = localStorage.getItem("ownedGames");
    const ownedGames: GameData[] | null = ownedGamesString
      ? JSON.parse(ownedGamesString)
      : null;
    const [notOwnedButtonText, setNotOwnedButtonText] = useState("Game Not Owned");
    const [hostButtonText, setHostButtonText] = useState("Your Session");
    const [sessionOverText, setSessionOverText] = useState("Session Ended");
    const [joinedSessionText, setjoinedSessionText] = useState("Session Joined");
    const [hostUser, setHostUser] = useState<UserProfileInterface>({
      id: -1,
      username: "Fetching user...",
      about_me: "What is that... it's The Unknown!",
      mostPlayedGame: "Half-Life 3",
      steamID: "0",
      friends: [],
      rating: 0,
      email: "unknown@unknown.com",
      avatar_hash: "fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb"
    });

    const navigate = useNavigate();
    const handleSessionClick = () => {
      console.log("Navigating away - debug");
      navigate(`/SingleSession/${PreviewSession.id}`); //TODO: CHANGE THIS TO THE SESSIONID -yx
    };

    useEffect(() => {
      const fetchHost = async () => {
        const host = await getUserFromID(parseInt(PreviewSession.host_user as string));
        if (host !== undefined) {
          setHostUser(host);
        } else {
          setHostUser({
            id: -1,
            username: "Deleted User",
            about_me: "What is that... it's The Unknown!",
            mostPlayedGame: "Half-Life 3",
            steamID: "0",
            friends: [],
            rating: 0,
            email: "unknown@unknown.com",
            avatar_hash: "fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb"
          });
          //TODO: code if the ID cannot be found
        }
      };

      fetchHost();
    }, []);

    const handleGameNotOwnedClick = () => {
      const url = `steam://store/${PreviewSession.appid}`;
      const newWindow = window.open(url, "_blank");
      if (newWindow) {
        newWindow.focus();
      } else {
        console.error("Failed to open new tab");
      }
    };
    const handleMouseHover = () => {
      setNotOwnedButtonText("Store Page");
      setHostButtonText("Edit Session");
      setSessionOverText("Rate Users");
      setjoinedSessionText("View Session");
    };
    const handleMouseLeave = () => {
      setNotOwnedButtonText("Game Not Owned");
      setHostButtonText("Your Session");
      setSessionOverText("Session Ended");
      setjoinedSessionText("Session Joined");
    };

    const handleEditSessionClick = () => {
      navigate(`/EditSession/${PreviewSession.id}`);
    };

    return (
      <div className="SESSION_PREVIEW_CONTAINER justify-center w-full mb-5 mt-5 mr-2 ml-2 flex flex-row items-top rounded-2xl p-1 bg-[#2d44f5be] pr-2">
        <div className="SESSION_PREVIEW_INFO_CONTAINER flex flex-col justify-center w-1/2 py-2">
          <h2 className="ml-5 text-sm text-[#f7a72f] text-center font-extrabold ">
            {PreviewSession.session_name}{" "}
          </h2>
          <h2 className="ml-5 text-sm text-[#ffffff] text-center font-extrabold ">
            {PreviewSession.game_name}{" "}
          </h2>
          <h2 className="ml-5 text-sm text-[#f7a72f] text-center font-extrabold ">
            Time: {buildDateStringFromStamp(PreviewSession.time)}{" "}
          </h2>
          <h2 className="ml-5 text-sm text-[#f7a72f] text-center font-extrabold ">
            {PreviewSession.participants.length}/{PreviewSession.max_no_player}{" "}
            players signed up
          </h2>
          <h2 className="ml-5 text-sm text-[#f7a72f] text-center font-extrabold ">
            Gamemode: {PreviewSession.game_mode}{" "}
          </h2>
          <h2 className="ml-5 text-sm text-[#f7a72f] text-center font-extrabold ">
            Host: {hostUser?.username}{" "}
          </h2>
          <h2 className="ml-5 text-sm text-[#f7a72f] text-center font-extrabold ">
            Language: {PreviewSession.language}{" "}
          </h2>
          <h2 className="ml-5 text-sm text-[#f7a72f] text-center font-extrabold ">
            Prequisite: {PreviewSession.prereq}{" "}
          </h2>
        </div>
        <div className="SESSION_PREVIEW_BANNER flex flex-col mt-2">
          <img
            className="ml-5 border-[#2d44f5be] rounded-2xl"
            src={`https://cdn.akamai.steamstatic.com/steam/apps/${PreviewSession.appid}/capsule_231x87.jpg`}
          ></img>
          {isTimeInPast(PreviewSession.time) ? (<button
              className="ml-5 bg-red-500 hover:bg-red-700 p-4 rounded-lg font-bold text-xl mt-2"
              onClick={handleSessionClick}
              onMouseEnter={handleMouseHover}
              onMouseLeave={handleMouseLeave}
            >
              {sessionOverText}
            </button>
          ) : PreviewSession.host_user == localStorage.getItem("userID") ? (
            <button
              className="ml-5 bg-cyan-500 hover:bg-cyan-700 p-4 rounded-lg font-bold text-xl mt-2"
              onClick={handleEditSessionClick}
              onMouseEnter={handleMouseHover}
              onMouseLeave={handleMouseLeave}
            >
              {hostButtonText}
            </button>
          ) : PreviewSession.participants.includes(parseInt(localStorage.getItem("userID")!)) ? (
            <button
              className="ml-5 bg-yellow-500 hover:bg-yellow-700 p-4 rounded-lg font-bold text-xl mt-2"
              onClick={handleSessionClick}
              onMouseEnter={handleMouseHover}
              onMouseLeave={handleMouseLeave}
            >
              {joinedSessionText}
            </button>
          ) : ownedGames !== null &&
            checkIfOwnGame(ownedGames, PreviewSession.appid) ? (
            <button
              className="ml-5 bg-green-500 hover:bg-green-700 p-4 rounded-lg font-bold text-xl mt-2"
              onClick={handleSessionClick}
            >
              Join Session
            </button>
          ) : (
            <button
              className="ml-5 bg-zinc-500 hover:bg-zinc-700 p-4 rounded-lg font-bold text-xl mt-2"
              onClick={handleGameNotOwnedClick}
              onMouseEnter={handleMouseHover}
              onMouseLeave={handleMouseLeave}
            >
              {notOwnedButtonText}
            </button>
          )}
        </div>
      </div>
    );
  }
};
