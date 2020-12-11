import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../stores/RootStore';
import { useHistory } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';

export const SimpleNavBar = observer((props: {title: string}) => {
    const { theme } = useStores();
    const history = useHistory();

    // tsline:disable-next-line
    return (
        <Menu inverted attached>
            <Menu.Item
                name='back'
                active={false}
                onClick={() => history.goBack()}
                style={theme.headerText()}
            >
                <Icon name="angle left" />
            </Menu.Item>
            <Menu.Item header className="borderless item left" style={theme.softMenu()}>
                {props.title}
            </Menu.Item>
        </Menu>
    );
});