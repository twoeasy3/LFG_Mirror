import { useState, useEffect } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getSessionFromID, isTimeInPast } from '../bin/SessionLogic';
import { Session } from '../bin/SessionLogic';
import { buildDateStringFromStamp } from '../bin/SessionLogic';
import { getUserFromID, UserProfileInterface } from '../bin/UserProfileLogic';
import { Request, checkExistingRequest, getParticipants, hasJoined, postRequest } from '../bin/RequestLogic';
import ParticipantPreview from '../components/ParticipantPreview';
import Topbar from '../components/Topbar';

function SingleSession(){
    const user = localStorage.getItem("username")
    const userID = localStorage.getItem("userID");
    console.log(user)
    if (!user) {
        return (
            <div>
                No user logged in
            </div>
        )
    }
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("")
    const [thisSession, setThisSession] = useState<Session|undefined>(undefined)
    const [appid, setAppid] = useState<number|null>(null)
    const [gameName, setGameName] = useState("loading...")
    const [time, setTime] = useState("loading");
    const [hostUser, setHostUser] = useState<UserProfileInterface>({
        id: -1,
        username:"loading",
        about_me:"What is that... it's The Unknown!",
        mostPlayedGame:"Half-Life 3",
        steamID: "0",
        friends: [],
        rating: 0,
        email:"unknown@unknown.com",
        avatar_hash: "fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb" //steam question mark avatar hash
    })//dummy user data instead of having to assert types everywhere -yx
    const [participants, setParticipants] = useState<Number[]>([]);
    const [showButton, setShowButton] = useState(false);
    const [buttonDelay, setButtonDelay] = useState(false);
    const [isOver, setIsOver] = useState(false)
    const sessionID = useParams().sessionID;
    if (sessionID && isNaN(Number(sessionID)) || sessionID == undefined) {
        return(
            <div>
                url path is not a number
            </div>
        )
    } else {

        useEffect(() => {
            const fetchData = async () => {
                const session = await getSessionFromID(parseInt(sessionID))
                if (session !== undefined) {
                    setThisSession(session);
                    setAppid(session.appid)
                    setTime(buildDateStringFromStamp(session.time));
                    setIsOver(isTimeInPast(session.time))
                    const data = await getParticipants(session.id);
                    setParticipants(data);
                    console.log("time", buildDateStringFromStamp(session.time));
                    setGameName(session.game_name);
                    const host = await getUserFromID(parseInt(session!.host_user as string)) //do not un-nest this code, doesn't work otherwise
                    if (host) {
                        setHostUser(host);
                        console.log(`HOST FOUND: ${host.username}`)}
                    if(session.status !== "0" && !await hasJoined(Number(userID), session.id)){
                        setShowButton(true);
                    }
                } else {
                    //here as well
                }
            }
            fetchData();
        }, []);
        useEffect(()=> {
            setButtonDelay(false);
            const timer = setTimeout(() => {
                setButtonDelay(true);
            }, 1500);
            return () => clearTimeout(timer);
        }, [])

        

    const handleBackClick = () => {
        console.log("Navigating away - debug")
        navigate("/ViewSessions"); 
    };

    const handleJoinClick = async () => {
        if (await checkExistingRequest(Number(userID), thisSession!.id)){
            //ALREADY GOT EXISTING REQUEST
            console.log("already have a pending request");
            setMessage("You already have an existing request");
        }
        else{
            const newReq: Request = {
                id: 0,
                participant: Number(userID),
                session: thisSession!.id,
                status: "Pending"
            }
            postRequest(newReq);
            console.log("request sent");
            setMessage("Request Sent")
        }
        setShowPopup(true); // Show the success popup
        setTimeout(() => {
            setShowPopup(false); // Hide the popup after 1.5 seconds
            navigate(`/ViewSessions`);
        }, 1500);
    }

    return (
        <div className='relative inset-0 bg-hero bg-cover bg-center min-h-screen'>
            <Sidebar buttons={["View All Sessions", "My Profile"]} />
            <Topbar/>
            <div className="POST_TOPBAR_CONTAINER pt-4 flex flex-col justify-center items-center"> {/* Container below TOP BAR */}
                <span className='text-white text-5xl font-bold pb-12'>Session Details</span>
                <div className="USER_ICON_&_USERNAME flex justify-center items-center pb-8"> {/* ICON + USERNAME */}   
                {(appid == null ? 
                            <img className="ml-5 border-[#2d44f5be]" src="../../banner_loading.jpg"></img>
                            : <img className="ml-5 border-[#2d44f5be]" src={`https://cdn.akamai.steamstatic.com/steam/apps/${appid}/capsule_231x87.jpg`}></img>)}
                    <div className="USERNAME ml-5 flex justify-center items-center rounded-xl p-2 bg-[#2d44f5]"> {/* USERNAME */}
                        <h2 className="mt-5 mb-5 text-3xl px-4 text-white font-extrabold flex justify-center items-center">{thisSession?.session_name}</h2> 
                    </div>
                </div>
                <div className="PROFILE_INFO w-3/5 mt-5 flex flex-col items-center rounded-2xl p-4 text-xl bg-[#2d44f5]"> {/* PROFILE-INFO */}
                    <div className = "ABOUT_ME flex justify-center items-center"> {/* ABOUT ME */}
                        <h5 className="mr-5 mt-5 mb-5  text-white text-center font-extrabold text-wrap ">
                            <span className= "mr-5 mt-5 mb-5  text-[#f7a72f] text-center font-extrabold ">Game:</span>
                            {gameName}</h5>
                    </div>
                    <div className = "flex justify-center items-center"> {/*TIME*/}
                        <h5 className="mr-5 mt-5 mb-5  text-white text-center font-extrabold text-wrap ">
                            <span className= "mr-5 mt-5 mb-5  text-[#f7a72f] text-center font-extrabold ">Start Time:</span>
                            {time}</h5>
                    </div>
                    <div className = "flex justify-center items-center"> {/*GAMEMODE*/}
                        <h5 className="mr-5 mt-5 mb-5  text-white text-center font-extrabold text-wrap ">
                            <span className= "mr-5 mt-5 mb-5  text-[#f7a72f] text-center font-extrabold ">GameMode:</span>
                            {thisSession?.game_mode}</h5>
                    </div>
                    <div className = "flex justify-center items-center"> {/*PRE-REQ*/}
                        <h5 className="mr-5 mt-5 mb-5  text-white text-center font-extrabold text-wrap ">
                            <span className= "mr-5 mt-5 mb-5  text-[#f7a72f] text-center font-extrabold ">Prerequisites:</span>
                            {thisSession?.prereq}</h5>
                    </div>
                    <div className = "flex justify-center items-center"> {/*LANGUAGE*/}
                        <h5 className="mr-5 mt-5 mb-5  text-white text-center font-extrabold text-wrap ">
                            <span className= "mr-5 mt-5 mb-5  text-[#f7a72f] text-center font-extrabold ">Language:</span>
                            {thisSession?.language}</h5>
                    </div>
                    <div className = "flex justify-center items-center pt-2"> {/*PARTICIPANTS*/}
                        <span className= "mr-5 mt-5 mb-5  text-[#f7a72f] text-center font-extrabold">Participants:</span>
                        <div className="flex-col text-white font-extrabold items-center justify-center">
                            <div className='flex items-center'><ParticipantPreview participantId={hostUser.id} canRate = {isOver} /><span className='pl-2'>(HOST)</span></div>
                            {participants.map(participantId => (
                                <ParticipantPreview participantId={participantId} canRate = {isOver} />
                            ))}
                        </div>
                    </div>
                </div>
                {
                    buttonDelay ? (
                        showButton ? (
                            <div className='flex flex-row justify-between w-2/5 text-sm mt-8 pb-8'>
                                <button className='bg-red-500 hover:bg-red-700 p-4 rounded-lg font-bold text-xl' onClick={handleBackClick}>Back to Sessions</button>
                                <button className='bg-green-500 hover:bg-green-700 p-4 rounded-lg font-bold text-xl' onClick={handleJoinClick}>Request to Join</button>
                            </div>
                        ) : (
                            <div className='flex flex-row justify-center w-2/5 text-sm mt-8 pb-8'>
                                <button className='bg-red-500 hover:bg-red-700 p-4 rounded-lg font-bold text-xl' onClick={handleBackClick}>Back to Sessions</button>
                            </div>
                        )
                    ) : ""
                }
                                

                
                
                {showPopup && (
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-55">
                        <div className="bg-[#223bfcbe] p-8 rounded-lg text-xl">
                        <p className="text-white">{message}</p>
                        </div>
                    </div>
                    )}
            </div>
        </div>
    );
    }
}
export default SingleSession