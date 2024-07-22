import { DownloadHandler } from "../../core/downloadHandler";
import { FileSystem } from "../../core/filesystem";
import { User } from "../../core/user";
import { W16ConsoleDisplayColors, W16CmdExecContext } from "../consoleEngine";

// This is the base download url to index for downloading all the type of kovaak contents
const downloadUrlPrefix: string = 'https://raw.githubusercontent.com/Camellia-ESL/w16-package-db/main/kovaak-packages';

interface DownloadCategoryTypes {
    [key: string]: any;
}

export enum CategoryTypeNames {
    THEME = '--theme',
    SOUND = '--sound',
    CROSSHAIR = '--crosshair',
    PACKAGE = '--pack',
    PALETTE = '--palette'
}

// Contains all the category types informations
export const downloadCategoryTypes: DownloadCategoryTypes = {
    '--theme': {
        downloadUrlPath: '/themes',
        fileExtension: '.json',
        kovaakContentDir: 'FPSAimTrainer\\Saved\\SaveGames\\Themes'
    },
    '--sound': {
        downloadUrlPath: '/sounds',
        fileExtension: '.ogg',
        kovaakContentDir: 'FPSAimTrainer\\sounds'
    },
    '--crosshair': {
        downloadUrlPath: '/crosshairs',
        fileExtension: '.png',
        kovaakContentDir: 'FPSAimTrainer\\crosshairs'
    },
    '--pack': {
        downloadUrlPath: '/packages',
        fileExtension: '.zip'
    },
    '--palette': {
        downloadUrlPath: '/palettes',
        fileExtension: '.ini'
    }
}

const kvkgetExecFunc = async (args: Array<string>, res: W16CmdExecContext) => {

    // Check if there are args
    if (args.length < 2) {
        res.pushResData({
            data: `"kvkget" cmd expects at least 2 arguments, use "help" cmd to see the usage`,
            displayColor: W16ConsoleDisplayColors.ERROR
        });
        return;
    }

    // Check if the first argument is a known download category type
    if (!downloadCategoryTypes.hasOwnProperty(args[0])) {
        res.pushResData({
            data: `"kvkget" cmd expects a known download type received -> ${args[0]}, use "help" cmd to see the usage`,
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

    const isPackage = args[0] === CategoryTypeNames.PACKAGE;
    const isPalette = args[0] === CategoryTypeNames.PALETTE;

    // Adds a empty line
    res.pushResData({ data: ``, displayColor: W16ConsoleDisplayColors.LOG });

    // Download the content
    res.pushResData({ data: `Download requested for -> ${res.cmd}`, displayColor: W16ConsoleDisplayColors.WARN });
    res.pushResData({ data: `Fetching content from w16 db...`, displayColor: W16ConsoleDisplayColors.LOG });

    // Builds the fetching url
    const dwFetchUrl: string = downloadUrlPrefix + downloadCategoryTypes[args[0]].downloadUrlPath + '/' + args[1];

    // Builds the download path
    const dwPath: string =
        isPackage ?
            await FileSystem.getAppPath() + '\\DownloadTemp\\' + args[1] :
            isPalette ?
                await FileSystem.getAppPath() + '\\LocalPalettes\\' + args[1] :
                User.settings.kovaakLocalPath + "\\" + downloadCategoryTypes[args[0]].kovaakContentDir + "\\" + args[1];

    res.pushResData({ data: `Resource target url -> ${dwFetchUrl}`, displayColor: W16ConsoleDisplayColors.LOG });

    // Fetch the content
    if (isPackage) {

        const downloadPackageResource = async (resType: string, dwFilePath: string) => await DownloadHandler.downloadFile(
            encodeURI(
                dwFetchUrl +
                downloadCategoryTypes[resType].downloadUrlPath +
                downloadCategoryTypes[CategoryTypeNames.PACKAGE].fileExtension
            ),
            dwFilePath
        )

        const extractPackageResource = async (resType: string, dwFilePath: string) => await FileSystem.unzipFile(
            dwFilePath,
            User.settings.kovaakLocalPath + "\\" + downloadCategoryTypes[resType].kovaakContentDir
        );

        const downloadRes = async (resName: string, resType: string, dwFilePath: string) => {
            res.pushResData({ data: `Fetching ${resName}...`, displayColor: W16ConsoleDisplayColors.LOG });
            if (!await downloadPackageResource(resType, dwFilePath)) {
                res.pushResData({
                    data: `An error occured trying to fetch the content, have you miss spelled the package name?`,
                    displayColor: W16ConsoleDisplayColors.ERROR
                });
                return false;
            }
            res.pushResData({ data: `${resName} fetched.`, displayColor: W16ConsoleDisplayColors.GREEN });
            return true;
        }

        const extractRes = async (resName: string, resType: string, dwFilePath: string) => {
            res.pushResData({ data: `Extracting ${resName} resources`, displayColor: W16ConsoleDisplayColors.LOG });
            if (await extractPackageResource(resType, dwFilePath)) {
                res.pushResData({
                    data: `An error occured trying to extract the content, something went wrong!`,
                    displayColor: W16ConsoleDisplayColors.ERROR
                });
                return false;
            }
            res.pushResData({ data: `${resName} extracted correctly!`, displayColor: W16ConsoleDisplayColors.GREEN });
            return true;
        }

        // Creates download target files
        const crosshairsTempFilePath = dwPath + "\\" + 'crosshairs' + '.zip';
        const soundsTempFilePath = dwPath + "\\" + 'sounds' + '.zip';
        const themesTempFilePath = dwPath + "\\" + 'Themes' + '.zip';

        // Download the package
        if (
            !await downloadRes('crosshairs', CategoryTypeNames.CROSSHAIR, crosshairsTempFilePath) ||
            !await downloadRes('sounds', CategoryTypeNames.SOUND, soundsTempFilePath) ||
            !await downloadRes('themes', CategoryTypeNames.THEME, themesTempFilePath)
        )
            return;

        // Extract all the data
        res.pushResData({ data: `Extracting data in game files, wait until it's done.`, displayColor: W16ConsoleDisplayColors.WARN });
        res.pushResData({ data: `Kovaaks target directory -> ${User.settings.kovaakLocalPath}`, displayColor: W16ConsoleDisplayColors.WARN });

        // Extract the package
        if (
            !await extractRes('crosshairs', CategoryTypeNames.CROSSHAIR, crosshairsTempFilePath) ||
            !await extractRes('sounds', CategoryTypeNames.SOUND, soundsTempFilePath) ||
            !await extractRes('themes', CategoryTypeNames.THEME, themesTempFilePath)
        )
            return;

        res.pushResData({ data: `Package downloaded successfully!`, displayColor: W16ConsoleDisplayColors.GREEN });
        res.pushResData({ data: `Please restart your game if open!`, displayColor: W16ConsoleDisplayColors.WARN });

    } else {
        if (!await DownloadHandler.downloadFile(encodeURI(dwFetchUrl), dwPath)) {
            res.pushResData({
                data: `An error occured trying to fetch the content, have you miss spelled the package name?`,
                displayColor: W16ConsoleDisplayColors.ERROR
            });
            return;
        }
    }

    res.pushResData({ data: `Resource saved in -> ${dwPath}`, displayColor: W16ConsoleDisplayColors.LOG });
    res.pushResData({ data: `Content fetched successfully.`, displayColor: W16ConsoleDisplayColors.GREEN });

}

export default kvkgetExecFunc;