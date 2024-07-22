import { User } from "../../core/user";
import { W16ConsoleDisplayColors, W16CmdExecContext } from "../consoleEngine";
import { CategoryTypeNames } from "./kvkgetCmd";
import { FileSystem } from "../../core/filesystem";

interface DownloadCategoryTypes {
    [key: string]: any;
}

const loadableCategories: DownloadCategoryTypes = {
    '--palette': {
        localPath: '\\LocalPalettes'
    }
}

const kvkloadExecFunc = async (args: Array<string>, res: W16CmdExecContext) => {

    // Check if there are args
    if (args.length < 2) {
        res.pushResData({
            data: `"kvkload" cmd expects at least 2 arguments, use "help" cmd to see the usage`,
            displayColor: W16ConsoleDisplayColors.ERROR
        });
        return;
    }

    if (!loadableCategories.hasOwnProperty(args[0])) {
        res.pushResData({
            data: `"kvkload" cmd expects a valid category type`,
            displayColor: W16ConsoleDisplayColors.ERROR
        });
        return;
    }

    // Check if the user has a the path of kovaak properly set
    if (!User.settings.kovaakLocalPath || User.settings.kovaakLocalPath.length === 0) {
        res.pushResData({
            data: `You are missing a valid path to kovaak in the settings, please set a valid path! Use "help" cmd to check how to set it`,
            displayColor: W16ConsoleDisplayColors.ERROR
        });
        return;
    }

    // Adds a empty line
    res.pushResData({ data: ``, displayColor: W16ConsoleDisplayColors.LOG });

    if(args[0] === CategoryTypeNames.PALETTE) {
        if(
            await FileSystem.copyFile(
                await FileSystem.getAppPath() + loadableCategories[args[0]].localPath + "\\" + args[1], 
                await FileSystem.getLocalAppDataPath() + "\\FPSAimTrainer\\Saved\\Config\\WindowsNoEditor\\Palette.ini"
            )
        ) {
            res.pushResData({
                data: `Something went wrong loading your palette, maybe the name of the palette file you specified is wrong?`,
                displayColor: W16ConsoleDisplayColors.ERROR
            });
            return;
        }

        res.pushResData({
            data: `${args[1]} palette loaded successfully!`,
            displayColor: W16ConsoleDisplayColors.GREEN
        });
    }
}

export default kvkloadExecFunc;