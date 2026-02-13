import { CharacterModel } from "../game/CharacterModel.ts";
import { Team } from "../game/types/character.ts";

export async function loadCharacters(): Promise<CharacterModel[]> {
  try {
    const response = await fetch("/characters.json");
    const data = await response.json();
    return data.map(
      (charData: {
        id: string;
        name: string;
        team: "TeamA" | "TeamB";
        speed?: number;
        maxMovementPoints?: number;
        spritePath: string;
      }) =>
        new CharacterModel({
          ...charData,
          team: charData.team === "TeamA" ? Team.TeamA : Team.TeamB,
        }),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Error loading characters: ${message}`);
  }
}
