/**
 * A file system abstraction
 */
export class FileSystem {
    /**
     * Write's to a file
     * @param data The data to write to the file
     * @param filePath The file path where the data will be saved
     * @returns null if everything went right and error in any other case
     */
    public static writeFile = async (data: string | NodeJS.ArrayBufferView | ArrayBuffer, filePath: string) => 
        await ipcRenderer.invoke('write-file', data, filePath);

    /**
     * Write's to a file the serialized object in JSON format
     * @param data The data to write to the file
     * @param filePath The file path where the data will be saved
     * @returns null if everything went right and error in any other case
     */
    public static serializeObj = async (data: Object, filePath: string) => {
        try {
            return this.writeFile(JSON.stringify(data, null, 2), filePath);
        } catch (err) {
            console.error('Error serializing the json:', err);
            return err;
        }
    }

    /**
     * Read's a file
     * @param filePath The file path where of the file to read
     * @returns the file data or null if something went wrong
     */
    public static readFile = async (filePath: string) => 
        await ipcRenderer.invoke('read-file', filePath) as string;

    /**
     * Read's a JSON file and returns the converted object
     * @param filePath The file path where of the file to read
     * @returns the object or null if something went wrong
     */
    public static deserializeObj = async (filePath: string) => {
        try {
            return await JSON.parse(await this.readFile(filePath));
        } catch (err) {
            console.error('Error parsing object:', err);
            return err;
        }
    }

    /**
     * Unzip a file
     * @param filePath The path to the zip
     * @param destPath The destination path where all the files contained in the zip will be unzipped 
     * @returns null if everything went right and error in any other case
     */
    public static unzipFile = async (filePath: string, destPath: string) => 
        await ipcRenderer.invoke('unzip-file', filePath, destPath);

    /**
     * Get's the app path
     * @returns the path
     */
    public static getAppPath = async () => await ipcRenderer.invoke('get-app-path');
}