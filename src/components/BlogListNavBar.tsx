import React from 'react';
import { observer } from 'mobx-react';
import { useStores } from '../stores/RootStore';
import { Dropdown, Icon, Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { dropdownMenuFullWidth } from './CustomStyles';

export const BlogListNavBar = observer(() => {
    const { theme, blog, auth } = useStores();
    const history = useHistory();

    const filterItemClasses = blog.showAllFeeds ? "item" : "item active";

    const loaderOrRefreshButton = blog.isUpdatingList ? (
        <div className="item" style={theme.softMenu()}>
            <div className="ui mini active inline loader"/>
        </div>
    ) : (
        <Menu.Item
            onClick={() => blog.getBlogList()} 
            style={theme.softMenu()}
        >
            <Icon name="refresh" size="small" />
        </Menu.Item>
    );

    const hamburger = (
        <Dropdown 
            item={true} 
            icon='bars' 
            style={theme.softMenu()}
        >
            <Dropdown.Menu style={ { ...theme.dropDownMenuBackground(), ...dropdownMenuFullWidth } }>
                <Dropdown.Item onClick={() => history.push("/add")} >
                    <div style={theme.dropdownMenu()}>
                        <Icon name="plus" />
                        <span className='text' >Add feed...</span>
                    </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => history.push("/settings")}>
                    <div style={theme.dropdownMenu()}>
                        <Icon name="cogs" style={theme.dropdownMenu()}/>
                        <span className='text' style={theme.dropdownMenu()}>Settings...</span>
                    </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => history.push("/about")}>
                    <div style={theme.dropdownMenu()}>
                        <Icon name="info circle" style={theme.dropdownMenu()}/>
                        <span className='text' style={theme.dropdownMenu()}>About...</span>
                    </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => auth.logout()}>                    
                    <div style={theme.dropdownMenu()}>
                        <Icon name="sign out" style={theme.dropdownMenu()}/>
                        <span className='text' style={theme.dropdownMenu()}>Sign out...</span>
                    </div>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );

    return (
        <Menu inverted top className="fixed">
            {hamburger}
            <Menu.Item header className="borderless item left" style={theme.softMenu()}>
                Subscriptions
            </Menu.Item>
            <div className="right menu" >
                {loaderOrRefreshButton}
                <Menu.Item
                    name='showAll'
                    active={false}
                    onClick={() => blog.toggleShowAll()}
                    className={filterItemClasses}
                    style={theme.headerText()}
                >
                    <Icon name="filter" />
                </Menu.Item>
            </div>
        </Menu>
    );
});