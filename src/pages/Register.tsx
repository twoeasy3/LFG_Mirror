import { useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import * as inputValidator from '../bin/inputValidator';
import axios from 'axios';
import { SHA256, enc } from 'crypto-js';

enum EmailErrorMessage {
    format = "Invalid email format",
    duplicate = "Email already in use",
    null = ""
}

enum UsernameErrorMessage{
    format = "Invalid username format",
    duplicate = "Username already in use",
    null = ""
}

enum SteamIDErrorMessage{
    format = "Steam64 ID format must be a 17-digit ID",
    duplicate = "Steam64 ID already in use",
    null = ""
}

function Register(){
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [retypedPassword, setRetypedPassword] = useState('');
    const [steamId, setSteamId] = useState('');

    const [emailValidPrompt, toggleEmailValidPrompt] = useState(false);
    const [usernameValidPrompt, toggleUsernameValidPrompt] = useState(false);
    const [passwordValidPrompt, togglePasswordValidPrompt] = useState(false);
    const [passwordMismatchPrompt, togglePasswordMismatchPrompt] = useState(false);
    const [steamIdValidPrompt, toggleSteamIdValidPrompt] = useState(false);

    const [dialogVisible, setDialogVisible] = useState(false); //steam64 help dialog
    const [registerDialogVisible, setRegisterDialogVisible] = useState(false);

    const [emailErrorMsg, setEmailErrorMsg] = useState<EmailErrorMessage>(EmailErrorMessage.null);
    const [usernameErrorMsg, setUsernameErrorMsg] = useState<UsernameErrorMessage>(UsernameErrorMessage.null);
    const [steamErrorMsg, setSteamErrorMsg] = useState<SteamIDErrorMessage>(SteamIDErrorMessage.null);

    const toggleDialog = () => {
        setDialogVisible(!dialogVisible);
    }
    
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        toggleEmailValidPrompt(false);
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        toggleUsernameValidPrompt(false);
    }

    const checkValidUserName = ()=> {
        if (username === "" || !inputValidator.verifyUsername(username)){
            setUsernameErrorMsg(UsernameErrorMessage.format);
            toggleUsernameValidPrompt(true);
            return false;
        } else {
            return true;
        }
    }

    const checkValidEmail = () => {
        //return true if valid
        if (email === "" || !inputValidator.verifyEmail(email)){
            setEmailErrorMsg(EmailErrorMessage.format);
            toggleEmailValidPrompt(true);
            return false;
        } else {
            return true;
        }
    }
    
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        togglePasswordValidPrompt(false);
    };

    const pwErrorMsg = "Password must be at least 8 characters long and contain at least 1 uppercase letter and 1 numeral."

    const checkValidPassword = () => {
        if (password === "" || !inputValidator.validatePassWord(password)){
            togglePasswordValidPrompt(true);
            return false;
        } else {
            return true;
        }
    }

    const handleRetypedPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRetypedPassword(event.target.value);
        togglePasswordMismatchPrompt(false);
    };

    const checkSamePW = () => {
        if (password !== retypedPassword){
            togglePasswordMismatchPrompt(true);
            return false;
        } else {
            return true;
        }
    }
    
    const pwMismatchMsg = "Passwords do not match"

    const handleSteamIdChange = (e: ChangeEvent<HTMLInputElement>) => { 
        const input = e.target.value;
        // Only update the state if the input is a valid number
        if (/^\d*$/.test(input)) {
            setSteamId(input);
            toggleSteamIdValidPrompt(false);
        }   
    };

    const checkValidSteamID = () => {
        //return true if valid
        if (steamId === "" || !inputValidator.verifySteamID(steamId)){
            setSteamErrorMsg(SteamIDErrorMessage.format);
            toggleSteamIdValidPrompt(true);
            return false;
        }
        else{
            return true
        }
    }

    const handleSignUpClick = () => {
        let a:boolean = checkValidEmail();
        let b:boolean = checkValidSteamID();
        let c:boolean = checkValidPassword();
        let d:boolean = checkSamePW();
        let e: boolean = checkValidUserName();
        if (a && b && c && d && e){
            //Do API call
            handleSignUpAttempt();
        }
    }

    const handleSignUpAttempt = async () => {
        const apiLink = "https://tuanisworkingonsomeproject.pythonanywhere.com/api/user/"
        const text = {
            "username": username,
            "password_hash256":  SHA256(password).toString(enc.Hex),
            "email": email,
            "steamID": steamId
        }
        try {
            const response = await axios.post(apiLink, text);
            console.log("Debug register attempt: ", response);
            console.log(response.status);
            setRegisterDialogVisible(true)
        } catch (error: any) {
            console.log("error during post request");
            console.error('DEBUG register error:', error);
            console.log('Error response status:', error.response.status);
            console.log('Error response data:', error.response.data);
            const text = error.response.data;
            for (const key in text){
                if (key === "username"){
                    setUsernameErrorMsg(UsernameErrorMessage.duplicate);
                    toggleUsernameValidPrompt(true);
                }
                else if (key === "email"){
                    setEmailErrorMsg(EmailErrorMessage.duplicate);
                    toggleEmailValidPrompt(true);
                }
                else if (key === "steamID"){
                    setSteamErrorMsg(SteamIDErrorMessage.duplicate);
                    toggleSteamIdValidPrompt(true);
                }
            }
        }
    }

    return (
        <div className="bg-hero bg-cover bg-center bg-fixed overflow-hidden">
            <div className="flex flex-row items-center h-screen">
                <img className="object-contain h-1/2 w-1/2 " src="../logo.png" alt="Logo" />
                <div className="flex flex-col w-[480px] p-6 rounded-xl bg-[#181818] items-center ">
                    <h2 className="mt-4 text-center mb-8 text-2xl text-white">Create an account</h2>
                    <div className='w-4/5'>
                        <input className="w-full mb-1 px-4 py-2 border-b border-white text-white bg-[#181818] focus: outline-none" 
                                value={email} onChange={handleEmailChange} placeholder="Email" />
                        <h4 className="text-[#FF0000] text-sm text-center">{emailValidPrompt ? emailErrorMsg : ''}</h4>
                    </div>
                    <div className='w-4/5'>
                        <input className="w-full mb-1 px-4 py-2 border-b border-white text-white bg-[#181818] focus: outline-none" 
                                value={username} onChange={handleUsernameChange} placeholder="Username" />
                        <h4 className="text-[#FF0000] text-sm text-center">{usernameValidPrompt ? usernameErrorMsg : ''}</h4>
                    </div>
                    <div className="w-4/5">
                        <input className="w-full mb-1 px-4 py-2 border-b border-white text-white bg-[#181818] focus: outline-none" 
                                type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
                        <h4 className="text-[#FF0000] text-sm text-center">{passwordValidPrompt ? pwErrorMsg : ''}</h4>
                    </div>
                    <div className="w-4/5">
                        <input className="w-full mb-1 px-4 py-2 border-b border-white text-white bg-[#181818] focus: outline-none" 
                                type="password" value={retypedPassword} onChange={handleRetypedPassword} placeholder="Retype Password" />
                        <h4 className="text-[#FF0000] text-sm text-center">{passwordMismatchPrompt ? pwMismatchMsg : ''}</h4>
                    </div>
                    <div className="w-4/5">
                        <input className="w-full mb-1 px-4 py-2 border-b border-white text-white bg-[#181818] focus: outline-none"  
                                value={steamId} onChange={handleSteamIdChange} placeholder="Steam64 ID" />
                        <h4 className="text-[#FF0000] text-sm text-center">{steamIdValidPrompt ? steamErrorMsg : ''}</h4>
                    </div>
                    <button className="text-[#797faa] hover:underline text-sm text-left mt-4" 
                            onClick={toggleDialog}>How do I find my Steam64 ID? </button>
                    <button className="mt-6 w-4/5 bg-[#2D44F5] hover:bg-[#2d44f5be] text-white font-bold py-2 px-8 rounded" 
                            onClick={handleSignUpClick}>Sign up</button>     
                    <div className="mt-6 text-center text-sm">
                        <span className="text-white">Already have an account? </span>
                        <Link to="/" className="text-[#797faa] hover:underline">Login</Link>
                    </div>
                    <FindSteam64Dialog dialogVisible={dialogVisible} toggleDialog={toggleDialog} />
                    <SignUpSuccessfulDialog dialogVisible={registerDialogVisible} />
                </div>
            </div>    
        </div>
    )
}

