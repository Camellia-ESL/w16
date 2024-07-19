/**
 * This file provide a series of utils to simplify the downloading process
 */

import { FileSystem } from "./filesystem";

export class DownloadHandler {

    /**
     * Download a file from a url
     * @param url The url from where to download the file
     * @param path The path of the folder where the file will be saved
     * @returns True if everything went correct, false otherwise
     */
    public static downloadFile = async (url: string, path: string): Promise<boolean> => {
        const response = await fetch(url);

        if (!response.ok)
            return false;

        if(await FileSystem.writeFile(await response.arrayBuffer(), path))
            return false;

        return true;
    }

}