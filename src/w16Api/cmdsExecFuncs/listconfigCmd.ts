import { User } from "../../core/user";
import { W16ConsoleDisplayColors, W16CmdExecContext } from "../consoleEngine";

const listconfigExecFunc = async (args: Array<string>, res: W16CmdExecContext) => {
    
    // Check if there are args
    if(args.length > 0 ) {
        res.pushResData({
            data: `"help" cmd doesn't expect any argument`, 
            displayColor: W16ConsoleDisplayColors.ERROR
        });
        return;
    }

    // Adds a empty line
    res.pushResData({data: ``, displayColor: W16ConsoleDisplayColors.LOG});

    // Display all the available cmds
    for (const [key, value] of User.settings) {
        res.pushResData({
            data: `[${key}] -> ${value}`, 
            displayColor: W16ConsoleDisplayColors.LOG
        });
    }
}

export default listconfigExecFunc;