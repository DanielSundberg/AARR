import * as React from "react";
import { footerErrorStyle, fullscreenBelowMenuStyle } from './CustomStyles';

export enum ErrorMessageType {
    Header, 
    Footer
};

export const ErrorMessage = (props: {message: string, type?: ErrorMessageType}) => {

    const style = props.type && props.type == ErrorMessageType.Footer ? footerErrorStyle : fullscreenBelowMenuStyle;

    if (props.message.length > 0) {
        return ( 
            <div style={style}>
                <div className="ui negative message">
                    <i className="close icon" />
                    <i className="warning icon" />{props.message}
                </div>
            </div>
        );
    } else {
        return null;
    }
};
