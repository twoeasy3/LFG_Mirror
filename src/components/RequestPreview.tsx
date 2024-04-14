import { useState, useEffect } from 'react'
import { Request, deleteRequest, updateRequest } from '../bin/RequestLogic';
import { fetchAvatar, getUserFromID } from '../bin/UserProfileLogic';
import { getSessionFromID } from '../bin/SessionLogic';

function RequestPreview({ request }: { request: Request }) {

    const [userName, setUserName] = useState("");
    const [sessName, setSessName] = useState("");
    const [status, setStatus] = useState(true);
    const [avatarhash, setAvatarHash] = useState("1bb629f74be925a370fafa73a80ab9f8266262c5");

    useEffect(() => {
      (async () => {
        try {
          const user = await getUserFromID(request.participant);
          if (user) {
            setUserName(user.username);
            const avatarHash = await fetchAvatar(user.steamID);
            setAvatarHash(avatarHash);
          }
        } catch (error) {
          console.log("error retrieving user information", error);
        }
  
        try {
          const session = await getSessionFromID(request.session);
          if (session) {
            setSessName(session.session_name);
          }
        } catch (error) {
          console.log("error retrieving session name", error);
        }
      })();
    }, [request.participant, request.session]);

    async function handleAcceptClick(){
      //Don't need to add to participants[]
      //as when person request to join,
      //his userid already appended to participants[]
      const updateReq: Request = {
        id: 0,
        status: "Accepted",
        session: request.session,
        participant: request.participant
      }
      await updateRequest(request!.participant, request!.session, updateReq);
      setStatus(false);
    }

    async function handleRejectClick() {
      try {
        // (NOT IN USE) 
        // const updateReq: Request = {
        //   id: 0,
        //   status: "Rejected",
        //   session: request.session,
        //   participant: request.participant,
        // };
        // await updateRequest(request.participant, request.session, updateReq);
        await deleteRequest(request.participant, request.session);
        setStatus(false);
        console.log("Reject request successful");
      } catch (error) {
        console.error("Failed to reject request:", error);
      }
    }

    return status && (
        <div className="PROFILE_INFO w-full mt-10 flex flex-row items-center rounded-2xl p-4 text-xl bg-[#2d44f5be] mx-auto">
          <div className="flex-shrink-0 mr-4">
            <img
              className="object-contain rounded-full w-20 h-20 border-4 border-[#2d44f5be]"
              src={`https://avatars.steamstatic.com/${avatarhash}_full.jpg`}
            ></img>
          </div>
          <div className="Request_Info flex justify-start items-center w-full">
            <span className="mr-5 mt-5 mb-5 text-white text-center font-extrabold flex">
                <a className='underline pr-4' target='_blank' href={`https://lfg-mirror.vercel.app//UserProfile/${userName}`}>{userName}</a> wishes to join "{sessName}"!
            </span>
            
          </div>
          <div className="flex space-x-4">
            <button className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded" onClick={handleAcceptClick}>
              Accept
            </button>
            <button className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded" onClick={handleRejectClick}>
              Reject
            </button>
          </div>
        </div>
    );
}

export default RequestPreview