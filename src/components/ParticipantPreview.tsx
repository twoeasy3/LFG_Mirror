import { useEffect, useState } from "react";
import { UserProfileInterface, fetchAvatar, getUserFromID } from "../bin/UserProfileLogic";
import { postRating, ratingInterface,getRating, updateRating } from "../bin/RatingLogic";
import { useParams } from "react-router-dom";

function ParticipantPreview({ participantId, canRate, isParticipant }: {participantId: Number, canRate:boolean, isParticipant: Boolean}) {
  const currentUser = localStorage.getItem("userID");
  const [participant, setParticipant] = useState<UserProfileInterface>();
  const [avatarHash, setAvatarHash] = useState("1bb629f74be925a370fafa73a80ab9f8266262c5");
  const [thumbUpSelect, setThumbUpSelect] = useState(false)
  const [thumbDownSelect, setThumbDownSelect] = useState(false)
  const [alreadyRated, setAlreadyRated] = useState<boolean|null>(null); //true for GOOD, false for BAD, null for not rated
  const [showRate, setShowRate] = useState(false);
  const sessionID = parseInt(useParams().sessionID!)

  const handleThumbUpClick = () => {
    setThumbUpSelect(!thumbUpSelect)
    setThumbDownSelect(false)
  };
  const handleThumbDownClick = () => {
      setThumbDownSelect(!thumbDownSelect)
      setThumbUpSelect(false)

  };


  const handleSubmitClick = async () => {
    if(!thumbDownSelect && !thumbUpSelect){
      alert("No rating selected") //temp interface
    } else{
    const rating: ratingInterface = {
      session: sessionID,
      rated_by: parseInt(localStorage.getItem("userID")!),
      rated_user: participantId.valueOf(),
      rating: thumbUpSelect? 1 : thumbDownSelect ? -1 : 0
    }
    postRating(rating)
    setAlreadyRated(thumbUpSelect)
    const participantID_number = participantId as number;
    await updateRating(participantID_number, (thumbUpSelect? 1 : thumbDownSelect ? -1 : 0));
    }
  };
  
  useEffect(() => {
    if(currentUser !== participantId.toString()){
      setShowRate(true);
    }
    let avatarPic = ""
    const fetchParticipantData = async () => {
    const data = await getUserFromID(participantId.valueOf());
    if (data){
        if(data.avatar_hash === ""){
        avatarPic = await fetchAvatar(data.steamID);}
        else{
          avatarPic = data.avatar_hash
        }
        if (avatarPic !== ""){
            setAvatarHash(avatarPic);
        }
    }
    setParticipant(data);
    };

    const fetchIfRated = async () => {     
      console.log("fetchIfRated") 
      const ratingData = await getRating(sessionID, parseInt(localStorage.getItem("userID")!), participantId.valueOf());
      if (ratingData){
        console.log(`rating: ${ratingData.rating}`)
        if (ratingData.rating>0){
          setAlreadyRated(true)
        }
        else{setAlreadyRated(false)}
      }
    }
    fetchParticipantData();
    fetchIfRated();
  }, [participantId]);
  
    if (!participant) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="participant-preview flex items-center justify-between">
        <div className="flex items-center justify-center">
          <img
              className="object-contain rounded-full w-10 h-10 border-4 border-[#2d44f5]"
              src={`https://avatars.steamstatic.com/${avatarHash}_full.jpg`}
              alt="Profile Picture"
          />
          <a className='underline pl-2 mr-5' target='_blank' href={`http://localhost:5173/UserProfile/${participant.username}`}>{participant.username}</a>
        </div>
        <div className="flex items-center">
          {(canRate && alreadyRated == null && showRate && isParticipant && parseInt(currentUser!) != participantId)?(
          <div className='THUMBS flex justify-center pr-2'>
              {(thumbUpSelect)? (
                      <img className="object-contain rounded-full w-10 h-10 pr-2" src="../../thumb_up_select.png" alt="Thumb up, deselected" onClick={handleThumbUpClick}></img>
                  ) : (<img className="object-contain rounded-full w-10 h-10 pr-2" src="../../thumb_up.png" alt="Thumb up, deselected" onClick={handleThumbUpClick}></img>)}
              {(thumbDownSelect)? (
                      <img className="object-contain rounded-full w-10 h-10" src="../../thumb_down_select.png" alt="Thumb up, deselected" onClick={handleThumbDownClick}></img>
                  ) : (<img className="object-contain rounded-full w-10 h-10" src="../../thumb_down.png" alt="Thumb up, deselected" onClick={handleThumbDownClick}></img>)}
          </div>) : (null)
          }
          {(alreadyRated==true)?(<img className="object-contain rounded-full w-10 h-10" src="../../thumb_up_select.png" alt="Thumb up, selected" ></img>)
          :
          (alreadyRated==false)?(<img className="object-contain rounded-full w-10 h-10" src="../../thumb_down_select.png" alt="Thumb up, selected" onClick={handleThumbDownClick}></img>)
          :(null)}
          {(canRate && alreadyRated == null && showRate && isParticipant  && parseInt(currentUser!) != participantId )?
          (<button className="h-5 flex items-center bg-green-600 hover:bg-green-700 p-3 rounded-lg font-bold text-base" onClick={handleSubmitClick}>Submit</button>):(null)}
        </div>
        
        
      </div>
    );
  }

export default ParticipantPreview;