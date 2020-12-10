import React from 'react';
import { useStores } from '../stores/RootStore';
import { useHistory } from 'react-router-dom';

export const BlogPostNavBar = (props: { title: string }) => {
    const { theme, settings } = useStores();
    const history = useHistory();

    return (
        <div className="ui attached inverted icon menu" >
            <a 
                className="item" 
                onClick={() => history.goBack()} 
                style={theme.headerText()}
            >
                <i className="icon angle left" />
            </a>
            <div 
                className="header borderless item left" 
                style={theme.softMenu()}
            >
                {props.title}
            </div>
            <div className="right menu">
                <a 
                    className="item" 
                    onClick={() => settings.decreseFontSize()} 
                    style={theme.headerText()}
                >
                    <i className="icon minus" />
                </a>
                <a 
                    className="item right" 
                    onClick={() => settings.increaseFontSize()} 
                    style={theme.headerText()}
                >
                    <i className="icon plus" />
                </a>
            </div>
        </div>
    );
};