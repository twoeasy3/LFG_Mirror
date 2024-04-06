export interface GameData{
    appID: number;
    name: string;
    gameBanner: string;
}

export async function getOwnedGames(steamID: string): Promise<any> {
    const proxyLink: string = `https://twoeasy3.pythonanywhere.com/api/getSteamGames/${steamID}`;

    try {
        const response = await fetch(proxyLink);

        if (!response.ok) {
            throw new Error('Network response was not ok. Is the server running?');
        }

        const jsonData: any = await response.json();
        if (jsonData) {
            
            return jsonData; // Return the session info
        } else {
            throw new Error('No response, is the server running or is the user profile private?');
        }
    } catch (error) {
        console.error('The fetch operation did not return an expected response:', error);
        return "#FetchError"; // Return the error message
    }
}

export async function buildOwnedGames(steamID: string): Promise<GameData[]> {
    try {
        const games: any[] = await getOwnedGames(steamID);
        console.log("Fetched games:", games); 

        const gameDataArray: GameData[] = [];

        for (const game of games) {

            const gameData: GameData = {
                appID: game.appid,
                name: game.name,
                gameBanner: `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/capsule_231x87.jpg`
            };
            gameDataArray.push(gameData);
        }

        gameDataArray.sort((a, b) => {
            // Convert both names to lowercase to perform case-insensitive sorting
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });
        
        console.log("Mapped gameDataArray:", gameDataArray); 
        return gameDataArray;
    } catch (error) {
        console.error('Error fetching game data:', error);
        throw error;
    }
}

export function checkIfOwnGame(ownedGames:GameData[], game: number):boolean{
    for (const currentGame of ownedGames){
        if (currentGame.appID == game){
            return(true)
        }
        } return(false)
    }