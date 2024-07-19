import { W16ConsoleDisplayColors, W16CmdExecContext } from "../consoleEngine";

import { FileSystem } from "../../core/filesystem";

const infoExecFunc = async (args: Array<string>, res: W16CmdExecContext) => {
    
    // Check if there are args
    if(args.length > 0) {
        res.pushResData({data: '"info" cmd does not expect any argument', displayColor: W16ConsoleDisplayColors.ERROR});
        return;
    }

    res.pushResData({
        data: `W16 is an aim training package manager built by Camellia-ESL to simplify some aim trainers functionalities
            please keep in mind that this is a simple program written quickly so doesn't expect anything special. :)\n
        `, 
        displayColor: W16ConsoleDisplayColors.LOG
    });

    res.pushResData({
        data: 'Application path -> ' + await FileSystem.getAppPath(), 
        displayColor: W16ConsoleDisplayColors.GREEN
    });
}

export default infoExecFunc;