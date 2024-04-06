import { Link, useParams  } from "react-router-dom";
import { ChangeEvent, useState, useEffect } from 'react';
import * as inputValidator from '../bin/inputValidator';
import { authEmailToken, changePassword } from "../bin/UserLogin";
import { getUserFromEmail, UserProfileInterface } from "../bin/UserProfileLogic";



const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState("");
    const [retypedPassword, setRetypedPassword] = useState("");
    const [passwordValidPrompt, togglePasswordValidPrompt] = useState(false);
    const [passwordMismatchPrompt, togglePasswordMismatchPrompt] = useState(false);
    const [user, setUser] = useState<UserProfileInterface|undefined>(undefined);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [tokenExpire, setTokenExpire] = useState(false);
    const emailToken = useParams().emailToken
    if (!emailToken) {
        return(
            <div>
                no email token
            </div>
        )
        
    } else {
        useEffect(() => {
            const fetchData = async () => {
                try {
                    if (emailToken) {
                        const { email } = await authEmailToken(emailToken);
                        const userData = await getUserFromEmail(email);
                        setUser(userData);
                    } 
                } catch (error) {
                    console.error('Error:', error);
                    setTokenExpire(true);
                }
            };
    
            fetchData();
        }, [emailToken]);
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

    const handleResetClick = () => {
        if(!tokenExpire){
            let a:boolean = checkValidPassword();
            let b:boolean = checkSamePW();
            if (a && b && user!== undefined){
                try{
                    changePassword(user.username,retypedPassword);
                    setDialogVisible(true);
                }
                catch (error){
                    console.log("token expired");
                    setTokenExpire(true);
                }
            }
        }
    }

    return (
        <div className="bg-hero bg-cover bg-center bg-fixed overflow-hidden">
            <div className="flex flex-row items-center h-screen">
                <img className="object-contain h-1/2 w-1/2 " src="../logo.png" alt="Logo" />
                <div className="flex flex-col w-[480px] p-6 rounded-xl bg-[#181818] items-center">
                    <h2 className="mt-4 text-center mb-8 text-2xl text-white">Reset Password</h2>
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
                    {tokenExpire && <h2 className="text-[#FF0000] text-lg text center mt-4">Token Expired</h2>}
                    <button className="my-6 w-4/5 bg-[#2D44F5] hover:bg-[#2d44f5be] text-white font-bold py-2 px-8 rounded" 
                            onClick={handleResetClick}>Reset Password</button>
                        
                </div>
            </div>
            {dialogVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-[#151515] rounded-2xl p-8 max-w-md flex flex-col items-center justify-center">
                        <div className="text-white mb-4">
                            Password Changed.
                        </div>
                    <Link to="/">
                    <button className="bg-[#2D44F5] hover:bg-[#2d44f5be] text-white font-bold py-2 px-4 rounded">Return to Login</button></Link>
                </div>
            </div>
            )}    
        </div>
    )
}

export default ResetPassword;