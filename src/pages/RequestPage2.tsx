import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAllSessions, SessionDataResponse } from "../bin/SessionLogic";
import { SessionPreview } from "../components/SessionPreview";

function RequestsPage() {
  const user = localStorage.getItem("username");
  console.log(user);
  if (!user) {
    return <div>No user logged in</div>;
  }

  const [allSessions, setAllSessions] = useState<
    SessionDataResponse | undefined
  >(undefined);

  useEffect(() => {
    getAllSessions()
      .then((allSessions) => {
        setAllSessions(allSessions);
      })
      .catch((error) => {
        console.error("Error fetching session data", error);
        setAllSessions(undefined);
      });
  }, []); // Add empty dependency array to useEffect to run it only once

  return (
    <div className="bg-hero bg-cover bg-center min-h-screen">
      <nav className="TOP_BAR flex flex-row justify-between fixed top-0 left-0 right-0 z-10 h-14 bg-transparent">
        {" "}
        {/* TOP BAR */}
        <div className="bg-transparent pl-2 pt-2">
          <Sidebar
            buttons={[
              "View All Sessions",
              "Create Session",
              "My Sessions",
              "View Joined Sessions",
              "My Profile",
            ]}
          />
        </div>
      </nav>
      <div className="justify-center items-center flex">
        <div className="CONTAINER_FOR_SESSIONS text-white text-l font-bold mb-10 mt-5 text-center w-fit justify-center items-center">
          <span className="text-white text-5xl font-bold">Requests</span>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="PROFILE_INFO w-2/4 mt-10 flex flex-row items-center rounded-2xl p-4 text-xl bg-[#2d44f5be] mx-auto">
          {/* Profile Picture */}
          <div className="flex-shrink-0 mr-4">
            <img
              className="object-contain rounded-full w-20 h-20 border-4 border-[#2d44f5be]"
              src="../profile.jpg"
            ></img>
          </div>
          {/* PROFILE-INFO */}
          <div className="Request_Info flex justify-end items-center w-full">
            {" "}
            {/* Request_Info */}
            <h5 className="mr-5 mt-5 mb-5  text-white text-center font-extrabold text-wrap ">
              <span className="mr-5 mt-5 mb-5  text-white text-center font-extrabold ">
                Johnny6969 wishes to join your Dota 2 squad!
              </span>
            </h5>
          </div>
          {/* Buttons */}
          <div className="flex space-x-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Accept
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Reject
            </button>
          </div>
        </div>
        {/* Additional Boxes */}
        <div className="PROFILE_INFO w-2/4 mt-10 flex flex-row items-center rounded-2xl p-4 text-xl bg-[#2d44f5be] mx-auto">
          {/* Profile Picture */}
          <div className="flex-shrink-0 mr-4">
            <img
              className="object-contain rounded-full w-20 h-20 border-4 border-[#2d44f5be]"
              src="../profile_2.png"
            ></img>
          </div>
          {/* PROFILE-INFO */}
          <div className="Request_Info flex justify-end items-center w-full">
            {/* Request_Info */}
            <h5 className="mr-5 mt-5 mb-5  text-white text-center font-extrabold text-wrap ">
              <span className="mr-5 mt-5 mb-5  text-white text-center font-extrabold ">
                Yourmama wishes to join your CSGO squad!
              </span>
            </h5>
          </div>
          {/* Buttons */}
          <div className="flex space-x-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Accept
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Reject
            </button>
          </div>
        </div>
        <div className="PROFILE_INFO w-2/4 mt-10 flex flex-row items-center rounded-2xl p-4 text-xl bg-[#2d44f5be] mx-auto">
          {/* Profile Picture */}
          <div className="flex-shrink-0 mr-4">
            <img
              className="object-contain rounded-full w-20 h-20 border-4 border-[#2d44f5be]"
              src="../profile_3.png"
            ></img>
          </div>
          {/* PROFILE-INFO */}
          <div className="Request_Info flex justify-end items-center w-full">
            {/* Request_Info */}
            <h5 className="mr-5 mt-5 mb-5  text-white text-center font-extrabold text-wrap ">
              <span className="mr-5 mt-5 mb-5  text-white text-center font-extrabold ">
                MacD wishes to join your PUBG squad!
              </span>
            </h5>
          </div>
          {/* Buttons */}
          <div className="flex space-x-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Accept
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestsPage;
