import { useState, useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { UserProfileInterface} from '../bin/UserProfileLogic';
import { getUser } from '../bin/UserLogin';

function UserProfileRate(){
    const user = localStorage.getItem("username")
    console.log(user)
    if (!user) {
        return (
            <div>
                No user logged in
            </div>
        )
    }
    const navigate = useNavigate();
    const [thumbUpSelect, setThumbUpSelect] = useState(false)
    const [thumbDownSelect, setThumbDownSelect] = useState(false)
    const username = useParams().username
    const [aboutMe, setAboutMe] = useState("loading")    
    const [friendsList,setFriendsList] = useState("loading")    
    const [steamID, setSteamID] = useState("loading")
    const [steamLink, setSteamLink] = useState("https://store.steampowered.com/")
    const [mostPlayedGame,setMostPlayedGame] = useState("loading")
    const [profilePicture, setProfilePicture] = useState("78b8d8e49caa982de2bb2125f8d9620633205277") //PLACEHOLDER - This is my steam dp hash - yx
    if(username == undefined){
        navigate(`/NotFoundUser/`);
        return (
            <div>
                param in link is undefined
            </div>
        )
    }else{
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const userProfile: UserProfileInterface|undefined = await getUser(username);
                    if(userProfile){                
                        setSteamID(userProfile.steamID);
                        setAboutMe("Unimplemented");
                        setFriendsList("Unimplemented");
                        setMostPlayedGame("Unimplemented");
                        setSteamLink(`steam://url/SteamIDPage/${userProfile.steamID}`)
                        //TODO: grab their steam DP
                }else{
                    console.error("User Profile returned is undefined!")
                    navigate(`/NotFoundUser/${steamID}`);
                }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    navigate(`/NotFoundUser/${steamID}`);
                }
            };

            fetchData(); 
        }, []);
    
    const handleThumbUpClick = () => {
        setThumbUpSelect(!thumbUpSelect)
        setThumbDownSelect(false)
    };
    const handleThumbDownClick = () => {
        setThumbDownSelect(!thumbDownSelect)
        setThumbUpSelect(false)

    };


    return (
        <div className='fixed inset-0 bg-hero bg-cover bg-center min-h-screen'>
            <nav className="TOP_BAR flex flex-row justify-between fixed top-0 left-0 right-0 z-10 h-14 bg-transparent"> {/* TOP BAR */}
                <div className='bg-transparent pl-2 pt-2'>
                    <Sidebar buttons={[ "My Profile", "Edit Profile", "Create Session", "My Sessions", "View Requests", "View All Sessions"]} />
                </div>
                <div className='flex items-center mt-2'>
                    <input className="p-2 min-w-3/4 rounded-2xl text-grey bg-white focus:outline-none" placeholder='Search'/>
                    <span className="p-2 text-3xl">⚙️</span>    
                </div>
            </nav>
            <div className="POST_TOPBAR_CONTAINER pt-14 flex flex-col justify-center items-center"> {/* Container below TOP BAR */}
                <span className='text-white text-5xl font-bold pb-12'>Rate User</span>
                <div className="USER_ICON_&_USERNAME flex justify-center items-center pb-8"> {/* ICON + USERNAME */}   
                <img className="object-contain rounded-full w-32 h-32 border-4 border-[#2d44f5]" src={`https://avatars.steamstatic.com/${profilePicture}_full.jpg`} alt="Profile Picture" />
                    <div className="USERNAME ml-5 flex justify-center items-center rounded-2xl p-2 bg-[#2d44f5]"> {/* USERNAME */}
                        <h2 className="ml-5 mt-5 mb-5 text-3xl text-[#f7a72f] text-center font-extrabold ">Username: </h2> 
                        <h2 className="mr-1 mt-5 mb-5 text-3xl pl-4 text-white text-center font-extrabold ">{username}</h2> 
                        <div className="flex-none">
                            <a href={steamLink}>
                             <img className="ml-5 border-[#2d44f5be] h-12" src="../../Steam_icon_logo.png" alt="Steam Icon"></img>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className='THUMBS flex justify-center'>
            {(thumbUpSelect)? (
                     <img className="ml-5 border-[#2d44f5be] h-64" src="../../thumb_up_select.png" alt="Thumb up, deselected" onClick={handleThumbUpClick}></img>
                ) : (<img className="ml-5 border-[#2d44f5be] h-64" src="../../thumb_up.png" alt="Thumb up, deselected" onClick={handleThumbUpClick}></img>)}
            {(thumbDownSelect)? (
                     <img className="ml-5 border-[#2d44f5be] h-64" src="../../thumb_down_select.png" alt="Thumb up, deselected" onClick={handleThumbDownClick}></img>
                ) : (<img className="ml-5 border-[#2d44f5be] h-64" src="../../thumb_down.png" alt="Thumb up, deselected" onClick={handleThumbDownClick}></img>)}
            </div>
            
            <div className='flex justify-center pt-4'>
                    <button className='mr-10 bg-green-500 hover:bg-green-700 p-4 rounded-lg font-bold text-xl' 
                            >Submit Rating</button>
                    <button className='ml-10 bg-red-500 hover:bg-red-700 p-4 rounded-lg font-bold text-xl' 
                                >Cancel</button>
                </div>
        </div>
    );
    }
}
export default UserProfileRate