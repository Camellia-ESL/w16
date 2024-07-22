import * as Dockable from "@hlorenzi/react-dockable"
import { gDockspaceState } from "../staticpanels/MainFrame";
import { W16ConsoleEngine, W16ResData } from "../w16Api/consoleEngine";
import { useEffect, useRef, useState } from "react";
import { StringUtils } from "../core/strings";

import './css/ConsoleWindow.css'

/**
 * Spawn a new Console Window
 */
export const SpawnConsoleWindow = (): void => {
    const newPanel = Dockable.createDockedPanel(
        gDockspaceState.ref.current,
        gDockspaceState.ref.current.activePanel ?? gDockspaceState.ref.current.rootPanel,
        Dockable.DockMode.Full,
        <ConsoleWindow />
    );

    Dockable.dock(
        gDockspaceState.ref.current,
        newPanel,
        gDockspaceState.ref.current.activePanel ?? gDockspaceState.ref.current.rootPanel,
        Dockable.DockMode.Full
    );
}

// The row element props for the exec result
interface CmdExecResultRowProps {
    /**
     * The cmd involved in the event
     */
    cmd: string;
    /**
     * The result 
     */
    results: Readonly<Array<W16ResData>>;
}

// A row that represent the execution result of a command
const CmdExecResultRow: React.FC<CmdExecResultRowProps> = ({ cmd, results }): JSX.Element => {
    return (
        <div key={StringUtils.generateUniqueString()} className="cmd-result-row">
            {cmd} -&gt; {
                results?.map((v, index) =>
                    <>
                        <span
                            style={{ 
                                color: v.displayColor,
                                paddingLeft: index !== 0 ? '10px' : '0px'
                            }}
                        >
                            {v.data}
                        </span>
                        {index + 1 !== results.length ? <br /> : ''}
                    </>
                )
            }
        </div>
    );
}

// A spawnable console window to execute w16 commands
const ConsoleWindow = (): JSX.Element => {

    // States
    const [consoleEngine] = useState(new W16ConsoleEngine());
    const [cmdExecResultsList, setCmdExecResultsList] = useState<Array<JSX.Element>>([]);

    // Refs
    const textBoxInputData = useRef<HTMLInputElement>(null);
    const consoleDisplay = useRef<HTMLDivElement>(null);

    // Set the dock context options
    const docCtx = Dockable.useContentContext();
    docCtx.setTitle(`Console`);
    docCtx.setPreferredSize(600, 450);

    // Handles key downs when focusing input text box
    const onTextBoxInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            await consoleEngine.executeCmd(textBoxInputData?.current?.value as string);
            if (textBoxInputData.current)
                textBoxInputData.current.value = '';
        }
    }

    // Set an effect to handle display update
    useEffect(() => {
        consoleEngine.SetOnResDataPushCallback = () => {
            setCmdExecResultsList(
                consoleEngine.executedCmdsList.map((result) => <CmdExecResultRow cmd={result.cmd} results={result.resData} />)
            );
        }
    }, []);

    return (
        <div className="console-window">
            <div className="console-display" id="console-display" ref={consoleDisplay}>
                {cmdExecResultsList}
            </div>
            <div className="console-input-box">
                <span className="input-intestation">w16 &gt;</span>
                <input className="input-text-box" type="text" ref={textBoxInputData} onKeyDown={onTextBoxInputKeyDown}></input>
            </div>
        </div>
    );
}

export default ConsoleWindow;