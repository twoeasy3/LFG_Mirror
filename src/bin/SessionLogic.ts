import axios from 'axios'; 
import { GameData } from './GetOwnedGames';
import { getParticipants } from './RequestLogic';

export enum Status{
    Open = "Open",
    Ongoing = "Ongoing",
    Ended = "Ended"
}

export enum SessionPrivacy{
    Private = "Private",
    Public = "Public"
}

export interface Session{
    id: number;
    session_name: string;
    appid: number;
    create_at: string; 
    time: string; //StringStamp 
    max_no_player: number;
    game_mode: string;
    host_user: string | number; // username of host for POST, userID of host for PUT
    language: string;
    prereq: string;
    is_public: boolean; // CURRENTLY NOT IN USE
    participants: Number[]; // array of participant ids
    status: string; // 0 == Expired, 1 == On-going
    game_name: string; // 
}

export interface SessionDataResponse {
    session_count: number;
    sessions: Session[];
}

export function compareTime(a: { time: string }, b: { time: string }): number {
    const timeA = new Date(a.time);
    const timeB = new Date(b.time);
    return timeA.getTime() - timeB.getTime();
  }
export function isTimeInPast(jsonTime: string): boolean {
    const parsedTime = new Date(jsonTime.slice(0,-1));
    
    const currentTime = new Date();
    console.log("currenTime", currentTime);
    console.log("parsedTime", parsedTime);
    
    return parsedTime < currentTime;
}

export async function getAllSessions():Promise<SessionDataResponse>{ 
    const sessionsLink: string = `https://tuanisworkingonsomeproject.pythonanywhere.com/api/session/?all=True`;

    try {
        const response = await fetch(sessionsLink);
        

        if (!response.ok) {
            throw new Error('Network response was not ok. Is the server running?');
        }

        const responseData: Session[] = await response.json();
        const sessionCount = responseData.length;

        // (FOR TESTING WHEN THERE IS NO SESSION)
        // const test: Session[] = []
        // const testResponse: SessionDataResponse = {
        //     session_count: 0,
        //     sessions: test
        // }
        // return testResponse;

        const jsonData: SessionDataResponse = {
            session_count: sessionCount,
            sessions: responseData
        };

        if (jsonData) {
            console.log(jsonData)
            return jsonData; // Return the session info
        } else {
            throw new Error('Response with no sessions');
        }
    } catch (error) {
        console.error('The fetch operation did not return an expected response:', error);
        throw error; // Return the error message
    }
}

export async function getOngoingSessions(): Promise<SessionDataResponse> {
    const data = await getAllSessions();
    const currentTime = new Date();

    // Ignore the status field in session
    const ongoingSessions = data.sessions.filter(session => {
        const sessionTime = new Date(session.time.slice(0,-1));
        return sessionTime > currentTime;
    });

    let responseData: SessionDataResponse = {
        session_count: ongoingSessions.length,
        sessions: ongoingSessions
    };

    console.log("ongoing sessions:", responseData);
    return responseData;
}

export async function getHostedSessions():Promise<SessionDataResponse>{
    const userid = localStorage.getItem("userID");
    const data = await getAllSessions();
    let sessionCount = 0
    let sessionsData: Session[] = [];
    let responseData: SessionDataResponse = {
        session_count: sessionCount,
        sessions: sessionsData
    };
    if (data){
        for (let i=0; i<data.session_count; i++){
            if (data.sessions[i].host_user == userid){
                sessionsData.push(data.sessions[i]);
                sessionCount += 1;
            }
        }
        responseData = {
            session_count: sessionCount,
            sessions: sessionsData
        };
        return responseData;
    }
    return responseData;
}

export async function getOngoingHostedSessions(): Promise<SessionDataResponse> {
    const userid = localStorage.getItem("userID"); 
    const currentTime = new Date();
    const data = await getAllSessions();

    const sessionsData: Session[] = data.sessions.filter(session => {
        const sessionTime = new Date(session.time.slice(0,-1));
        return session.host_user.toString() === userid && sessionTime > currentTime;
    });

    const responseData: SessionDataResponse = {
        session_count: sessionsData.length,
        sessions: sessionsData
    };

    console.log("Ongoing hosted sessions:", sessionsData);
    return responseData;
}

