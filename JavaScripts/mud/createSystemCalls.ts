/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */

import { Has, HasValue, getComponentValue, runQuery } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { uuid } from "@latticexyz/utils";
import { MonsterCatchResult } from "../TerrainType";


export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  /*
   * The parameter list informs TypeScript that:
   *
   * - The first parameter is expected to be a
   *   SetupNetworkResult, as defined in setupNetwork.ts
   *
   * - Out of this parameter, we only care about two fields:
   *   - worldContract (which comes from createContract, see
   *     https://github.com/latticexyz/mud/blob/26dabb34321eedff7a43f3fcb46da4f3f5ba3708/templates/vanilla/packages/client/src/mud/setupNetwork.ts#L31).
   *   - waitForTransaction (which comes from syncToRecs, see
   *     https://github.com/latticexyz/mud/blob/26dabb34321eedff7a43f3fcb46da4f3f5ba3708/templates/vanilla/packages/client/src/mud/setupNetwork.ts#L39).
   *
   * - From the second parameter, which is a ClientComponent,
   *   we only care about Counter. This parameter comes to use
   *   through createClientComponents.ts, but it originates in
   *   syncToRecs 
(https://github.com/latticexyz/mud/blob/26dabb34321eedff7a43f3fcb46da4f3f5ba3708/templates/vanilla/packages/client/src/mud/setupNetwork.ts#L39).
   */
  { worldContract, waitForTransaction, playerEntity }: SetupNetworkResult,
  { Encounter, Obstruction, MapConfig, Position, Player, MonsterCatchAttempt }: ClientComponents
) {

  const wrapPosition = (x: number, y: number) => {
    const mapConfig = getComponentValue(MapConfig, singletonEntity);
    if (!mapConfig) {
      throw new Error("mapConfig no yet loaded or initialized");
    }
    return [
      (x + mapConfig.width) % mapConfig.width,
      (y + mapConfig.height) % mapConfig.height,
    ];
  };

  const isObstructed = (x: number, y: number) => {
    return runQuery([Has(Obstruction), HasValue(Position, { x, y })]).size > 0;
  };

  const spawn = async (inputX: number, inputY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const canSpawn = getComponentValue(Player, playerEntity)?.value !== true;
    if (!canSpawn) {
      throw new Error("already spawned");
    }

    const [x, y] = wrapPosition(inputX, inputY);
    if (isObstructed(x, y)) {
      console.warn("cannot spawn on obstructed space");
      return;
    }

    const positionId = uuid();
    Position.addOverride(positionId, {
      entity: playerEntity,
      value: { x, y },
    });
    const playerId = uuid();
    Player.addOverride(playerId, {
      entity: playerEntity,
      value: { value: true },
    });

    try {
      const tx = await worldContract.write.spawn([x, y])
      await waitForTransaction(tx);
    } finally {
      Position.removeOverride(positionId);
      Player.removeOverride(playerId);
    }
  };

  const moveTo = async (inputX: number, inputY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const inEncounter = !!getComponentValue(Encounter, playerEntity);
    if (inEncounter) {
      console.warn("cannot move while in encounter");
      return;
    }

    const [x, y] = wrapPosition(inputX, inputY);
    if (isObstructed(x, y)) {
      console.warn("cannot move to obstructed space");
      return;
    }

    const positionId = uuid();
    Position.addOverride(positionId, {
      entity: playerEntity,
      value: { x, y },
    });

    try {
      const tx = await worldContract.write.move([x, y]);
      await waitForTransaction(tx);
    } finally {
      Position.removeOverride(positionId);
    }
  };

  const moveBy = async (deltaX: number, deltaY: number) => {
    if (!playerEntity) {
      throw new Error("no player");
    }

    const playerPosition = getComponentValue(Position, playerEntity);
    if (!playerPosition) {
      console.warn("cannot moveBy without a player position, not yet spawned?");
      return;
    }

    await moveTo(playerPosition.x + deltaX, playerPosition.y + deltaY);
  };



  const throwBall = async () => {
    const player = playerEntity;
    if (!player) {
      throw new Error("no player");
    }

    const encounter = getComponentValue(Encounter, player);
    if (!encounter) {
      throw new Error("no encounter");
    }

    const tx = await worldContract.write.throwBall([]);
    await waitForTransaction(tx);



    const catchAttempt = getComponentValue(MonsterCatchAttempt, player);
    if (!catchAttempt) {
      throw new Error("no catch attempt found");
    }

    return catchAttempt.result as MonsterCatchResult;
  };

  const fleeEncounter = async () => {
    const tx = await worldContract.write.flee([]);
    await waitForTransaction(tx);
  };

  return {
    spawn,
    moveTo,
    moveBy,
    fleeEncounter,
    throwBall
  };
}
