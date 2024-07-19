import ContextBridgeApi from '../core/contextBridgeApis';

import './css/HeaderBar.css'

// The header bar containing app utils functionalities
const HeaderBar = () : JSX.Element => {
    return (
        <div id='header-bar' className='header-bar'>
            <span>W16</span>
            <div className="window-controls-container">
                <input type='button' id="minimize-btn" className="minimize-btn" onClick={() => {ContextBridgeApi.minimizeApp()}}/>
                <input type='button' id="close-btn" className="close-btn" onClick={() => {ContextBridgeApi.closeApp()}}/>
            </div>
        </div>
    )
}

export default HeaderBar;