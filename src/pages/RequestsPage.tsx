import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { SessionDataResponse, getOngoingHostedSessions } from "../bin/SessionLogic";
import { RequestDataResponse, getRequests } from "../bin/RequestLogic";
import RequestPreview from "../components/RequestPreview";
import Topbar from "../components/Topbar";
import { IoMdRefresh } from "react-icons/io";

function RequestsPage() {
  const user = localStorage.getItem("username");
  console.log(user);

  if (!user) {
    return <div>No user logged in</div>;
  }

  const buttons: string[] = [
                              "View All Sessions",
                              "Create Session",
                              "My Sessions",
                              "View Joined Sessions",
                              "My Profile",
                            ];
                          
  const [noReq, setNoReq] = useState(true);                          
  const [hostedSessions, setHostedSessions] = useState<SessionDataResponse | undefined>(undefined);
  const [req, setReq] = useState<RequestDataResponse | undefined>(undefined);
  const [showPending, setShowPending] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showRequest, setShowRequest] = useState(false);

  useEffect(() => {
    //if he didn't host any session, can just assume no request
    const fetchData = async () => {
      try {
        const hostedSessions = await getOngoingHostedSessions();
        setHostedSessions(hostedSessions);
        if (hostedSessions && hostedSessions.session_count === 0) {
            console.log("NO HOSTED SESSION DETECTED! 1st useEFFECT")
            setNoReq(true);
        } else {
            console.log("HOSTED SESSION DETECTED");
            setNoReq(false);
        }
      } catch (error) {
        console.error("Error fetching session data", error);
        setHostedSessions(undefined);
      }
    };
    fetchData();
  },[refresh])
  
  useEffect(() => {
    //get the request based on the session id
    const fetchRequests = async (hostedIDs: number[]) => {
      try {
          console.log("hostedIDS", hostedIDs);
          const req = await getRequests(hostedIDs);
          setReq(req);
          if (req.request_count === 0) {
              setNoReq(true);
              console.log("NO REQUEST DETECTED!! 2nd useEFFECT");
              console.log("useEFFECT2:",req);
          }
          else{
            console.log("REQUEST DETECTED!! 2nd useEFFECT");
            setNoReq(false);
          }
      } catch (error) {
          console.error("Error fetching session data", error);
      }
    };
    const newHostedID = [];
    if (hostedSessions?.session_count){
      for (let i = 0; i<hostedSessions.session_count; i++){
        newHostedID.push(hostedSessions.sessions[i].id);
      }
    }
    fetchRequests(newHostedID);
  }, [hostedSessions])

  useEffect(() => {
    setShowPending(false);
    setShowRequest(false);
    const timer = setTimeout(() => {
      setShowPending(true);
      setShowRequest(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [refresh])

  function handleRefresh(){
    setRefresh(!refresh);
  }
  
  return (
    <div className="bg-hero bg-cover bg-center min-h-screen">
      <Sidebar buttons={buttons} />
      <Topbar/>
      <div className = "justify-center items-center flex">
        <div className='CONTAINER_FOR_SESSIONS text-white text-5xl font-bold mb-8 text-center w-[50%] justify-between items-center'>
          <div className="flex items-center justify-start mb-4">
            <span className='text-white text-5xl font-bold underline'>Requests</span>
            <button className="pl-2 flex items-center" onClick={handleRefresh}><IoMdRefresh className="pt-2" color="white" size={50}/></button>
          </div>        
          {!noReq && showRequest ? (
              <div className = "flex-col justify-center items-center">
                {req?.requests.map((request, index) => (
                  <RequestPreview key={index} request={request}/>
                ))}
              </div>
              )
            : (
            showPending && <div className='LOADING_PLACEHOLDER fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>You do not have any pending requests</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestsPage;
