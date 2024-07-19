import { W16ConsoleDisplayColors, W16CmdExecContext } from "../consoleEngine";

import { downloadCategoryTypes } from "./kvkgetCmd";

const filelistApiUrl = 'https://api.github.com/repos/Camellia-ESL/w16-package-db/contents/kovaak-packages'

interface GitHubContent {
    name: string;
    path: string;
    sha: string;
    url: string;
    git_url: string;
    html_url: string;
    download_url: string | null;
    type: string;
    _links: {
        self: string;
        git: string;
        html: string;
    };
}

const kvklistExecFunc = async (args: Array<string>, res: W16CmdExecContext) => {

    // Check if there are args
    if (args.length < 1) {
        res.pushResData({
            data: `"kvklist" cmd expect at least 1 argument, use "help" cmd to see the usage`,
            displayColor: W16ConsoleDisplayColors.ERROR
        });
        return;
    }

    // Check if the first argument is a known download category type
    if (!downloadCategoryTypes.hasOwnProperty(args[0])) {
        res.pushResData({
            data: `"kvklist" cmd expects a known download type received -> ${args[0]}, use "help" cmd to see the usage`,
            displayColor: W16ConsoleDisplayColors.ERROR
        });
        return;
    }

    // Adds a empty line
    res.pushResData({ data: ``, displayColor: W16ConsoleDisplayColors.LOG });

    const response = await fetch(filelistApiUrl + downloadCategoryTypes[args[0]].downloadUrlPath);

    if (!response.ok) {
        res.pushResData({
            data: `Something went wrong fetching the file list`,
            displayColor: W16ConsoleDisplayColors.ERROR
        });
        return;
    }

    const data: GitHubContent[] = await response.json();

    // If a filter string was given tries to filter the results
    for (const file of data) {
        const printFile = () => {
            res.pushResData({ data: '|', displayColor: W16ConsoleDisplayColors.LOG });
            res.pushResData({ data: '|-->' + '"' + file.name + '"', displayColor: W16ConsoleDisplayColors.LOG });
        }

        if (args[1] && args[1].length > 0) {
            if(file.name.toLocaleLowerCase().includes(args[1].toLowerCase()))
                printFile();
        } else
            printFile();
    }
}

export default kvklistExecFunc;