import cnewExecFunc from './cmdsExecFuncs/cnewCmd';
import helpExecFunc from './cmdsExecFuncs/helpCmd';
import infoExecFunc from './cmdsExecFuncs/infoCmd'
import kvkgetExecFunc from './cmdsExecFuncs/kvkgetCmd';
import kvklistExecFunc from './cmdsExecFuncs/kvklistCmd';
import kvkloadExecFunc from './cmdsExecFuncs/kvkloadCmd';
import listconfigExecFunc from './cmdsExecFuncs/listconfigCmd';
import setkvkpathExecFunc from './cmdsExecFuncs/setkvkpathCmd';
import svstExecFunc from './cmdsExecFuncs/svstCmd';

import { W16CmdExecContext } from './consoleEngine';

type CmdObj = {
    /**
     * The cmd description
     */
    description: string,
    /**
     * The function that needs to be executed when the cmd is called
     * @param args All the cmd arguments
     * @returns Execution result
     */
    execFunc: (args: Array<string>, res: W16CmdExecContext) => Promise<void>
}

interface CmdsApi {
    [key: string]: any;
    [Symbol.iterator]: () => { next(): IteratorResult<[string, CmdObj], any>; }
    help: CmdObj,
    info: CmdObj,
    cnew: CmdObj,
    svst: CmdObj,
    setkvkpath: CmdObj,
    listconfig: CmdObj,
    kvkget: CmdObj,
    kvklist: CmdObj,
    kvkload: CmdObj,
}

/**
 * Contains all the available cmds and informations related to it
 */
export const gCmdsApi: CmdsApi = {
    [Symbol.iterator]() {
        const entries = Object.entries(this);
        let index = 0;
        return {
            next(): IteratorResult<[string, CmdObj]> {
                if (index < entries.length) {
                    return { value: entries[index++], done: false };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    },
    help: {
        description: 'Display informations about all the available console commands',
        execFunc: helpExecFunc
    },
    info: {
        description: 'Display informations about the program.',
        execFunc: infoExecFunc
    },
    cnew: {
        description: 'Instance a new isolated console.',
        execFunc: cnewExecFunc
    },
    svst: {
        description: 'Save user settings to a local file.',
        execFunc: svstExecFunc
    },
    setkvkpath: {
        description: 'Sets the path to the kovaak local files, IMPORTANT to use all the functionalities related to the game!',
        execFunc: setkvkpathExecFunc
    },
    listconfig: {
        description: 'List all the current loaded user settings configuration!',
        execFunc: listconfigExecFunc
    },
    kvkget: {
        description: `
            Downloads a theme/sound/crosshair or an entire creator package containing all the three by doing: kvkget [downloadtype] [typename]
            Downloadtypes supported:
            --theme
            --sound
            --crosshair
            --pack
            Typename: The name of the theme, sound, crosshair or package that you want to download inside quotes ex. "camellias-garden"
            Example usage: kvkget --pack "4ark-main"
            NOTE: For packages file type isn't needed but for any other resource type it's needed (sounds for example needs the .ogg at the end)
        `,
        execFunc: kvkgetExecFunc
    },
    kvklist: {
        description: `
            Searches all the themes/sounds/crosshairs/packages with the given name or it list them all by doing: kvklist [searchtype] [typename (optional)]
            Searchtypes supported:
            --theme
            --sound
            --crosshair
            --pack
            Typename: The name of the theme, sound, crosshair or package that you want to search inside quotes ex. "camellias" and it will list all the typenames
            that match camellias inside their name
            Example usage: kvklist --pack "camellias"
        `,
        execFunc: kvklistExecFunc
    },
    kvkload: {
        description: `
            Loads a specified category type by doing: kvkload [categoryType] [typename]
            Categorytypes supported:
            --palette
            Typename: The name of the thing that you want to load inside quotes ex. "camellias-garden.ini"
            Example usage: kvkload --palette "4ark-main"
        `,
        execFunc: kvkloadExecFunc
    },
}