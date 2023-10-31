import { ClientComponents } from "./createClientComponents";
import { SystemCalls } from "./createSystemCalls";
import { setup } from "./setup";
import { SetupNetworkResult } from "./setupNetwork";

export interface MUDContext {
    network: SetupNetworkResult;
    components: ClientComponents;
    systemCalls: SystemCalls;
}

// singleton
export class MudModule {

    private static instance;

    public network: SetupNetworkResult;
    public components: ClientComponents;
    public systemCalls: SystemCalls;

    constructor({ network, components, systemCalls }: MUDContext) {
        if (MudModule.instance) {
            return MudModule.instance;
        }

        MudModule.instance = this;


        this.network = network;
        this.components = components;
        this.systemCalls = systemCalls;



        return this;
    }

    static getInstance() {
        while (!MudModule.instance) {

        }
        return MudModule.instance;
    }

}