export default Register

interface FindSteam64DialogProps {
    dialogVisible: boolean;
    toggleDialog: () => void;
}

const FindSteam64Dialog: React.FC<FindSteam64DialogProps> = ({ dialogVisible, toggleDialog }) => {

    const buildDialog = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-[#151515] rounded-2xl p-8 max-w-md flex flex-col items-center justify-center">
                    <div className="text-white mb-4 text-center">
                        Navigate to <a className="underline" href="https://steamid.io/" target='_blank'>https://steamid.io</a> and paste in your Steam profile link.
                        Copy the steamID64 for this field. Make sure your Steam profile is public.
                    </div>
                    <button className="bg-[#2D44F5] hover:bg-[#2d44f5be] text-white font-bold py-2 px-4 rounded" onClick={toggleDialog} >Confirm</button>
                </div>
            </div>
        );
    };

    return dialogVisible ? buildDialog() : null;
}

interface ValidRegisterProps {
    dialogVisible: boolean;
}

const SignUpSuccessfulDialog: React.FC<ValidRegisterProps> = ({ dialogVisible }) => {
    const registerDialog = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-[#151515] bg-opacity-50">
                <div className="bg-[#151515] rounded-3xl p-8 max-w-md flex flex-col items-center justify-center">
                    <div className="text-white mb-4">
                        Account Created Successfully
                    </div>
                    <Link to="/">
                        <button className="bg-[#2D44F5] hover:bg-[#2d44f5be] text-white font-bold py-2 px-4 rounded">To Login</button>
                    </Link>
                </div>
            </div>
        )
    }

    return (dialogVisible) ? registerDialog() : null;
}

