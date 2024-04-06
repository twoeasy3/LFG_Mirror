import React, { createContext, useContext, useEffect, useState } from 'react';
import appNameJson from "../assets/all_games.json"

export interface AppName{
    [appid: number]: string
}

export interface AllGamesJson{
    applist:any
}

const appNameJsonTyped : any = appNameJson //This is only to dismiss the typeError -yx
const AppNameDictionaryContext = createContext<AppName>({});

export function useAppName(){
    return useContext(AppNameDictionaryContext);
}

interface AppNameProviderProps{
    children?: React.ReactNode;
}

export const AppNameProvider: React.FC<AppNameProviderProps> = ({children}) => {
    const [appNameDictionary, setAppNameDictionary] = useState<AppName>({});

    useEffect(() => {
        const loadAppNames = () => {
            try{
                console.log("Loading")           

                const appNameDictionary : AppName = {}

                for (const app of appNameJsonTyped.applist.apps) {
                    const {appid, name} = app
                    appNameDictionary[appid] = name;
                }
            setAppNameDictionary(appNameDictionary);
            } catch (error) {
                console.error("Error loading global app name info", error);
            }
        };
        loadAppNames(); 
    }, []);
    return(
        <AppNameDictionaryContext.Provider value ={appNameDictionary}>
            {children}
        </AppNameDictionaryContext.Provider>
    );
};

