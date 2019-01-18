import * as React from "react";
import { belowMainMenuStyle } from '../Model/CustomStyles';

interface FooterErrorMessageProps {
    errorMessage: string;
    dismissError(): void;
}

export const HeaderErrorMessage: React.SFC<FooterErrorMessageProps> = (props) => {
    if (props.errorMessage.length > 0) {
        return ( 
            <div style={belowMainMenuStyle}>
                <div className="ui negative message">
                    <i className="close icon" onClick={() => props.dismissError()} />
                    <i className="warning icon" />{props.errorMessage}
                </div>
            </div>
        );
    } else {
        return null;
    }
};
