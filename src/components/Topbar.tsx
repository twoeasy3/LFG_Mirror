
import { FunctionComponent } from 'react';

const Topbar: FunctionComponent = () => {
    return (
        <div className='flex justify-end items-center p-3'>
            <span className='text-white text-2xl font-bold'>Welcome,</span>  
            <a className='underline pl-4 text-white text-2xl font-bold' target='_blank' href={`http://localhost:5173/UserProfile/${localStorage.getItem("username")}`}>{localStorage.getItem("username")}</a>
            <img
            className="object-contain rounded-full ml-2 w-10 h-10 border-4 border-[#2d44f5]"
            src={`https://avatars.steamstatic.com/${localStorage.getItem("avatar_hash")}_full.jpg`}
            alt="Profile Picture"
        />   
        </div>
    );
};

export default Topbar;