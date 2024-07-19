import { gCmdsApi } from "./consoleCmds";

/*
    This file contains all the engine and functionalities linked with w16 console
*/

export interface W16ResData {
    /**
     * The elaborated data
     */
    data: string,
    /**
     * The alphanumeric display color
     */
    displayColor: string
}

/**
 * Represent the result of a cmd execution
 */
export interface W16CmdExecContext {
    /**
     * The sent cmd raw string
     */
    cmd: string,
    /**
     * The cmd name
     */
    cmdName: string,
    /**
     * The cmd args
     */
    args: Array<string>,
    /**
     * An array containing the various results during the execution with their display props
     * NOTE: This property is readonly to push new data and update the engine execution status consider using pushResData
     */
    resData: Readonly<Array<W16ResData>>,
    /**
     * Safely pushes new result data and manage to also call the necessary callbacks
     * @param data The data to push
     */
    pushResData: (data: W16ResData) => void
}

/**
 * The type of the execution result list
 */
type ExecResList = Array<W16CmdExecContext>;

/**
 * The callback called whenever a cmd execution is finished
 */
type OnCompletationResCallback = (res: W16CmdExecContext) => void;

/**
 * The callback called whenever a new resData is pushed in a cmd execution result obj
 */
type OnResDataPushCallback = (res: W16CmdExecContext) => void;

/**
 * Handles every interaction with the w16 console
 */
export class W16ConsoleEngine {

    /**
     * The list of all the cmds executed
     */
    public get executedCmdsList(): ExecResList {
        return this._executedCmdsList;
    }

    /**
     * The list of all the cmds executed
     */
    private _executedCmdsList: ExecResList = new Array<W16CmdExecContext>();

    /**
     * Set's the callback to be called whenever a cmd execution is finished
     */
    public set SetOnCompletationResCallback(v: OnCompletationResCallback) {
        this._onExecCompletationCallback = v;
    }

    private _onExecCompletationCallback: OnCompletationResCallback = () => { }

    /**
     * Set's the callback to be called whenever a cmd execution is finished
     */
    public set SetOnResDataPushCallback(v: OnResDataPushCallback) {
        this._onResDataPushCallback = v;
    }

    private _onResDataPushCallback: OnResDataPushCallback = () => { }

    /**
     * Executes a command sent by the user, note this enter the execution engine state
     * @param cmd The command string
     */
    public executeCmd = async (cmd: string): Promise<boolean> => {

        // Cmd filtering
        if (cmd.length <= 0)
            return false;

        const cmdSplitterRegex = /(?:[^\s"]+|"[^"]*")+/g;
        const cmdSplitted = cmd.match(cmdSplitterRegex);
        const cmdName = cmdSplitted ? cmdSplitted[0] : '';
        const cmdArgs = cmdSplitted ? cmdSplitted.slice(1).map(match => {
            if (match.startsWith('"') && match.endsWith('"')) {
                return match.slice(1, -1);
            }
            return match;
        }) : [];

        // Construct a result obj
        const res = {
            cmd,
            cmdName,
            args: cmdArgs as string[],
            resData: new Array<W16ResData>(),
            pushResData: (data: W16ResData) => {
                // push the data
                res.resData.push(data);
                // calls the callback
                this._onResDataPushCallback(res);
            }
        }

        // Pushes the last executed cmd res
        this._executedCmdsList.push(res);

        // Check wether the cmd exist or not before trying to execute them
        if (!(cmdName in gCmdsApi)) {
            res.pushResData({
                data: `${cmdName} doesn't exist, please type "help" to see the full list of available commands`,
                displayColor: W16ConsoleDisplayColors.ERROR
            });
            return false;
        }

        // Trys executing the cmd sent
        gCmdsApi[cmdName].execFunc(cmdArgs, res).then(() => {
            // Calls the callback for the result
            this._onExecCompletationCallback(res);
        });

        return true;
    }

}

/**
 * An enum with standard w16 console colors
 */
export enum W16ConsoleDisplayColors {
    LOG = 'White',
    ERROR = 'Red',
    WARN = 'Yellow',
    GREEN = 'Green'
}