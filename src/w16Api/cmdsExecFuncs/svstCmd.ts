import { W16ConsoleDisplayColors, W16CmdExecContext } from "../consoleEngine";

import { User } from "../../core/user";

const svstExecFunc = async (args: Array<string>, res: W16CmdExecContext) => {
    
    // Check if there are args
    if(args.length > 0) {
        res.pushResData({data: 'svst cmd does not expect any argument', displayColor: W16ConsoleDisplayColors.ERROR});
        return;
    }

    // Save the user settings
    await User.saveUserSettings();

    res.pushResData({
        data: `User settings saved!`, 
        displayColor: W16ConsoleDisplayColors.LOG
    });
}

export default svstExecFunc;