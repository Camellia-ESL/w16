import { W16ConsoleDisplayColors, W16CmdExecContext } from "../consoleEngine";

import { User } from "../../core/user";

const setkvkpathExecFunc = async (args: Array<string>, res: W16CmdExecContext) => {
    
    // Check if there are args
    if(args.length <= 0 || args[0].length <= 0) {
        res.pushResData({
            data: `setkvkpath cmd does expect 1 argument (the path to the kovaak folder where 
            you installed the game ex. setkvkpath C:\\Program Files (x86)\\Steam\\steamapps\\common\\FPSAimTrainer)
            `, 
            displayColor: W16ConsoleDisplayColors.ERROR
        });
        return;
    }

    // Save the user settings
    User.settings.kovaakLocalPath = args[0];

    res.pushResData({
        data: `
        Path saved in current settings.
        Kovaak Path -> ${args[0]}
        `, 
        displayColor: W16ConsoleDisplayColors.LOG
    });

    res.pushResData({
        data: `PLEASE run the svst cmd to save all the current settings in the local file or you will lose them!`, 
        displayColor: W16ConsoleDisplayColors.WARN
    });
}

export default setkvkpathExecFunc;