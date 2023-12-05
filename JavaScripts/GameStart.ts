import { Entity, getComponentValue } from "@latticexyz/recs";
import { moveToLocation } from "./utils";
import { SetupNetworkResult } from "./mud/setupNetwork";
import { ClientComponents } from "./mud/createClientComponents";
import { SystemCalls } from "./mud/createSystemCalls";
import { setup } from "./mud/setup";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { hexToArray } from "@latticexyz/utils";
import { MonsterType, TerrainType } from "./TerrainType";
import { EncounterUI } from "./ui/EncounterUI";
import { MudModule } from "./mud";


@Component
export default class GameStart extends Script {


    mapSize: number = 200;

    // mud component
    network: SetupNetworkResult;
    components: ClientComponents;
    systemCalls: SystemCalls;


    // game logic
    mapLoaded: boolean;
    monsterObj: GameObject;
    inEncounter: boolean;

    /**  */
    protected onStart(): void {
        this.useUpdate = true;


        this.setUpMud().then(() => { this.onStartImpl() })
    }

    /**
     *  
     * this.useUpdatetrue
     * @param dt  / 
     */
    protected onUpdate(dt: number): void {

        this.initMap();
        this.syncLocOnChain();

        this.handleEncounter();

    }

    /**  */
    protected onDestroy(): void {

    }


    onStartImpl() {
        const { moveTo } = this.systemCalls;
        const { Position } = this.components;
        const { playerEntity } = this.network;


        console.log("load script successfully")
        const myself = Player.localPlayer;

        // binds key to make movement
        InputUtil.onKeyDown(Keys.W, () => {
            const newLocation = moveToLocation(myself, new Vector(this.mapSize, 0, 0))
            moveTo(newLocation.x / this.mapSize, newLocation.y / this.mapSize)
        })

        InputUtil.onKeyDown(Keys.S, () => {
            const newLocation = moveToLocation(myself, new Vector(-this.mapSize, 0, 0))
            moveTo(newLocation.x / this.mapSize, newLocation.y / this.mapSize)

        })

        InputUtil.onKeyDown(Keys.A, () => {
            const newLocation = moveToLocation(myself, new Vector(0, -this.mapSize, 0))
            moveTo(newLocation.x / this.mapSize, newLocation.y / this.mapSize)


        })
        InputUtil.onKeyDown(Keys.D, () => {
            const newLocation = moveToLocation(myself, new Vector(0, this.mapSize, 0))
            moveTo(newLocation.x / this.mapSize, newLocation.y / this.mapSize)
        })



    }


    async setUpMud() {
        const { network, components, systemCalls } = await setup();

        this.network = network;
        this.components = components;
        this.systemCalls = systemCalls;

        new MudModule({ network, components, systemCalls });

        console.log("setup successfully")
    }


    initSpawn() {
        const { spawn } = this.systemCalls;
        const { playerEntity } = this.network;
        const { Position } = this.components;

        const playerPos = getComponentValue(Position, playerEntity)

        if (!playerPos) {
            spawn(0, 0);
        }
    }


    initMap() {

        if (this.mapLoaded) {
            return;
        }

        const { MapConfig } = this.components
        const { components: { SyncProgress } } = this.network;

        const value = getComponentValue(SyncProgress, singletonEntity);

        const mapConfig = getComponentValue(MapConfig, singletonEntity);

        if (mapConfig === undefined) {
            console.log("map not loaded");
            return;
        }




        const { width, height, terrain: terrainData } = mapConfig;
        const terrain = Array.from(hexToArray(terrainData)).map((value, index) => {
            return {
                x: index % width,
                y: Math.floor(index / width),
                value,
            };
        });


        terrain.forEach(({ x, y, value }) => {

            if (value === TerrainType.TallGrass) {
                const obj = GameObject.spawn<GameObject>("4FAB698A401B5475DBF892856D0EF5F5")
                obj.worldTransform.position = new Vector(x * this.mapSize, y * this.mapSize, 0);

            } else if (value === TerrainType.Boulder) {

                const obj = GameObject.spawn<GameObject>("EB9C04CC4C77C91F4425CDB6D1690C43",)
                obj.worldTransform.position = new Vector(x * this.mapSize, y * this.mapSize, 0);

            } else {
            }

        })

        // finish map loading
        this.mapLoaded = true;

        this.initSpawn();

    }


    syncLocOnChain() {
        const { Position } = this.components;
        const { playerEntity } = this.network;

        const position = getComponentValue(Position, playerEntity);

        if (!position) {
            return;
        }

        const myself = Player.localPlayer;

        myself.character.localTransform.position = new Vector(position.x * this.mapSize, position.y * this.mapSize, myself.character.localTransform.position.z)

    }

    handleEncounter() {
        const { Position, Encounter, Monster } = this.components;
        const { playerEntity } = this.network;

        const eValue = getComponentValue(Encounter, playerEntity);
        const playerPosition = getComponentValue(Position, playerEntity);


        if (eValue?.exists && eValue.monster) {
            UIService.show(EncounterUI);

            if (this.inEncounter) {
                return;
            }
            this.inEncounter = true;
            // spawn monster
            if (!this.monsterObj) {
                const monsterType = getComponentValue(Monster, eValue?.monster as Entity).value;

                if (monsterType === MonsterType.Cat) {
                    this.monsterObj = Character.spawn("1090246B41F9EF171FB55E9C7811B7C3")
                } else if (monsterType === MonsterType.Dog) {
                    this.monsterObj = GameObject.spawn("A0F9D4F34922AFC9A241CB9B55C150CC")
                } else if (monsterType === MonsterType.Pig) {
                    this.monsterObj = GameObject.spawn("CD010E5C42715C457D51CFAB3C22E122")
                }

                this.monsterObj.localTransform.position = new Vector(playerPosition.x * this.mapSize, (playerPosition.y - 1) * this.mapSize, 0)


                // play animation
                // AssetUtil.asyncDownloadAsset("221659") 

                // this.monsterObj as 

                // let the obj face to hero

                // this.monsterObj.localTransform.rotation = new Rotation();
            }


        } else {

            // hide ui and destroy the game object if exists after 2s
            setTimeout(() => {
                UIService.hide(EncounterUI);

            }, 500)
            if (this.monsterObj) {
                this.monsterObj.destroy();
                this.monsterObj = undefined;
            }
            this.inEncounter = false;


        }

    }
}