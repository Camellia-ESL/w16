import * as Dockable from "@hlorenzi/react-dockable"

import ConsoleWindow from "../windows/ConsoleWindow";

import './css/MainFrame.css'

/**
 * The global dockspace state
 */
export let gDockspaceState : Dockable.RefState<Dockable.State>; 

// The application main frame window containing all the functionalities
const MainFrame = (): JSX.Element => {

    // Create the base state, and set up initial content
    gDockspaceState = Dockable.useDockable((state) => {
        Dockable.createDockedPanel(
            state, state.rootPanel, Dockable.DockMode.Full,
            <ConsoleWindow />
        );
    });
    
    return (
        <div className="main-frame">
            <div className="dockable-space">
                <Dockable.Container state={ gDockspaceState } />
            </div>
        </div>
    );
}

export default MainFrame;