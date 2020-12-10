import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../stores/RootStore';
import { useHistory } from 'react-router-dom';

export const SimpleNavBar = observer((props: {title: string}) => {
    const { theme } = useStores();
    const history = useHistory();

    // tsline:disable-next-line
    return (
        <div className="ui attached inverted icon menu" >
            <a
                className="item" 
                onClick={() => history.goBack()} 
                style={theme.headerText()}
            >
                <i className="icon angle left" />
            </a>
            <div className="header borderless item left" style={theme.softMenu()}>{props.title}</div>
        </div>
    );
});