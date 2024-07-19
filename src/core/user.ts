/**
 * This file contains informations and custom settings of the user,
 * probably not the right place to write this type of things like user settings.
 * Should be moved somewhere else.
 */

import { FileSystem } from "./filesystem";

/**
 * The settings about the user saved localy
 */
interface UserSettings {
    [key: string]: any;
    [Symbol.iterator]: () => { next(): IteratorResult<[string, any], any>; };
    /**
     * The path of kovaak on this user
     */
    kovaakLocalPath?: string;
}

/**
 * A class to handle all the functionalities related to the user
 */
export class User {

    /**
     * The user settings
     */
    public static get settings(): UserSettings {
        return User._settings;
    }

    private static _settings: UserSettings = {
        [Symbol.iterator]() {
            const entries = Object.entries(this);
            let index = 0;
            return {
                next(): IteratorResult<[string, any]> {
                    if (index < entries.length) {
                        return { value: entries[index++], done: false };
                    } else {
                        return { value: undefined, done: true };
                    }
                }
            };
        }
    }

    /**
     * Load user settings from file
     */
    public static loadUserSettings = async () => {
        const loadedSettings = await FileSystem.deserializeObj(await this.getUserSettingsFilePath());
        if (loadedSettings)
            User._settings = {
                ...loadedSettings,
                [Symbol.iterator]() {
                    const entries = Object.entries(this);
                    let index = 0;
                    return {
                        next(): IteratorResult<[string, any]> {
                            if (index < entries.length) {
                                return { value: entries[index++], done: false };
                            } else {
                                return { value: undefined, done: true };
                            }
                        }
                    };
                }
            };
    }

    /**
     * Save the user settings in the file
     */
    public static saveUserSettings = async () => await FileSystem.serializeObj(this._settings, await this.getUserSettingsFilePath());

    /**
     * Get's the path to the user settings file
     * @returns The path to the file
     */
    public static getUserSettingsFilePath = async () => (await FileSystem.getAppPath()) + '\\Settings\\UserSettings.json';

}