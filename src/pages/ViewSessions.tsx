import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  getAllSessions,
  SessionDataResponse,
  Session,
  userOwnsGameFromSession,
  getOngoingSessions,
} from "../bin/SessionLogic";
import { compareTime } from "../bin/SessionLogic";
import { SessionPreview } from "../components/SessionPreview";
import Topbar from "../components/Topbar";
import { IoMdRefresh } from "react-icons/io";

enum SortType {
  None,
  Time,
  Name,
  SessionName,
}



function sortByName(
  a: { session_name: string },
  b: { session_name: string }
): number {
  if (a.session_name.toLowerCase() < b.session_name.toLowerCase()) {
    return -1;
  }
  if (a.session_name.toLowerCase() > b.session_name.toLowerCase()) {
    return 1;
  }
  return 0;
}

function groupSessionsIntoRowsOfTwo(
  allSessions: { sessions: Session[] },
  showNotOwned: boolean,
  sortType: SortType
): Session[][] {
  const SessionRowsOfTwo: Session[][] = [];
  let tempRow: Session[] = [];
  console.log(`Before: `, allSessions.sessions);
  if (sortType == SortType.Name) {
    allSessions.sessions.sort((a, b) => a.appid - b.appid);
  }
  if (sortType == SortType.Time) {
    allSessions.sessions.sort(compareTime);
  }
  if (sortType == SortType.SessionName) {
    allSessions.sessions.sort(sortByName);
  }
  console.log(`After: `, allSessions.sessions);
  console.log(allSessions.sessions);
  allSessions.sessions.forEach((session, index) => {
    const owned = userOwnsGameFromSession(session);

    if ((!owned && showNotOwned) || owned) {
      tempRow.push(session);
      console.log(session.session_name, owned);
      console.log(tempRow);
      if (tempRow.length === 2) {
        SessionRowsOfTwo.push(tempRow);
        tempRow = [];
      }
    }
  });
  if (tempRow.length === 1) {
    SessionRowsOfTwo.push(tempRow);
  }
  return SessionRowsOfTwo;
}

function ViewSessions() {
  const user = localStorage.getItem("username");
  console.log(user);
  if (!user) {
    return <div>No user logged in</div>;
  }

  const [allSessions, setAllSessions] = useState<
    SessionDataResponse | undefined
  >(undefined);
  const [showNotOwned, setShowNotOwned] = useState<boolean>(false);
  const [notOwnedFilterText, setNotOwnedFilterText] = useState<string>(
    "Hide Unowned Games"
  );
  const [sortType, setSortType] = useState<SortType>(SortType.None);
  const [sortTypeText, setSortTypeText] = useState<string>("Not Sorting");
  const [sessCount, setSessCount] = useState(0);
  const [showNoSessionMessage, setShowNoSessionMessage] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleNotOwnedClick = () => {
    if (showNotOwned) {
      setNotOwnedFilterText("Hide Unowned Games");
      setShowNotOwned(false);
    } else {
      setNotOwnedFilterText("Show Unowned Games");
      setShowNotOwned(true);
    }
  };
  const handleSortClick = () => {
    if (sortType == SortType.None) {
      setSortTypeText("Sort by ##APPID;REPLACE");
      setSortType(SortType.Name);
    } else if (sortType == SortType.Name) {
      setSortTypeText("Sort by Time");
      setSortType(SortType.Time);
    } else if (sortType == SortType.Time) {
      setSortTypeText("Sort by Session Name");
      setSortType(SortType.SessionName);
    } else {
      setSortTypeText("Sort by ##APPID;REPLACE");
      setSortType(SortType.Name);
    }
  };

  useEffect(() => {
    getOngoingSessions()
      .then((allSessions) => {
        setAllSessions(allSessions);
        setSessCount(allSessions.session_count);
      })
      .catch((error) => {
        console.error("Error fetching session data", error);
        setAllSessions(undefined);
      });      
  }, [showNotOwned,sortType, refresh]); 

  useEffect(() => {
    setShowNoSessionMessage(false);
    const timeout = setTimeout(() => {
      setShowNoSessionMessage(true);
    }, 1500);
    return () => clearTimeout(timeout)
  }, [refresh])
  
  let SessionsRowsOfTwo: Session[][] = [];
  if (allSessions !== undefined) {
    SessionsRowsOfTwo = groupSessionsIntoRowsOfTwo(
      allSessions,
      showNotOwned,
      sortType
    );
  }

  function handleRefresh(){
    setRefresh(!refresh);
  }

  return (
    <div className='bg-hero bg-cover bg-center min-h-screen'>
        <Sidebar buttons={["Create Session", "My Sessions", "View Joined Sessions", "View Requests", "My Profile"]} />
        <Topbar/>
        <div className = "justify-center items-center flex">
            <div className='CONTAINER_FOR_SESSIONS text-white text-5xl font-bold mb-8 text-center w-[55%] justify-between items-center'>
              <div className="flex items-center justify-between mb-4">
                <div className="flex">
                  <span className='text-white text-5xl font-bold underline'>All Sessions</span>
                  <button className="pl-2 flex items-center" onClick={handleRefresh}><IoMdRefresh className="pt-2" color="white" size={50}/></button>
                </div>
                
                {sessCount !== 0 && 
                <div>
                  <button className='bg-blue-700 hover:bg-blue-900 px-4 py-2 rounded-lg font-bold text-base mt-2' onClick={handleNotOwnedClick}> {notOwnedFilterText}</button>   
                  <button className='ml-5 bg-blue-700 hover:bg-blue-900 px-4 py-2 rounded-lg font-bold text-base mt-2' onClick={handleSortClick}> {sortTypeText}</button>  
                </div>
                }
              </div>        
                {sessCount !== 0 ? (
                    SessionsRowsOfTwo.map((sessionRow, index) => (
                        <div className = "flex flex-row justify-between">
                        <SessionPreview key={index*2} PreviewSession={sessionRow[0]} />
                        {sessionRow.length > 1 ? (
                            <SessionPreview key={index*2 +1} PreviewSession={sessionRow[1]} />
                        ) : (<SessionPreview key={index*2 +1} PreviewSession={null} />)}

                        </div>
                    ))
                ) : (
                  showNoSessionMessage &&
                  <div className='LOADING_PLACEHOLDER fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>There is no existing session</div> 
                )}
            </div>
        </div>
    </div>
);
}

export default ViewSessions;
