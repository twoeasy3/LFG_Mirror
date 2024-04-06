export function verifyEmail(email:string){
///TODO: CHECK IF EMAIL EXISTS IN DATABASE HERE
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  {
    return true;
  }
    return false;

}

export function validatePassWord(password:string){
    if(password.length <= 8){
        return false; 
    }
    if(/[A-Z]/.test(password) == false){
        return false;
    }
    if(/[0-9]/.test(password) == false){
        return false;
    }
    return true;
}

export function verifySteamID(id: string): boolean {
    return id.length === 17;
}
