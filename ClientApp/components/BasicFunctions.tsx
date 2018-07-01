export class Team {
    name: string;
    points: number;
    constructor(theName: string, thePoints: number) {
        this.name = theName;
        this.points = thePoints;
    }
}

export interface AttributeHandler {
    displayBool: boolean;
    alertString: string;
    displayAlert: boolean;
    alertColour: any;
    teamPostName: string;
    playerPostName: string;
    playerSelectionName: string;
    teamSelectionName: string;
    playerList: string[];
    teamList: string[];
    ladder: Team[];
    timestamp: number;
    team1: string;
    team2: string;
    goals1: number;
    goals2: number;
}
    
