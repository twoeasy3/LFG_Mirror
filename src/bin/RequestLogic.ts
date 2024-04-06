import axios from "axios";

export interface Request {
    id: number; //id of request
    status: string; //status can only be "Pending", "Accepted", "Rejected"
    session: number; //id of session
    participant: number; //id of user
}

export interface RequestDataResponse {
    request_count: number;
    requests: Request[];
}

export async function getAllRequests():Promise<RequestDataResponse>{
    const requestLink = `https://tuanisworkingonsomeproject.pythonanywhere.com/api/sessionlist/?all=True`;
    try {
        const response = await fetch(requestLink);
        if (!response.ok) {
            throw new Error('Network response was not ok. Is the server running?');
        }
        const responseData: Request[] = await response.json();
        const responseCount = responseData.length;

        const jsonData: RequestDataResponse = {
            requests: responseData,
            request_count: responseCount
        }
        if (jsonData){
            //console.log(jsonData)
            return jsonData; // Return the session info
        } else {
            throw new Error('Response with no sessions');
        }
    } catch (error) {
        console.error('The fetch operation did not return an expected response:', error);
        throw error; // Return the error message
    }
}

export async function getRequests(hostedID: number[]): Promise<RequestDataResponse> {
    const data = await getAllRequests();
    let requestData: Request[] = [];
    let requestCount: number = 0;
    if (data) {
        console.log("inisde getRequests for loop");
        for (let i = 0; i < data.requests.length; i++) {
            if (hostedID.includes(data.requests[i].session) && data.requests[i].status === "Pending") {
                requestData.push(data.requests[i]);
                requestCount++;
            }
        }
    }
    console.log("getRequestsData:", data);
    console.log("getRequestsReturnData:", requestData);
    return {
        request_count: requestCount,
        requests: requestData
    };
}

// export async function getPendingRequest(hostedID: number[]):Promise<RequestDataResponse>{
//     let requestData: Request[] = [];
//     let requestCount: number = 0;
//     for (let i=0; i<hostedID.length; i++){
//         const response = await axios.get(`https://tuanisworkingonsomeproject.pythonanywhere.com/api/sessionlist/?all=False&session_id=${hostedID}`);
//         requestData.push(response.data);
//         requestCount += response.data.length;
//     }
//     let requestResponse: RequestDataResponse = {
//         request_count: requestCount,
//         requests: requestData
//     }
//     return requestResponse
    
// }

export async function postRequest(req: Request){
    const reqLink = "https://tuanisworkingonsomeproject.pythonanywhere.com/api/sessionlist/"
    try {
        const response = await axios.post(reqLink, req);
        console.log('DEBUG postRequest Attempt:', response.data);
        return response.data;
    } catch (error) {
        console.error('DEBUG postRequest error:', error);
    }
}

export async function checkExistingRequest(userID: number, sessionID:number):Promise<boolean>{
    try{
        const response = await axios.get(`https://tuanisworkingonsomeproject.pythonanywhere.com/api/sessionlist/?all=False&session_id=${sessionID}&user_id=${userID}`);
        console.log("response: ", response);
        console.log("response length:", response.data.length);
        return true;
    } catch (error){
        console.error("Debug checkExistingRequest ERROR", error)
        return false;
    }
}

export async function hasJoined(userID: number, sessionID:number):Promise<boolean>{
    try{
        const response = await axios.get(`https://tuanisworkingonsomeproject.pythonanywhere.com/api/sessionlist/?all=False&session_id=${sessionID}&user_id=${userID}`);
        console.log("response: ", response);
        console.log("response length:", response.data.length);
        if (response.data.status === "Accepted"){
            return true;
        }
        else{
            return false;
        }
    } catch (error){
        console.error("Debug checkExistingRequest ERROR", error)
        return false;
    }
}

export const updateRequest = async (userID: number, sessionID:number, newReq: Request) => {
    try{
        const response = await axios.put(`https://tuanisworkingonsomeproject.pythonanywhere.com/api/sessionlist/?session_id=${sessionID}&user_id=${userID}`, newReq);
        console.log('DEBUG updateRequest attempt:', response.data);
        return response.data
    }
    catch(error){
        console.error('DEBUG updateRequest error:', error);
    }
}


export async function getParticipants(sessionID: number):Promise<Number[]>{
    try {
        let returnParticipants = [];
        const response = await axios.get(`https://tuanisworkingonsomeproject.pythonanywhere.com/api/sessionlist/?all=False&session_id=${sessionID}`);
        if (response){
            for (let i=0; i<response.data.length; i++){
                if (response.data[i].status === "Accepted"){
                    returnParticipants.push(response.data[i].participant_id);
                }
            }
        }
        console.log("accepted participants", returnParticipants);
        return returnParticipants;

    } catch(error){
        console.error("Error retrieving participants", error)
        return [];
    }
}

export const deleteRequest = async (userID: number, sessionID:number) => {
    try {
        const config = {
            data: { // Axios expects the body for DELETE requests in the `data` property of the config
                "session": sessionID,
                "participant": userID
            }
        };
        const response = await axios.delete(`https://tuanisworkingonsomeproject.pythonanywhere.com/api/sessionlist/`, config);
        if (response.status === 204){
            console.log("delete request successful");
        }
        else{
            console.log("delete request failed")
        }
    }
    catch (error){
        console.error("error deleting request", error);
    }
}