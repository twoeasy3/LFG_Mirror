import axios from "axios"

export interface UserProfileInterface{
    id: number
    username:string
    about_me:string
    mostPlayedGame:string //Placeholder; re-implement this! TODO
    steamID: string //Store all Steam64IDs as strings please
    friends: string[]
    rating: number
    email: string
    avatar_hash:string
}

//Unimplemented, do not use
export const getUserBySteam = async (steamID: string) => {
    const apiGetLink = `https://tuanisworkingonsomeproject.pythonanywhere.com/api/user/?all=False&steamID=${steamID}`;
    try {
        const response = await axios.get(apiGetLink);
        console.log("Debug getUser attempt: ", response.data);
        return response.data;
    } catch (error) {
        console.error('DEBUG getUser error:', error);
    }
};

//this is terrible but it's how the database works currently
export const updateUser = async (username: string, userProfile: UserProfileInterface) => {
    try {
        const response = await axios.put(`https://tuanisworkingonsomeproject.pythonanywhere.com/api/user/?username=${username}`, userProfile);
        console.log('DEBUG updateUser attempt:', response.data);
        return response.data
    } catch (error) {
        console.error('DEBUG updateUser error:', error); 
    }
};

export async function getAllUsers():Promise<UserProfileInterface[]>{ 
    const usersLink: string = `https://tuanisworkingonsomeproject.pythonanywhere.com/api/user/?all=True`;

    try {
        const response = await fetch(usersLink);
        

        if (!response.ok) {
            throw new Error('Network response was not ok. Is the server running?');
        }

        const responseData = await response.json();

        const jsonData: UserProfileInterface[] = responseData

        if (jsonData) {
            return jsonData; // Return the session info
        } else {
            throw new Error('Response with no users');
        }
    } catch (error) {
        console.error('The fetch operation did not return an expected response:', error);
        throw error; // Return the error message
    }
}

export async function getUserFromUsername(username:string):Promise<UserProfileInterface|undefined>{

    const apiLink: string = `https://tuanisworkingonsomeproject.pythonanywhere.com/api/user/?all=False&username=${username}`
    try {
        const response = await fetch(apiLink)
        const user = await response.json();
        if (user.avatar_hash == ""){
            user.avatar_hash = await fetchAvatar(user.steamID)
            console.log("updating user....")
            updateUser(user.username, user) //cache the avatarHash
        }
        return user;
    } catch (error) {
        console.error('Error fetching user data', error);
        return undefined; // Return undefined in case of an error
    }
}    

export async function getUserFromID(id:number):Promise<UserProfileInterface|undefined>{

    const apiLink: string = `https://tuanisworkingonsomeproject.pythonanywhere.com/api/user/?all=False&id=${id}`
    try {
        const response = await fetch(apiLink)
        const user = await response.json();
        if (user.avatar_hash == ""){
            user.avatar_hash = await fetchAvatar(user.steamID)
            console.log("updating user....")
            updateUser(user.username, user) //cache the avatarHash
        }
        return user;
    } catch (error) {
        console.error('Error fetching user data', error);
        return undefined; // Return undefined in case of an error
    }
}    

export async function getUserFromEmail(email:string):Promise<UserProfileInterface|undefined>{

    const apiLink: string = `https://tuanisworkingonsomeproject.pythonanywhere.com/api/user/?all=False&email=${email}`
    try {
        const response = await fetch(apiLink)
        const user = await response.json();
        console.log(user)
        return user;
    } catch (error) {
        console.error('Error fetching user data', error);
        return undefined; // Return undefined in case of an error
    }
}

export async function fetchAvatar(steamid: string):Promise<string>{
    try {
        const response = await axios.get(
            `https://twoeasy3.pythonanywhere.com/api/getSteamPicture/${steamid}`
        );
        if (response){
            return response.data;
        }
        else{
            return "1bb629f74be925a370fafa73a80ab9f8266262c5";
        }
    }
    catch(error){
        console.error("error retrieving avatar", error)
        return "1bb629f74be925a370fafa73a80ab9f8266262c5";
    }
}

interface mostPlayedGame {  
    name: string
    hours: number
    appid: number
}

export async function getMostPlayedGames(steamid: string):Promise<mostPlayedGame|undefined>{
    try {
        const response = await axios.get(
            `https://twoeasy3.pythonanywhere.com/api/getMostPlayedGame/${steamid}`
        );
        if (response){
            return response.data;
        }
    }
    catch(error){
        console.error("error retrieving most played game", error);
        return undefined;
    }
}


//Depreciated. Superceded by getUserBySteam() 
/* export async function getUserProfile(steamID: string|undefined): Promise<UserProfileInterface|undefined> {
    const apiLink: string = `https://twoeasy3.pythonanywhere.com/api/getProfile/${steamID}`;

    try {
        const response = await fetch(apiLink);

        if (!response.ok) {
            throw new Error('Network response was not ok. Is the server running?');
        }

        const jsonData: UserProfileInterface = await response.json();
        if (jsonData) {
            
            return jsonData; // Return the profile info
        } else {
            throw new Error('No response, is the server running or is the user profile private?');
        }
    } catch (error) {
        console.error('The fetch operation did not return an expected response:', error);
        return undefined;
    }
} */

