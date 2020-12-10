import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';
import { useStores } from '../stores/RootStore';

export const ThemeBackground = observer(({children}: any) => {
    const { theme } = useStores();

    useEffect(() => {
        autorun(() => document.body.style.backgroundColor = theme.colors.listBackground);
    });

    return (<div>{children}</div>);
});