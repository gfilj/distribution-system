import React from 'react';
import {Menu, Icon} from 'antd';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

export default class SiderMenu extends React.PureComponent {
    static propTypes = {
        menus: PropTypes.array,
        menuClick: PropTypes.func,
        theme: PropTypes.string,
        mode: PropTypes.string,
        selectedKeys: PropTypes.array,
        openKeys: PropTypes.array,
        onOpenChange: PropTypes.func
    }

    render() {
        const renderMenuItem =
            ({key, title, icon, link, ...props}) =>
                <Menu.Item
                    key={key || link}
                    {...props}
                >
                    <Link to={link || key}>
                        {icon && <Icon type={icon}/>}
                        <span className="nav-text">{title}</span>
                    </Link>
                </Menu.Item>;

        const renderSubMenu =
            ({key, title, icon, link, sub, ...props}) =>
                <Menu.SubMenu
                    key={key || link}
                    title={
                        <span>
                    {icon && <Icon type={icon}/>}
                            <span className="nav-text">{title}</span>
                </span>
                    }
                    {...props}
                >
                    {sub && sub.map(item => renderMenuItem(item))}
                </Menu.SubMenu>;
        const {
            menus,
            menuClick,
            theme,
            mode,
            selectedKeys,
            openKeys,
            onOpenChange
        } = this.props;
        return (
            <Menu
                onClick={menuClick}
                theme={theme}
                mode={mode}
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
            >
                {menus && menus.map(
                    item => item.sub && item.sub.length ?
                        renderSubMenu(item) : renderMenuItem(item)
                )}
            </Menu>
        );
    }
}