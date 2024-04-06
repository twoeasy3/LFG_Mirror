import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import PromiseOwnedGameSelect from "../components/Dropdown";
import Select from "react-select";
import { postNewSession, Session } from "../bin/SessionLogic";
import { GameData } from "../bin/GetOwnedGames";
import Topbar from "../components/Topbar";

export function CreateSession() {
  const steamID = localStorage.getItem("steamID");
  const user = localStorage.getItem("username");
  //console.log(user)
  if (!user || steamID == null) {
    return <div>No user logged in or SteamID field is empty!</div>;
  }

  const navigate = useNavigate();
  const ownedGamesString: string | null = localStorage.getItem("ownedGames");
  const ownedGames: GameData[] | null = ownedGamesString ? JSON.parse(ownedGamesString) : null
  const [sessName, setSessName] = useState(`${user}'s Session`);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [datetime, setDateTime] = useState("");
  const [preReq, setPreReq] = useState("");
  const [langauge, setLanguage] = useState({
    value: "English",
    label: "English",
  });
  const [numPlayers, setNumPlayers] = useState("");
  const [gameMode, setGameMode] = useState("");
  const [gameName, setGameName] = useState("");

  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Mandarin", label: "Mandarin 中文" },
    { value: "Malay", label: "Malay Melayu" },
    { value: "Tamil", label: "Tamil தமிழ்" },
    { value: "Hindi", label: "Hindi हिन्दी" },
    { value: "Russian", label: "Russian Русский" },
    { value: "Japanese", label: "Japanese 日本語" },
  ];

  const handleGameSelect = (selectedOption: number) => {
    setSelectedGame(selectedOption);
    const selectedGameObj = ownedGames?.find(
      (game) => game.appID === selectedOption
    );
    console.log("Selected Game Name:", selectedGameObj);
    if (selectedGameObj){
      setGameName(selectedGameObj.name);
    }
  };

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
      console.log(event.target.value)
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

  const handleCancelClick = () => {
    navigate("/ViewSessions");
  };

  const handleConfirmClick = () => {
    // Check if the session name is not empty
    if (!sessName.trim()) {
      alert("Session name cannot be empty.");
      return;
    }

    // Check if a game is selected
    if (selectedGame === null || !gameName) {
      alert("Please select a game.");
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
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const currentTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    const newSession: Session = {
      session_name: sessName,
      appid: selectedGame,
      create_at: currentTime,
      time: datetime,
      max_no_player: parseInt(numPlayers),
      game_mode: gameMode,
      language: langauge.value,
      host_user: user,
      prereq: preReq,
      is_public: true,
      participants: [],
      status: "1", //INDICATES NON-EXPIRED
      game_name: gameName,
      id: 0,   
    }

    postNewSession(newSession)
    .then(responseData => {
      console.log('Response Data:', responseData);
      if(responseData!== undefined){navigate("/ViewHostedSessions");}
      else{}
      
      
  })
    .catch(error => {
      alert("Error creating a session. Please try again."); //TODO: maybe a better message for this
      console.error('Error:', error);
  });
  };

  return (
    <div className="bg-hero bg-center bg-cover min-h-screen">
      <Topbar/>
      <div className="CREATE_SESSION_BOX_CENTER pt-14 flex flex-col justify-center items-center">
        <div className="pb-8">
          <span className="text-white text-4xl font-bold">Create Session</span>
        </div>
        <div className="CREATE_SESSION_BOX w-4/5 justify-we flex-col rounded-2xl p-2 bg-[#2d44f5] items-center">
          <div className="SESSION_NAME w-full flex flex-row justify-center items-center">
            <h2 className="w-1/5 mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-right font-extrabold ">
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
          <div className="SELECT_GAME_ROW_CONTAINER w-full flex flex-row justify-center items-center">
            <h2 className="w-1/5 mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-right font-extrabold ">
              Select Game:{" "}
            </h2>
            <div className="w-5/12 flex flex-row justify-center items-center">
              <div className="GAME_DROPDOWN_SIZER w-4/5">
                <PromiseOwnedGameSelect
                  onSelectChange={handleGameSelect}
                  steamID={steamID}
                />
              </div>
              {selectedGame == null ? (
                <img
                  className="ml-5 border-[#2d44f5be]"
                  src="../../banner_loading.jpg"
                ></img>
              ) : (
                <img
                  className="ml-5 border-[#2d44f5be]"
                  src={`https://cdn.akamai.steamstatic.com/steam/apps/${selectedGame}/capsule_231x87.jpg`}
                ></img>
              )}
            </div>
          </div>
          <div className="TIME_ROW_CONTAINER w-full flex flex-row justify-center items-center">
            <h2 className="w-1/5 mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-right font-extrabold ">
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
          </div>
          <div className="GAMEMODE_ROW_CONTAINER w-full flex flex-row justify-center items-center">
            <h2 className="w-1/5 mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-right font-extrabold ">
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
            <h2 className="w-1/5 mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-right  font-extrabold ">
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
            <h2 className="w-1/5 mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-right font-extrabold ">
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
            <h2 className="w-1/5 mr-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-right font-extrabold ">
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
        </div>
        <div className="flex justify-between w-2/5 pt-4">
          <button
            className="bg-red-500 hover:bg-red-700 p-4 rounded-lg font-bold text-xl"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 p-4 rounded-lg font-bold text-xl"
            onClick={handleConfirmClick}
          >
            Confirm
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default CreateSession;
