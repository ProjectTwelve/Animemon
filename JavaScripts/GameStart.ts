import { moveToLocation } from "./utils";



@Component
export default class GameStart extends Script {

    /**  */
    protected onStart(): void {
        this.useUpdate = true;

        if (SystemUtil.isClient()) {
            console.log("load script successfully")
            const myself = Player.localPlayer;

            // binds key to make movement
            InputUtil.onKeyDown(Keys.W, () => {
                moveToLocation(myself, new Vector(100, 0, 0))
            })

            InputUtil.onKeyDown(Keys.S, () => {
                moveToLocation(myself, new Vector(-100, 0, 0))
            })

            InputUtil.onKeyDown(Keys.A, () => {
                moveToLocation(myself, new Vector(0, -100, 0))

            })
            InputUtil.onKeyDown(Keys.D, () => {
                moveToLocation(myself, new Vector(0, 100, 0))

            })



        }

        // add move

    }

    /**
     *  
     * this.useUpdatetrue
     * @param dt  / 
     */
    protected onUpdate(dt: number): void {

    }

    /**  */
    protected onDestroy(): void {

    }
}