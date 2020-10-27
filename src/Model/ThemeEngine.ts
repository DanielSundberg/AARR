import { observable } from 'mobx';
import * as _ from 'lodash';

interface Theme {
    key: string;
    name: string;
    listBackground: string;
    blogListCountColor: string;
    blogListLinkColor: string;
    headerTextColor: string;
    softMenuColor: string;
    dropDownMenuBackground: string;
    inputBackground: string;
    inputColor: string;
    infoMessageBackground: string;
    infoMessageColor: string;
    blogHeaderActiveBackground: string;
    blogHeaderActiveColor: string;
    blogHeaderInactiveBackground: string;
    blogHeaderInactiveColor: string;
}

const lightTheme: Theme = {
    key: "light",
    name: "Light",
    listBackground: "#ffffff",
    blogListCountColor: "#000000",
    blogListLinkColor: "#4183C4",
    headerTextColor: "#ffffff",
    softMenuColor: "#B7B7B7",
    dropDownMenuBackground: "#ffffff", 
    inputBackground: "#ffffff", 
    inputColor: "#000000", 
    infoMessageBackground: "#F8FFFF", 
    infoMessageColor: "#276F86", 
    blogHeaderActiveBackground: "#3B83C0", 
    blogHeaderActiveColor: "#FFFFFF",
    blogHeaderInactiveBackground: "#808080",
    blogHeaderInactiveColor: "#FFFFFF"
};

const darkTheme: Theme = {
    key: "dark",
    name: "Dark",
    listBackground: "#202124",
    blogListCountColor: "#B7B7B7",
    blogListLinkColor: "#B7B7B7",
    headerTextColor: "#B7B7B7",
    softMenuColor: "#B7B7B7",
    dropDownMenuBackground: "#1B1C1D", 
    inputBackground: "#35363A", 
    inputColor: "#FFFFFF", 
    infoMessageBackground: "#35363A", 
    infoMessageColor: "#B7B7B7", 
    blogHeaderActiveBackground: "#204E71", 
    blogHeaderActiveColor: "#B7B7B7",
    blogHeaderInactiveBackground: "#808080",
    blogHeaderInactiveColor: "#B7B7B7"
};

class ThemeEngine {
    @observable theme: Theme;

    constructor() {
        // const storedTheme = localStorage.getItem("theme");
        // if (storedTheme && storedTheme === "dark") {
        //     this.theme = darkTheme;
        // } else {
        //     this.theme = lightTheme;
        // }
        this.theme = darkTheme;
    }

    themes(): Theme[] {
        return [lightTheme, darkTheme];
    }

    setTheme(key: string) {
        localStorage.setItem("theme", key);
    }

    listBackgroundColor() {
        return this.theme.listBackground;
    }

    listBackgroundStyle() {
        return {
            background: this.theme.listBackground
        };
    }

    blogListCountStyle() {
        return {
            color: this.theme.blogListCountColor
        };
    }

    blogListLinkStyle() {
        return {
            color: this.theme.blogListCountColor
        };
    }

    headerTextStyle() {
        return {
            color: this.theme.headerTextColor
        };
    }

    softMenuStyle() {
        return {
            color: this.theme.softMenuColor
        };
    }

    dropDownMenuBackground() {
        return {
            background: this.theme.dropDownMenuBackground
        };
    }

    inputStyle() {
        return {
            background: this.theme.inputBackground, 
            color: this.theme.inputColor
        }
    }

    infoMessageStyle() {
        return {
            color: this.theme.infoMessageColor,
            background: this.theme.infoMessageBackground
        }
    }
    
    blogHeaderActiveStyle() {
        return {
            color: this.theme.blogHeaderActiveColor,
            background: this.theme.blogHeaderActiveBackground
        }
    }

    blogHeaderInactiveStyle() {
        return {
            color: this.theme.blogHeaderInactiveColor,
            background: this.theme.blogHeaderInactiveBackground
        }
    }
}

export default ThemeEngine;