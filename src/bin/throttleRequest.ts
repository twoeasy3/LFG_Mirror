import axios from 'axios';

export const validRequest = async (sender:string, target:string): Promise<boolean> => {
    /*
    Assuming this format:
    {
        'sender': 'adam_cole'
        'target': 'matthew'
        'lastSent': <DATETIME>
    }
    Assume DATETIME is 0 if user's first time sending request
    */
    const apiGetLink = `https://tuanisworkingonsomeproject.pythonanywhere.com/api/requests/?all=False&sender=${sender}&target=${target}`;
    try {
        const response = await axios.get(apiGetLink);
        let timeElapsed = new Date().getTime() - new Date(response.data.lastSent).getTime();
        if (timeElapsed > 3600000) { // 1 hour
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('DEBUG invalid Request:', error);
        return false;
    }
}