// LCR.ts

// Define player interface
export interface Player {
    Name: string;
    Chips: number;
    LobbyStatus: boolean;
    UserID: string;
  }
  
  // Define game interface
  export interface Game {
    Pot: number;
    Players: Player[];
    Turn: number;
    Dice: Dice;
    // Optional Winner property
    Winner?: Player["Name"];
    LobbyCode: string;
  }

  export interface Dice {
    Sides: number;
    Rolls: number[];
  }
  
  // Define any other LCR-related interfaces here
  