export async function getJoinedSessions():Promise<SessionDataResponse>{
    const userid = localStorage.getItem("userID");
    const useridint = Number(userid);
    const data = await getAllSessions();
    let sessionCount = 0
    let sessionsData: Session[] = [];
    let responseData: SessionDataResponse = {
        session_count: sessionCount,
        sessions: sessionsData
    };
    if (data){
        for (let i = 0; i < data.session_count; i++) {
            if (data.sessions[i].participants && data.sessions[i].participants.includes(useridint)) {
                sessionCount++;
                sessionsData.push(data.sessions[i]);
            }
        }
        responseData.session_count = sessionCount;
        responseData.sessions = sessionsData;
    }
    return responseData;
}

export async function getSessionFromID(id: number): Promise<Session | undefined> {

    const apiLink = `https://tuanisworkingonsomeproject.pythonanywhere.com/api/session/?all=False&id=${id}`;
    try {
        const sessionsData = await fetch(apiLink); 
        const session = await sessionsData.json();
        console.log("Single Session:", session);
        return session;
    } catch (error) {
        console.error('Error fetching session data', error);
        return undefined; // Return undefined in case of an error
    }
}

export function buildDateStringFromStamp(timeStamp:string):string{
    const date: Date = new Date(timeStamp.slice(0, -1));
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const fullDateString = `${day} ${month} ${year} ${hours}:${minutes}`;
    return fullDateString
}

export async function getAppInfo(appid: number): Promise<any> {
    const proxyLink: string = `https://twoeasy3.pythonanywhere.com/api/getGameInfo/${appid}`;

    try {
        const response = await fetch(proxyLink);

        if (!response.ok) {
            throw new Error('Network response was not ok. Is the server running?');
        }

        const data = await response.json();

        if (data) {
            return data; // Return the application name if it exists
        } else {
            throw new Error('Application name not found in the response');
        }
    } catch (error) {
        console.error('The fetch operation did not return an expected response:', error);
        return "#FetchError"; // Return the error message
    }
}

export const postNewSession = async (session:Session) => {
    try {
        const response = await axios.post('https://tuanisworkingonsomeproject.pythonanywhere.com/api/session/', session);
        console.log('DEBUG postNewSession Attempt:', response.data);
        return response.data
    } catch (error) {
        console.error('DEBUG postNewSession error:', error); 
    }
};

export function userOwnsGameFromSession(session:Session):boolean{
    const ownedGamesString: string | null = localStorage.getItem("ownedGames");
    const ownedGames: GameData[] | null = ownedGamesString ? JSON.parse(ownedGamesString) : null
    if(ownedGames == null){
        return(false)
    }
    return ownedGames.some(gameData => gameData.appID === session.appid);

}

export const updateSession = async (id: string, session: Session) => {
    try{
        console.log("new session from updateSession:", session)
        const response = await axios.put(`https://tuanisworkingonsomeproject.pythonanywhere.com/api/session/?id=${id}`, session);
        console.log('DEBUG updateSession attempt:', response.data);
        return response.data;
    }
    catch(error){
        console.error('DEBUG updateSession error:', error);
    }
}

export const deleteSession = async (id: string) => {
    try{
        const response = await axios.delete(`https://tuanisworkingonsomeproject.pythonanywhere.com/api/session/?id=${id}`);
        console.log('DEBUG deleteSession attempt:', response.data);
        return response.data;
    }
    catch(error){
        console.error('DEBUG deletesession error:', error);
    }
}

export const checkSessionFull = async (id: number) => {
    try{
        const session = await getSessionFromID(id);
        const participants = await getParticipants(id);
        if (session && participants){
            const maxPlayers = session.max_no_player - 1;
            const currentPlayers = participants.length;
            if (maxPlayers - currentPlayers <= 0){
                console.log("session is full")
                return true;
            }
        }
        console.log("session is not full");
        return false;
    }
    catch(error){
        console.error("error when checking session full");
    }
}
