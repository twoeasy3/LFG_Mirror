import { Link } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { getUser, userLogin } from '../bin/UserLogin';
import { useNavigate } from "react-router-dom"
import { buildOwnedGames } from '../bin/GetOwnedGames';
import { useAppName } from '../components/AppNameProvider';
import { TailSpin } from 'react-loader-spinner';
import { fetchAvatar } from '../bin/UserProfileLogic';

enum LoginMessage {
    SteamPrivate =  "Steam account must be public.",
    Invalid = "Wrong username or password entered."
};

function Login(){
    const [errorMsg, setErrorMsg] = useState<LoginMessage>(LoginMessage.Invalid);
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[isLoading, setIsLoading] = useState(false);
    const[showWrongPassMessage, toggleWrongPassMessage] = useState(false);
    const navigate = useNavigate();

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        toggleWrongPassMessage(false);
    };
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        toggleWrongPassMessage(false);
        setErrorMsg(LoginMessage.Invalid);
    };
    //this part is so that you can press enter and login, you're welcome ;) -yx
    const handleKeyDownPassword = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter'){
            handleLoginAttempt()
        }
    }

    const handleLoginAttempt = () => {
        setIsLoading(true);
        userLogin(username,password)
        .then(data => {
            try{
                if(data.access_token !== undefined){ //TODO: Do we have to check if this is the real token? -yx
                console.log('Login success');}
                localStorage.setItem("username", username);  
                getUser(username)
                .then(data => {
                    try{
                        if(data.steamID !== undefined){ 
                            console.log('SteamID get success');
                            localStorage.setItem("steamID", data.steamID);
                            localStorage.setItem("userID", data.id)    
                            localStorage.setItem("avatar_hash", data.avatar_hash); 
                            console.log("avatar hash login: ", data.avatar_hash)
                            
                            

                            /////I'm sorry for this nested try block but this is how it has to be
                            //otherwise this part of the code runs ahead of the steamID get
                            buildOwnedGames(localStorage.getItem("steamID")!) 
                            .then(data => {
                                try{ 
                                    if(data.length !== 0){
                                        console.log('Get Owned Games success');
                                        localStorage.setItem("ownedGames", JSON.stringify(data));  
                                        navigate("/viewSessions"); //SLIGHT delay in login now but the rest of the code has to run before it navigates away :(                      
                                    }
                                } catch(error){
                                    console.error('DEBUG --- getGames localStorage process error', error);
                                }
                            })
                            .catch(error => {
                                console.error('DEBUG --- getGames localStorage process error', error);
                                localStorage.clear();
                                setIsLoading(false);
                                setErrorMsg(LoginMessage.SteamPrivate);
                                toggleWrongPassMessage(true);
                            }); 
                            //end of sorry try block                      
                        }
                    } catch(error){
                        console.error('DEBUG --- getUser steamID localStorage process error', error);
                    }
                })
                .catch(error => {
                    console.error('DEBUG --- LgetUser steamID localStorage process error', error);
                }); 

            } catch(error){
                toggleWrongPassMessage(true);
                setIsLoading(false);
            }
        })
        .catch(error => {
            console.error('DEBUG --- LOGIN process error', error);
        });
  

    }

    return (
        <div className="bg-hero bg-cover bg-center">
            <div className="flex flex-col justify-center items-center h-screen">
                <img className="object-contain w-1/5 h-1/5" src="../logo.png"></img>
                <div className="flex flex-col justify-center items-center min-w-[480px] p-6 bg-[#181818] rounded-xl">
                    <h2 className='text-white mt-4 mb-6 text-2xl'>Login</h2>
                    <input className="w-4/5 mb-8 px-4 py-2 border-b border-white text-white bg-[#181818] focus: outline-none" placeholder='Username' value={username} onChange={handleEmailChange}/>
                    <input className="w-4/5 mb-6 px-4 py-2 border-b border-white text-white bg-[#181818] focus: outline-none" type='password' placeholder='Password' value={password} onChange={handlePasswordChange} onKeyDown={handleKeyDownPassword}/>
                    <h4 className="text-[#FF0000] w-4/5 text-center">{showWrongPassMessage ? errorMsg : ''}</h4>
                    <div className='w-4/5 my-6 relative'>
                        <button className={`w-full bg-[#2D44F5] hover:bg-[#2d44f5be] font-bold py-2 px-8 rounded ${isLoading? "text-[#2d44f5be]" : "text-white"}`} onClick={handleLoginAttempt}>Sign in</button>
                        {isLoading && (
                            <div className='bg-[#2d44f5be] rounded absolute inset-0 flex items-center justify-center w-full h-full'>
                                <TailSpin color="#FFFFFF" width="25" height="25"/>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-row justify-between w-4/5 text-sm">
                        <Link className="text-[#797faa] hover:underline" to="/Register">Sign up</Link>
                        <Link  className="text-[#797faa] hover:underline" to="/ForgetPassword">Forget Password</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

