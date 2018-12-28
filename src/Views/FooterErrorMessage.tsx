import * as React from "react";
import { footerErrorStyle } from '../Model/gridStyle';

interface FooterErrorMessageProps {
    errorMessage: string;
    dismissError(): void;
}

const FooterErrorMessage: React.SFC<FooterErrorMessageProps> = (props) => {
    if (props.errorMessage.length > 0) {
        return ( 
            <div style={footerErrorStyle}>
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

export default FooterErrorMessage;