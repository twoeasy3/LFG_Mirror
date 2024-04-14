import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { SessionDataResponse, Session, getJoinedSessions } from '../bin/SessionLogic';
import { SessionPreview } from '../components/SessionPreview';
import Topbar from '../components/Topbar';


  function compareTime(a: { time: string }, b: { time: string }): number {
    const timeA = new Date(a.time);
    const timeB = new Date(b.time);
    return timeB.getTime() - timeA.getTime();
  }
  
  function groupSessionsIntoRowsOfTwo(
    allSessions: { sessions: Session[] },
  ): Session[][] {
    const SessionRowsOfTwo: Session[][] = [];
    let tempRow: Session[] = [];
    console.log(`Before: `, allSessions.sessions);
    allSessions.sessions.sort(compareTime) //sort by time by default
    console.log(`After: `, allSessions.sessions);
    console.log(allSessions.sessions);
    allSessions.sessions.forEach((session, _index) => {
      tempRow.push(session);
      console.log(session.session_name);
      console.log(tempRow);
      if (tempRow.length === 2) {
          SessionRowsOfTwo.push(tempRow);
          tempRow = [];
      }
    });
    if (tempRow.length === 1) {
        SessionRowsOfTwo.push(tempRow);
    }
    return SessionRowsOfTwo;
  }
  
  function ViewJoinedSessions() {
    const user = localStorage.getItem("username");
    console.log(user);
    if (!user) {
        return <div>No user logged in</div>;
    }
  
    const [joinedSessions, setJoinedSessions] = useState<SessionDataResponse | undefined>(undefined);
    const [sessCount, setSessCount] = useState(0);
    const [showNoSessionMessage, setShowNoSessionMessage] = useState(false);
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        setShowNoSessionMessage(true);
      }, 1000);
      getJoinedSessions()
      .then((hostedSessions) => {
          setJoinedSessions(hostedSessions);
          setSessCount(hostedSessions.session_count);
      })
      .catch((error) => {
          console.error("Error fetching session data", error);
          setJoinedSessions(undefined);
      });
      return () => clearTimeout(timeout)
    }, []);
  
    let SessionsRowsOfTwo: Session[][] = [];
    if (joinedSessions !== undefined) {
        SessionsRowsOfTwo = groupSessionsIntoRowsOfTwo(
        joinedSessions);
    }
  
    return (
      <div className='bg-hero bg-cover bg-center min-h-screen'>
          <Sidebar buttons={["View All Sessions", "Create Session", "My Sessions", "View Requests", "My Profile"]} />
          <Topbar/>
          <div className = "justify-center items-center flex">
              <div className='CONTAINER_FOR_SESSIONS text-white text-5xl font-bold mb-8 text-center w-[55%] justify-between items-center'>
              <div className="flex items-center justify-between mb-4">
                  <span className='text-white text-5xl font-bold underline'>Joined Sessions</span>
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
                    <div className='LOADING_PLACEHOLDER fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>You have not join any session</div>
                  )}
              </div>
          </div>
      </div>
    );
  }

export default ViewJoinedSessions;