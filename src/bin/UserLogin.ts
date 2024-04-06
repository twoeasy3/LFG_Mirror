import axios from 'axios';
import { fetchAvatar, updateUser } from './UserProfileLogic';

interface LoginInterface {
    username: string
    password: string;
}

export const userLogin = async (username: string, password:string) => {
    let loginAttempt:LoginInterface = {'username':username, 'password': password}
    try {
        const response = await axios.post('http://twoeasy3.pythonanywhere.com/api/log_in', loginAttempt);
        console.log('DEBUG login attempt:', response.data);
        return response.data
    } catch (error) {
        console.error('DEBUG login error:', error); 
    }
};


export const getUser = async (username:string) => {
    const apiGetLink = `https://tuanisworkingonsomeproject.pythonanywhere.com/api/user/?all=False&username=${username}`
    try{
        const response = await axios.get(apiGetLink);
        console.log("Debug getUser attempt: ", response.data);
        let new_avatar_hash = await fetchAvatar(response.data.steamID)
        if(new_avatar_hash != response.data.avatar_hash){
            response.data.avatar_hash = new_avatar_hash
            console.log("updating user....")
            updateUser(response.data.username, response.data) //cache the avatarHash
        }return response.data;
        
    } catch(error){
        console.error('DEBUG getUser error:', error);
    }
}


export const changePassword = async (username: string, password:string) => {
    let passwordUpdate:LoginInterface = {'username':username, 'password': password} //Convenient that this interface fits also huh
    try {
        const response = await axios.post('http://twoeasy3.pythonanywhere.com/api/resetPassword', passwordUpdate);
        console.log('DEBUG change pass attempt:', response.data);
        return response.data
    } catch (error) {
        console.error('DEBUG change pass error:', error); 
    }
};

export const sendResetEmail = async (email:string) => {
    const apiGetLink = `http://twoeasy3.pythonanywhere.com/api/forgetPassword/${email}`
    try{
        const response = await axios.get(apiGetLink);
        console.log("Debug sendResetEmail attempt: ", response.data);
        return response.data;
    } catch(error){
        console.error('DEBUG sendResetEmail error:', error);
    }
}

export const authEmailToken = async (jwt_token: string) => {
    const apiGetLink = 'http://twoeasy3.pythonanywhere.com/api/authEmailToken';
    try {
        const response = await axios.get(apiGetLink, {
            headers: {
                'Authorization': `Bearer ${jwt_token}`
            }
        });
        console.log('Debug authEmailToken attempt:', response.data);
        return response.data;
    } catch (error) {
        console.error('DEBUG authEmailToken error:', error);
        throw error; 
    }
};
