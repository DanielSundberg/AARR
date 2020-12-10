import * as _ from 'lodash';
import { Storage as storage } from '../utils/Storage';
import { makeObservable, observable, action, computed } from 'mobx';

interface Theme {
    key: string;
    name: string;
    listBackground: string;
    blogListCountColor: string;
    blogListLinkColor: string;
    headerTextColor: string;
    settingsHeaderColor: string;
    blogTextColor: string;
    softMenuColor: string;
    dropdownMenuColor: string;
    dropDownMenuBackground: string;
    inputBackground: string;
    inputColor: string;
    infoMessageBackground: string;
    infoMessageColor: string;
    errorMessageBackground: string;
    errorMessageColor: string;
    blogHeaderActiveBackground: string;
    blogHeaderActiveColor: string;
    blogHeaderInactiveBackground: string;
    blogHeaderInactiveColor: string;
    activeButtonBackground: string;
    activeButtonColor: string;
    inactiveButtonBackground: string;
    inactiveButtonColor: string;
}

const lightTheme: Theme = {
    key: "light",
    name: "Light",
    listBackground: "#ffffff",
    blogListCountColor: "#000000",
    blogListLinkColor: "#4183C4",
    headerTextColor: "#ffffff",
    settingsHeaderColor: "#000000",
    blogTextColor: "#000000",
    softMenuColor: "#B7B7B7",
    dropdownMenuColor: "#000000",
    dropDownMenuBackground: "#ffffff", 
    inputBackground: "#ffffff", 
    inputColor: "#000000", 
    infoMessageBackground: "#F8FFFF", 
    infoMessageColor: "#276F86", 
    errorMessageBackground: "#FFF6F6",
    errorMessageColor: "#FF9E9E",
    blogHeaderActiveBackground: "#3B83C0", 
    blogHeaderActiveColor: "#FFFFFF",
    blogHeaderInactiveBackground: "#808080",
    blogHeaderInactiveColor: "#FFFFFF", 
    activeButtonBackground: "#3B83C0",
    activeButtonColor: "#FFFFFF", 
    inactiveButtonBackground: "#808080",
    inactiveButtonColor: "#FFFFFF"
};

const darkTheme: Theme = {
    key: "dark",
    name: "Dark",
    listBackground: "#202124",
    blogListCountColor: "#B7B7B7",
    blogListLinkColor: "#B7B7B7",
    headerTextColor: "#B7B7B7",
    settingsHeaderColor: "#B7B7B7",
    blogTextColor: "#B7B7B7",
    softMenuColor: "#B7B7B7",
    dropdownMenuColor: "#B7B7B7",
    dropDownMenuBackground: "#1B1C1D", 
    inputBackground: "#35363A", 
    inputColor: "#B7B7B7", 
    infoMessageBackground: "#35363A", 
    infoMessageColor: "#B7B7B7", 
    errorMessageBackground: "#FF9E9E",
    errorMessageColor: "#FF3131",
    blogHeaderActiveBackground: "#204E71", 
    blogHeaderActiveColor: "#B7B7B7",
    blogHeaderInactiveBackground: "#808080",
    blogHeaderInactiveColor: "#B7B7B7", 
    activeButtonBackground: "#204E71", 
    activeButtonColor: "#B7B7B7",
    inactiveButtonBackground: "#808080",
    inactiveButtonColor: "#B7B7B7"
};

const blackTheme: Theme = {
    key: "black",
    name: "Black",
    listBackground: "#000000",
    blogListCountColor: "#BFBFBF",
    blogListLinkColor: "#BFBFBF",
    headerTextColor: "#BFBFBF",
    settingsHeaderColor: "#BFBFBF",
    blogTextColor: "#BFBFBF",
    softMenuColor: "#BFBFBF",
    dropdownMenuColor: "#BFBFBF",
    dropDownMenuBackground: "#1B1C1D", 
    inputBackground: "#35363A", 
    inputColor: "#BFBFBF", 
    infoMessageBackground: "#35363A", 
    infoMessageColor: "#BFBFBF", 
    errorMessageBackground: "#FF9E9E",
    errorMessageColor: "#FF3131",
    blogHeaderActiveBackground: "#204E71", 
    blogHeaderActiveColor: "#BFBFBF",
    blogHeaderInactiveBackground: "#808080",
    blogHeaderInactiveColor: "#BFBFBF", 
    activeButtonBackground: "#204E71", 
    activeButtonColor: "#BFBFBF",
    inactiveButtonBackground: "#808080",
    inactiveButtonColor: "#BFBFBF"
};

const themes = [ 
    lightTheme, 
    darkTheme, 
    blackTheme
];

export class ThemeStore {
    theme: Theme = lightTheme;

    constructor() {
        makeObservable(this, {
            theme: observable, 
            colors: computed,
            currentTheme: computed,
            setTheme: action
        })
        const storedTheme = storage.getTheme("light");
        this.setTheme(storedTheme);
    }

    themes(): Theme[] {
        return themes;
    }

    setTheme(key: string) {
        let newTheme = _.find(themes, t => t.key === key);
        if (newTheme) {
            storage.storeTheme(key);
            this.theme = newTheme;
        } else {
            throw new Error(`Invalid theme key: ${key}.`);
        }
    }

    get currentTheme(): string {
        return this.theme.key;
    }

    get colors() {
        return this.theme;
    }

    listBackground() {
        return {
            background: this.theme.listBackground
        };
    }

    blogListCount() {
        return {
            color: this.theme.blogListCountColor
        };
    }

    blogListLink() {
        return {
            color: this.theme.blogListLinkColor
        };
    }

    headerText() {
        return {
            color: this.theme.headerTextColor
        };
    }

    settingsHeader() {
        return {
            color: this.theme.settingsHeaderColor
        };
    }

    blogText() {
        return {
            color: this.theme.blogTextColor
        };
    }

    softMenu() {
        return {
            color: this.theme.softMenuColor
        };
    }

    dropdownMenu() {
        return {
            color: this.theme.dropdownMenuColor
        };
    }

    dropDownMenuBackground() {
        return {
            background: this.theme.dropDownMenuBackground
        };
    }

    input() {
        return {
            background: this.theme.inputBackground, 
            color: this.theme.inputColor
        };
    }

    infoMessage() {
        return {
            color: this.theme.infoMessageColor,
            background: this.theme.infoMessageBackground
        };
    }

    errorMessage() {
        return {
            color: this.theme.errorMessageColor, 
            background: this.theme.errorMessageBackground,
        };
    }
    
    blogHeaderActive() {
        return {
            color: this.theme.blogHeaderActiveColor,
            background: this.theme.blogHeaderActiveBackground
        };
    }

    blogHeaderInactive() {
        return {
            color: this.theme.blogHeaderInactiveColor,
            background: this.theme.blogHeaderInactiveBackground
        };
    }

    activeButton() {
        return {
            background: this.theme.activeButtonBackground, 
            color: this.theme.activeButtonColor, 
        };
    }

    inactiveButton() {
        return {
            background: this.theme.inactiveButtonBackground, 
            color: this.theme.inactiveButtonColor
        };
    }
}
