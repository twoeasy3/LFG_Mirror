import axios from 'axios'; 
import { UserProfileInterface, getUserFromID, updateUser } from './UserProfileLogic';

export interface ratingInterface{
    session: number
    rated_by: number
    rated_user: number
    rating: number
}

export const postRating = async (ratingInterface: ratingInterface) => {
    try{
        const response = await axios.post(`https://tuanisworkingonsomeproject.pythonanywhere.com/api/rating/`, ratingInterface);
        console.log('DEBUG postRating attempt:', response.data);
        return response.data;
    }
    catch(error){
        console.error('DEBUG postRating error:', error);
    }
}

export const getRating = async (session_id: number, rated_by_id: number, rated_user_id: number) => {
    try{
        const response = await axios.get(`https://tuanisworkingonsomeproject.pythonanywhere.com/api/rating/?session_id=${session_id}&rated_by_id=${rated_by_id}&rated_user_id=${rated_user_id}&all=False`);
        console.log('DEBUG getRating attempt:', response.data);
        return response.data;
    }
    catch(error){
        console.error(`DEBUG getRating session: ${session_id} rated by: ${rated_by_id} rated: ${rated_user_id} NOT FOUND`);
    }
}

export async function updateRating(participantId: number, rating: number){
    try{
        const user: UserProfileInterface | undefined = await getUserFromID(participantId);
        if (user){
            user.rating += rating;
            await updateUser(user.username, user);
            console.log("rating for user updated");
        }
    }
    catch (error){
        console.error("update Rating error", error)
    }
}