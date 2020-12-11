import React from 'react';
import { useStores } from '../stores/RootStore';
import { useHistory } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';

export const BlogPostNavBar = (props: { title: string }) => {
    const { theme, settings } = useStores();
    const history = useHistory();

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
            {/* Using div here since i don't get a border on the first item when using menu */}
            <div className="right menu">
                <Menu.Item
                    name='decreaseFontSize'
                    active={false}
                    onClick={() => settings.decreseFontSize()}
                    style={theme.headerText()}
                >
                    <Icon name="minus" />
                </Menu.Item>
                <Menu.Item
                    name='increaseFontSize'
                    active={false}
                    onClick={() => settings.increaseFontSize()}
                    style={theme.headerText()}
                >
                    <Icon name="plus" />
                </Menu.Item>
            </div>
        </Menu>
    );
};