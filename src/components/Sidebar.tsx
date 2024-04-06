import Hamburger from "hamburger-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Sidebar({ buttons }: { buttons: string[] }) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const steamID = localStorage.getItem("steamID")
    const username = localStorage.getItem("username")

    const routeMapping: { [key: string]: string } = {
        "Edit Profile": `/UserProfile/EditProfile/${username}`,
        "View All Sessions": "/ViewSessions",
        "View Joined Sessions" : "/ViewJoinedSessions",
        "My Sessions" : "/ViewHostedSessions",
        "My Profile" : `/UserProfile/${username}`,
        "Create Session" : "/CreateSession",
        "View Requests" : "/RequestsPage"
        // Add more mappings if needed
        // E.g ([Button Name] : [Route])
    };

    const handleClick = (item: string) => {
        const route = routeMapping[item]
        navigate(route);
    };

    const handleLogOutClick = () => {
        localStorage.clear(); //Log out code -> Just clear localStorage
        navigate("/");
    }

    return (
        <div>
            {isOpen && 
            <div className="w-[15%] bg-[#101010cb] flex-col justify-between items-center fixed left-0 bottom-0 top-0">
                <div className='flex justify-end'>
                    <div className="pt-2 pr-2">
                        <Hamburger color="#FFFFFF" toggled={isOpen} toggle={setIsOpen}/> 
                    </div>
                    
                </div>
                <div className="flex flex-col items-center mt-8">
                    {buttons.map((item: string, index: number) => (
                        <button key={index} onClick={() => handleClick(item)} className="w-3/5 mb-4 bg-blue-700 hover:bg-blue-900 text-white text-center font-bold py-3 px-6 rounded-2xl flex justify-center">
                            {item}
                        </button>
                    ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="LOGOUT flex justify-center items-center">
                        <button className="w-3/5 mb-10 bg-[#FF0000] hover:bg-[#ff0000c0] text-white font-bold py-2 px-6 rounded-2xl"
                                onClick={handleLogOutClick}>Log Out</button>
                    </div>
                </div>
                
            </div>
            }
            {!isOpen&&
            <div className="w-[5%] bg-[#101010cb] flex justify-center fixed left-0 bottom-0 top-0">
                <Hamburger color="#FFFFFF" toggled={isOpen} toggle={setIsOpen}/>
            </div>
            }
        
        </div>
        

    );
}

export default Sidebar

