import { Link} from "react-router-dom";
import { ChangeEvent, useState } from 'react';
import * as inputValidator from '../bin/inputValidator';
import { sendResetEmail } from "../bin/UserLogin";

interface ForgetPWSentDialogProps {
    dialogVisible: boolean;
    toggleDialog: () => void;
}

const ForgetPWSentDialog: React.FC<ForgetPWSentDialogProps> = ({ dialogVisible, toggleDialog }) => {

    const buildDialog = () => {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-[#151515] rounded-2xl p-8 max-w-md flex flex-col items-center justify-center">
                    <div className="text-white mb-4">
                            If the email address entered belongs to any account, we have sent an email to you.
                            Please check your inbox and follow the instructions to verify your email address.
                    </div>
                    <Link to="/">
                    <button className="bg-[#2D44F5] hover:bg-[#2d44f5be] text-white font-bold py-2 px-4 rounded" onClick={toggleDialog} >Return to Login</button></Link>
                </div>
            </div>
        );
    };

    return dialogVisible ? buildDialog() : null;
}

const ForgetPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [emailValidPrompt, toggleEmailValidPrompt] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);

    const toggleDialog = () => {
        setDialogVisible(!dialogVisible);
    }

    const handleButtonPress= () => {
        if (!inputValidator.verifyEmail(email)){
            toggleEmailValidPrompt(true);
        }
        else{
            // TODO: Check if email address is in database
            setDialogVisible(true);
            sendResetEmail(email);
            toggleDialog();
        }
        
    }

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        toggleEmailValidPrompt(false);
    };



    return (
        <div className="bg-hero bg-cover bg-center">
            <div className="flex flex-col justify-center items-center h-screen">
            <img className="object-contain w-1/5 h-1/5" src="../logo.png"></img>
                <div className="flex flex-col min-w-[480px] p-6 rounded-xl bg-[#181818] items-center">
                    <h2 className="text-white mt-4 mb-6 text-2xl">Forget Password</h2>
                    <div className="w-4/5">
                        <input className="w-full mb-4 px-4 py-2 border-b border-white text-white bg-[#181818] focus: outline-none" value={email} onChange={handleEmailChange} placeholder="Email" />
                        <h4 className="text-[#FF0000] text-sm text-center">{emailValidPrompt ? 'Invalid email format' : ''}</h4>
                    </div>
                    
                    <button className="my-6 w-4/5 bg-[#2D44F5] hover:bg-[#2d44f5be] text-white font-bold py-2 px-8 rounded" onClick={handleButtonPress}>Reset Password</button>
                    <Link className="text-[#797faa] hover:underline text-sm" to="/">Back to Login</Link>
                    <ForgetPWSentDialog dialogVisible={dialogVisible} toggleDialog={toggleDialog} />
                </div>
            </div>
        </div>    
    )
}

export default ForgetPassword;