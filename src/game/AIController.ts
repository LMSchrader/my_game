import { type Character, Team } from "./types/character.ts";
import { getValidMovementTiles } from "./movementSystem.ts";
import { Game } from "./Game.ts";
import { type GridBoundsChecker } from "./types/ai.ts";
import { logger } from "../utils/logger.ts";

export class AIController {
  private readonly gameState: Game;
  private readonly gridBoundsChecker: GridBoundsChecker;
  private readonly aiDelayMs: number;

  constructor(
    gameState: Game,
    gridBoundsChecker: GridBoundsChecker,
    aiDelayMs: number = 100,
  ) {
    this.gameState = gameState;
    this.gridBoundsChecker = gridBoundsChecker;
    this.aiDelayMs = aiDelayMs;
    this.gameState.turnManager.on("turnStart", (character: unknown) =>
      this.handleTurnStart(character as Character),
    );
    logger.debug("AIController initialized with TurnManager");
  }

  private async handleTurnStart(character: Character): Promise<void> {
    if (character.team !== Team.TeamB) {
      return;
    }
    try {
      logger.debug(`AI taking turn for ${character.name}`);
      await this.executeAITurn(character);
    } catch (error) {
      logger.error(error, `Error during AI turn for ${character.name}`);
      this.gameState.turnManager.endTurn();
    }
  }

  private async executeAITurn(character: Character): Promise<void> {
    const allCharacters = this.gameState.getAllCharacters();
    const validTiles = getValidMovementTiles(
      character.hexPosition,
      character.movementPoints,
      allCharacters,
      this.gridBoundsChecker,
    );

    await this.delay(this.aiDelayMs);

    if (validTiles.length === 0) {
      logger.debug(`${character.name} has no valid tiles, ending turn`);
      this.gameState.turnManager.endTurn();
      return;
    }

    const randomTile =
      validTiles[Math.floor(Math.random() * validTiles.length)];
    logger.debug(
      `AI moving ${character.name} from (${character.hexPosition.q}, ${character.hexPosition.r}) to (${randomTile.q}, ${randomTile.r})`,
    );
    character.move(randomTile);

    await this.delay(this.aiDelayMs);
    this.gameState.turnManager.endTurn();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
