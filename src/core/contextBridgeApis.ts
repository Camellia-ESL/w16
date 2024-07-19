/**
 * A static class api to easily interact with app internal functionalities
 */
export default class ContextBridgeApi {

    /**
     * Minimize the application
     */
    static minimizeApp(): void {
        ipcRenderer.send('window-control', 'minimize');
    }

    /**
     * Closes the application
     */
    static closeApp(): void {
        ipcRenderer.send('window-control', 'close');
    }
}