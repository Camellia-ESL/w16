import { gCmdsApi } from "../consoleCmds";
import { W16ConsoleDisplayColors, W16CmdExecContext } from "../consoleEngine";

const helpExecFunc = async (args: Array<string>, res: W16CmdExecContext) => {

    // Check if there are args
    if (args.length > 0) {
        res.pushResData({
            data: `"help" cmd doesn't expect any argument`,
            displayColor: W16ConsoleDisplayColors.ERROR
        });
        return;
    }

    // Adds a empty line
    res.pushResData({ data: ``, displayColor: W16ConsoleDisplayColors.LOG });

    // Display all the available cmds
    for (const [cmdName, cmdObj] of gCmdsApi) {
        let isFirstLine = true;
        for (const desc of cmdObj.description.split('\n')) {
            if (desc.length > 1 || isFirstLine)
                res.pushResData({
                    data: isFirstLine ? `[${cmdName}] -> ${desc}` : desc,
                    displayColor: W16ConsoleDisplayColors.LOG
                });
            isFirstLine = false
        }
    }
}

export default helpExecFunc;