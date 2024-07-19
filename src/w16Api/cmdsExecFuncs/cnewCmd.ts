import { W16ConsoleDisplayColors, W16CmdExecContext } from "../consoleEngine";

import { SpawnConsoleWindow } from "../../windows/ConsoleWindow";

const cnewExecFunc = async (args: Array<string>, res: W16CmdExecContext) => {
    
    // Check if there are args
    if(args.length > 0) {
        res.pushResData({data: 'cnew cmd does not expect any argument', displayColor: W16ConsoleDisplayColors.ERROR});
        return;
    }

    // Create's the console context
    SpawnConsoleWindow();

    res.pushResData({
        data: `Instanced a new isolated console...`, 
        displayColor: W16ConsoleDisplayColors.LOG
    });
}

export default cnewExecFunc;