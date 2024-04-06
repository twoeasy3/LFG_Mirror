import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserFromUsername, updateUser, UserProfileInterface } from "../bin/UserProfileLogic";
import { getUser } from "../bin/UserLogin";

function EditProfile() {
  const user = localStorage.getItem("username");
  const steamID = localStorage.getItem("steamID");
  console.log(user);
  if (!user) {
    return <div>No user logged in</div>;
  }
  const navigate = useNavigate();
  const enteredUsername = useParams().username;
  if (enteredUsername !== user){
    navigate('/NotFoundPage');
  }
  
  const sampleDesc =
    "Loading...";

  const [description, setDescription] = useState(sampleDesc);
  const [showPopup, setShowPopup] = useState(false);
  const [profilePicture, setProfilePicture] = useState("1bb629f74be925a370fafa73a80ab9f8266262c5");
  const [userProfile, setUserProfile] = useState<UserProfileInterface|null>(null);

  useEffect(() => {
    const fetchUser = async () => {
        const userProfileResponse = await getUserFromUsername(user)
        if (userProfileResponse !== undefined) {
            setUserProfile(userProfileResponse);
            setDescription(userProfileResponse.about_me)
            setProfilePicture(userProfileResponse.avatar_hash)
        } else {
            navigate('/NotFoundPage');
        }
    };

    fetchUser();
}, []);

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleCancelClick = () => {
    navigate(`/UserProfile/${user}`);
  };

  const handleSaveClick = async () => {
    if (!description.trim()) {
      alert("The description cannot be empty.");
      return;
    }
    if(userProfile !== null){
      userProfile.about_me = description //TODO: not sure if there's an edge case where it gets so far without a userProfile -yx
      updateUser(user,userProfile);
      setShowPopup(true); // Show the success popup
      setTimeout(() => {
        setShowPopup(false); // Hide the popup after 1.5 seconds
        navigate(`/UserProfile/${user}`); // Redirect to the user profile page
      }, 1500);
    }else{
      alert("Error updating profile, profile was not fetched.");
    }
  };

/*   useEffect(()=>{
    const fetchData = async () => {
      try{
        const response = await axios.get(`http://twoeasy3.pythonanywhere.com/api/getSteamPicture/${steamID}`);
        console.log(response);
        setProfilePicture(response.data);
      }
      catch(error){
        console.log("Edit Profile, fetching pic error", error);
      }
    }
    fetchData();
  }, []) */


  return (
    <div className="bg-hero bg-center bg-cover min-h-screen">
      <div className="flex flex-col items-center justify-center ">
        <div className="mt-[-1rem]">
          <h1 className="text-white text-5xl pt-16 pb-6 font-bold">
            Edit Profile
          </h1>
        </div>
        <div className="flex items-center justify-center pb-4">
          <img className="object-contain rounded-full w-32 h-32 border-4 border-[#2d44f5]" src={`https://avatars.steamstatic.com/${profilePicture}_full.jpg`} alt="Profile Picture" />
          <div className="ml-5 flex flex-row justify-center items-center rounded-2xl p-2 bg-[#2d44f5]">
            <h2 className="ml-5 mt-5 mb-5 text-4xl text-[#f7a72f] text-center font-extrabold ">
              Username:{" "}
            </h2>
            <h2 className="mr-5 mt-5 mb-5 text-4xl pl-4 text-white text-center font-extrabold ">
              {user}
            </h2>
          </div>
        </div>
        <div className="w-3/5 mx-auto mt-4 text-center bg-[#2d44f5] rounded-2xl p-4">
          <h2 className="text-[#f7a72f] font-bold text-2xl py-2">About Me: </h2>
          <textarea
            className="w-full h-36 mt-4 text-white bg-blue-600 text-xl p-4 outline-none resize-none rounded-md"
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>
        </div>
        <div className="flex flex-row justify-between w-2/5 text-sm mt-8">
          <button
            className="bg-red-500 hover:bg-red-700 p-4 rounded-lg font-bold text-xl"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 p-4 rounded-lg font-bold text-xl"
            onClick={handleSaveClick}
          >
            Save Changes
          </button>
        </div>
        {showPopup && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-55">
            <div className="bg-[#223bfcbe] p-8 rounded-lg text-xl">
              <p className="text-white">Changes saved</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditProfile;
