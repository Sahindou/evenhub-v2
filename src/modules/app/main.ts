import type { Dependencies } from "../store/dependencies";
import { createStore, type AppStore } from "../store/store";

export class App{
    public dependencies: Dependencies;
    public store: AppStore;

    constructor(){
        this.dependencies = this.setupDependencies();
        this.store = createStore({ dependencies: this.dependencies })
    }

    setupDependencies(): Dependencies {
        return {}
    }
}

export const app = new App();

