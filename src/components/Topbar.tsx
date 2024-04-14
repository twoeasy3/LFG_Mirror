
import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const Topbar: FunctionComponent = () => {
    
    const navigate = useNavigate();
    function handleClick(){
        navigate(`/UserProfile/${localStorage.getItem("username")}`)
    }
    return (
        <div className='flex justify-end items-center p-3'>
            <span className='text-white text-2xl font-bold'>Welcome,</span> 
            <button className='underline pl-4 text-white text-2xl font-bold' onClick={handleClick}>{localStorage.getItem("username")}</button>
            <img
            className="object-contain rounded-full ml-2 w-10 h-10 border-4 border-[#2d44f5]"
            src={`https://avatars.steamstatic.com/${localStorage.getItem("avatar_hash")}_full.jpg`}
            alt="Profile Picture"
        />   
        </div>
    );
};

export default Topbar;