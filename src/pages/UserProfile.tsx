import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { UserProfileInterface, fetchAvatar, getMostPlayedGames, getUserFromUsername } from "../bin/UserProfileLogic";
import { getUser } from "../bin/UserLogin";

function UserProfile() {
  const currentUser = localStorage.getItem("username");

  if (!currentUser) {
    return <div>No user logged in</div>;
  }

  const navigate = useNavigate();
  const username = useParams().username;
  const [aboutMe, setAboutMe] = useState("loading");
  const [steamID, setSteamID] = useState("loading");
  const [rating, setRating] = useState<number | string>("loading");
  const [steamLink, setSteamLink] = useState("https://store.steampowered.com/");
  const [mostPlayedGame, setMostPlayedGame] = useState("loading");
  const [hours, setHours] = useState<string|number>("loading");
  const [profilePicture, setProfilePicture] = useState("1bb629f74be925a370fafa73a80ab9f8266262c5");

  let buttons: string[] = [];
  let profileName: string = "";
  if (username === currentUser) {
    buttons = [
      "View All Sessions",
      "My Sessions",
      "View Joined Sessions",
      "View Requests",
      "Edit Profile",
    ];
    profileName = "My Profile";
  } else {
    buttons = [
      "View All Sessions",
      "My Sessions",
      "View Joined Sessions",
      "View Requests",
      "My Profile",
    ];
    profileName = `${username}'s Profile`;
  }

  if (username == undefined) {
    navigate(`/NotFoundUser/`);
    return <div>param in link is undefined</div>;
  } else {

    useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserFromUsername(username); 
        console.log("userprofile:", userProfile);

        if (userProfile) {
          setSteamID(userProfile.steamID);
          setAboutMe(userProfile.about_me);
          setRating(userProfile.rating);
          setSteamLink(`steam://url/SteamIDPage/${userProfile.steamID}`);
          if(userProfile.avatar_hash === ""){
            const avatarUrl = await fetchAvatar(userProfile.steamID);
            setProfilePicture(avatarUrl);
          }else{
            setProfilePicture(userProfile.avatar_hash)
          }
          const mostPlayedResponse = await getMostPlayedGames(userProfile.steamID);
          if (mostPlayedResponse){
            console.log("mostplayedGame:", mostPlayedResponse);
            console.log("mostplayedGame id:", mostPlayedResponse.appid);
            console.log("gamename:", mostPlayedResponse.name);
            setMostPlayedGame(mostPlayedResponse.name);
            setHours(mostPlayedResponse.hours);
          }
        } else {
          console.error("User Profile returned is undefined!");
          navigate(`/NotFoundUser/${username}`);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate(`/NotFoundUser/${username}`);
      }
    };
    fetchData();
  }, [username]);

    return (
      <div className="fixed inset-0 bg-hero bg-cover bg-center min-h-screen">
        <nav className="TOP_BAR flex flex-row justify-between fixed top-0 left-0 right-0 z-10 h-14 bg-transparent">
          {" "}
          {/* TOP BAR */}
          <Sidebar buttons={buttons} />
        </nav>
        <div className="POST_TOPBAR_CONTAINER pt-14 flex flex-col justify-center items-center">
          {" "}
          {/* Container below TOP BAR */}
          <span className="text-white text-5xl font-bold pb-12">
            {profileName}
          </span>
          <div className="USER_ICON_&_USERNAME flex justify-center items-center pb-8">
            {" "}
            {/* ICON + USERNAME */}
            <img
              className="object-contain rounded-full w-32 h-32 border-4 border-[#2d44f5]"
              src={`https://avatars.steamstatic.com/${profilePicture}_full.jpg`}
              alt="Profile Picture"
            />
            <div className="USERNAME ml-5 flex justify-center items-center rounded-2xl p-2 bg-[#2d44f5]">
              {" "}
              {/* USERNAME */}
              <h2 className="ml-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-center font-extrabold ">
                Username:{" "}
              </h2>
              <h2 className="mr-1 mt-5 mb-5 text-3xl pl-4 text-white text-center font-extrabold ">
                {username}
              </h2>
              <div className="flex-none pr-4">
                <a href={steamLink}>
                  <img
                    className="ml-5 border-[#2d44f5be] h-12"
                    src="../../Steam_icon_logo.png"
                    alt="Steam Icon"
                  ></img>
                </a>
              </div>
            </div>
          </div>
          <div className="PROFILE_INFO w-3/5 mt-5 flex flex-col items-center rounded-2xl p-4 text-xl bg-[#2d44f5]">
            {" "}
            {/* PROFILE-INFO */}
            <div className="ABOUT_ME flex justify-center items-center">
              {" "}
              {/* ABOUT ME */}
              <h5 className="mr-5 mt-5 mb-5  text-white text-center font-extrabold text-wrap ">
                <span className="mr-5 mt-5 mb-5  text-[#f7a72f] text-center font-extrabold ">
                  About Me:
                </span>
                {aboutMe}
              </h5>
            </div>
            <div className="MOST_PLAYED flex justify-center items-center">
              {" "}
              {/* MOST PLAYED */}
              <h5 className="mr-5 mt-5 mb-5 text-white text-center font-extrabold text-wrap ">
                <span className="mr-5 mt-5 mb-5  text-[#f7a72f] text-center font-extrabold ">
                  Most Played:
                </span>
                <span className="text-center">{mostPlayedGame} ({hours} HOURS)</span>
              </h5>
            </div>
            <div className="ABOUT_ME flex justify-center items-center">
              {" "}
              {/* Rating */}
              <h5 className="mr-5 mt-5 mb-5  text-white text-center font-extrabold text-wrap ">
                <span className="mr-5 mt-5 mb-5  text-[#f7a72f] text-center font-extrabold ">
                  Rating:
                </span>
                {rating}
              </h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;
