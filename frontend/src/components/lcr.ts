// LCR.ts

// Define player interface
export interface Player {
    Name: string;
    Chips: number;
    LobbyStatus?: boolean;
    UserID?: string;
  }
  
  // Define game interface
  export interface Game {
    Pot: number;
    Players: Player[];
    Turn: number;
    Dice: Dice;
    // Optional Winner property
    Winner?: Winner;
    LobbyCode: string;
  }

  export interface Dice {
    Sides: number;
    Rolls: number[];
  }

  export interface Winner {
    Name: string;
    Chips: number;
    LobbyStatus: boolean;
    UserID: string;
  }


  
