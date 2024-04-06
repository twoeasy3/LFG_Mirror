import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { Session, getSessionFromID, updateSession } from "../bin/SessionLogic";
import { deleteSession } from "../bin/SessionLogic";

export function EditSession() {
  const steamID = localStorage.getItem("steamID");
  const user = localStorage.getItem("username");
  const userID = localStorage.getItem("userID");
  const navigate = useNavigate();

  const confirmDeleteStrings = [
    "What a save!",
    "Rush B",
    "The cake is a lie"
  ]
  

  if (!user || steamID == null || !userID) {
    navigate('/');
  };

  const [showPopup, setShowPopup] = useState(false);
  const [sessName, setSessName] = useState("");
  const [datetime, setDateTime] = useState("");
  const [preReq, setPreReq] = useState("");
  const [langauge, setLanguage] = useState({
    value: "English",
    label: "English",
  });
  const [numPlayers, setNumPlayers] = useState("");
  const [gameMode, setGameMode] = useState("");
  const [gameName, setGameName] = useState("")
  const [appID, setAppID] = useState<number>(0);
  const [particpants, setParticipants] = useState<Number[]>([]);
  const [editTime, setEditTime] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteChallengeReply, setDeleteChallengeReply] = useState("");
  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Mandarin", label: "Mandarin 中文" },
    { value: "Malay", label: "Malay Melayu" },
    { value: "Tamil", label: "Tamil தமிழ்" },
    { value: "Hindi", label: "Hindi हिन्दी" },
    { value: "Russian", label: "Russian Русский" },
    { value: "Japanese", label: "Japanese 日本語" },
  ];
  const sessionID = useParams().sessionID;
  
  if (sessionID && isNaN(Number(sessionID)) || sessionID == undefined) {
        navigate('/NotFoundPage');
    }
    else{
      useEffect(() => {
        const fetchData = async () => {
          const session = await getSessionFromID(parseInt(sessionID))
          if (session !== undefined){
            const hostUserInString = session.host_user.toString();
            console.log(typeof(hostUserInString), hostUserInString);
            console.log(typeof(userID), userID);
            if (hostUserInString !== userID){
              console.log("different host");
              navigate('/NotFoundPage')
            }
            
            
            setSessName(session.session_name);
            setAppID(session.appid);
            setPreReq(session.prereq);
            setGameMode(session.game_mode);
            setNumPlayers(String(session.max_no_player));
            console.log(session.time.slice(0,-4));
            setDateTime(session.time.slice(0,-1));
            const selectedLanguage = languageOptions.find(option => option.value === session.language);
            setLanguage({
              value: selectedLanguage!.value,
              label: selectedLanguage!.label
            });
            setGameName(session.game_name);
            if (session.participants.length !==0){
              setParticipants(session.participants);
              setEditTime(false);
            }
            else{
              setEditTime(true);
            }
          }
          else{
            navigate('/NotFoundPage')
          }
        }
        fetchData();
      }, [])
    }
    

  const confirmDeleteChallenge = confirmDeleteStrings[parseInt(sessionID!)%confirmDeleteStrings.length]
  const handleSessNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSessName(event.target.value);
  };

  const handleDateTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputDatetime = new Date(event.target.value);
    const currentDatetime = new Date();

    if (inputDatetime < currentDatetime) {
      alert("Please select a future date and time.");
      setDateTime("");
    } else {
      setDateTime(event.target.value);
    }
  };

  const handleGameModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameMode(event.target.value);
  };

  const handleLanguageChange = (selectedOption: any) => {
    console.log(selectedOption);
    setLanguage(selectedOption);
  };

  const handlePreReqChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreReq(event.target.value);
  };

  const handleNumPlayerChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    if (!isNaN(Number(newValue)) && Number(newValue) >= 0) {
      setNumPlayers(newValue);
    }
  };

  const handleDeleteChallengeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDeleteChallengeReply(event.target.value);
  };

  const handleDeleteClick = () => {
    setShowDeletePopup(!showDeletePopup)
  }

  const handleReallyDeleteClick = () => {
    if(deleteChallengeReply == confirmDeleteChallenge){
      alert("Your session is deleted.")
      navigate("/ViewSessions")
      deleteSession(sessionID!)
    }
    else{
      alert("Input is not the same. Your session was not deleted.")
      setShowDeletePopup(false)
    }
  }

  const handleCancelClick = () => {
    navigate("/ViewSessions");
  };

  const handleConfirmClick = () => {
    // Check if the session name is not empty
    if (!sessName.trim()) {
      alert("Session name cannot be empty.");
      return;
    }

    // Check if the date and time is set
    if (!datetime) {
      alert("Please select the date and time for the session.");
      return;
    }

    // Check if the number of players is set and greater than 1
    if (!numPlayers || Number(numPlayers) < 2) {
      alert("Please enter a valid number of players (at least 2).");
      return;
    }

    // Check if the game mode is not empty
    if (!gameMode.trim()) {
      alert("Game mode cannot be empty.");
      return;
    }

    // Check if language is set
    if (!langauge || !langauge.value) {
      alert("Please select a language.");
      return;
    }
    

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const currentTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    const newSession: Session = {
      session_name: sessName,
      appid: appID,
      create_at: currentTime, //When user update session, the create_at timing will be time when user make update
      time: datetime,
      max_no_player: parseInt(numPlayers),
      game_mode: gameMode,
      language: langauge.value,
      host_user: Number(userID),
      prereq: preReq,
      is_public: true,
      participants: particpants,
      status: "1",
      game_name : gameName,
      id: 0,   
    }
    updateSession(sessionID!, newSession)
    .then(() => {
      console.log('Update successful');
      setShowPopup(true); // Show the success popup
      setTimeout(() => {
        setShowPopup(false); // Hide the popup after 1.5 seconds
        navigate(`/ViewSessions`);
      }, 1500);
    })
    .catch((error) => {
      console.error('Error updating session:', error);
    });

  };
  return (
    <div className="bg-hero bg-center bg-cover min-h-screen">
      <div className="CREATE_SESSION_BOX_CENTER pt-14 flex flex-col justify-center items-center">
        <div className="pb-8">
          <span className="text-white text-4xl font-bold">Edit Session</span>
        </div>

        <div className="CREATE_SESSION_BOX w-4/5 flex-col rounded-2xl p-2 bg-[#2d44f5] items-center">
          <div className="SELECT_GAME_ROW_CONTAINER w-full flex justify-center items-center pt-2">
            <h2 className="mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-center font-extrabold ">
              Game:{" "}
            </h2>
            <h2 className="flex flex-row mr-5 mt-5 mb-5 text-3xl text-white text-center font-extrabold ">{gameName}</h2>
            <img className="ml-5 border-[#2d44f5be]"
                src={`https://cdn.akamai.steamstatic.com/steam/apps/${appID}/capsule_231x87.jpg`}
            ></img>
          </div>
          
          <div className="SESSION_NAME w-full flex flex-row justify-center items-center">
            <h2 className="mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-center font-extrabold ">
              Session Name:{" "}
            </h2>
            <div className="SESSION_NAME_INPUT w-1/2">
              <input
                className="w-4/5 px-4 py-2 border-b border-white focus: outline-none rounded"
                value={sessName}
                onChange={handleSessNameChange}
                placeholder="Session Name..."
              />
            </div>
          </div>        

          {editTime && 
          <div className="TIME_ROW_CONTAINER w-full flex flex-row justify-center items-center">
            <h2 className="mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-center font-extrabold ">
              Select Time:{" "}
            </h2>
            <div className="TIME_INPUT_SIZER w-1/2">
              <input
                className="py-2 px-4 rounded outline-none"
                type="datetime-local"
                value={datetime}
                onChange={handleDateTimeChange}
              />
            </div>
          </div>}
          
          <div className="GAMEMODE_ROW_CONTAINER w-full flex flex-row justify-center items-center">
            <h2 className="mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-center font-extrabold ">
              Gamemode:{" "}
            </h2>
            <div className="GAMEMODE_INPUT_SIZER w-1/2">
              <input
                className="w-4/5 px-4 py-2 border-b border-white focus: outline-none rounded"
                value={gameMode}
                onChange={handleGameModeChange}
                placeholder="Gamemode..."
              />
            </div>
          </div>
          <div className="LANGUAGE_ROW_CONTAINER w-full flex flex-row justify-center items-center">
            <h2 className="mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-center font-extrabold ">
              Language:{" "}
            </h2>
            <div className="LANGUAGE_INPUT_SIZER w-1/2">
              <Select
                value={langauge}
                onChange={handleLanguageChange}
                options={languageOptions}
              />
            </div>
          </div>
          <div className="MAX-PLAYERS w-full flex flex-row justify-center items-center">
            <h2 className="mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-center font-extrabold ">
              Session Size:{" "}
            </h2>
            <div className="PLAYER_INPUT_SIZER w-1/2">
              <input
                className="w-4/5 px-4 py-2 border-b border-white focus: outline-none rounded"
                value={numPlayers}
                onChange={handleNumPlayerChange}
                placeholder="No. of players..."
              />
            </div>
          </div>
          <div className="PRE-REQ w-full flex flex-row justify-center items-center">
            <h2 className="mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-center font-extrabold ">
              Pre-Requisite:{" "}
            </h2>
            <div className="GAMEMODE_INPUT_SIZER w-1/2">
              <input
                className="w-4/5 px-4 py-2 border-b border-white focus: outline-none rounded"
                value={preReq}
                onChange={handlePreReqChange}
                placeholder="Pre-Requisite..."
              />
            </div>
          </div>
          <div className="DELETE BUTTON w-full flex flex-row justify-center items-center pb-2">
            <button
                className="bg-[#FF0000] hover:bg-[#ff0000cc] p-4 rounded-lg font-bold text-xl "
                onClick={handleDeleteClick}>
                Delete Session
            </button>
          </div>
        </div>
        <div className="flex justify-between w-3/5 pt-4">
          <button
              className="bg-red-700 hover:bg-red-900 p-4 rounded-lg font-bold text-xl"
              onClick={handleCancelClick}>
              Cancel
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 p-4 rounded-lg font-bold text-xl"
            onClick={handleConfirmClick}>
            Confirm
          </button>
          
        </div>
      </div>
      {showPopup && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-70">
            <div className="bg-[#223bfcbe] p-8 rounded-lg text-xl">
              <p className="text-white">Changes saved</p>
            </div>
          </div>
        )}
        {showDeletePopup && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-80">
            <div className="bg-[#223bfcbe] p-8 rounded-lg text-xl items-center justify-center">
              <p className="text-white text-center">Enter the following text to confirm deletion: </p>
              <p className="text-[#f7a72f] text-3xl text-extrabold text-center pb-2">{confirmDeleteChallenge}</p>
              <input
                className="w-full px-4 py-2 border-b border-white focus: outline-none rounded text-center"
                value={deleteChallengeReply}
                onChange={handleDeleteChallengeChange}
                placeholder="Case Sensitive..."
              />

              <div className="flex flex-row justify-between w-full pt-4">
                <button
                    className="bg-red-500 hover:bg-red-700 p-4 rounded-lg font-bold text-xl"
                    onClick={handleDeleteClick}>
                    Cancel
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 p-4 rounded-lg font-bold text-xl"
                  onClick={handleReallyDeleteClick}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default EditSession;
