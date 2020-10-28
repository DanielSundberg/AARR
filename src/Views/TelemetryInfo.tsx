import * as React from 'react';

// tslint:disable-next-line
export const TelemetryInfo: React.FunctionComponent<{style: any}> = ({style}) => {
    return (
        <div className="ui info message" style={style}>
            <h4><i className="info circle large icon"/>Usage statistics</h4>
            
            <div className="ui bulleted list">
                <div className="item">
                    Only usage statistics such as the number of times the app has been
                    opened and how much time that has been spent reading articles will
                    be collected.
                </div>
                <div className="item">
                    Personal information such as email, ip address, age, nationality
                    and so on will not be collected.
                </div>
                <div className="item">
                    The collected information will be used to improve the user experience
                    in the AARR reader app.
                </div>
                <div className="item">
                    The source code of the statistics analysis app is available on github:<br/>
                    <a href="https://github.com/DanielSundberg/AARR-stat">AARR-stat on Github</a>.
                </div>
            </div>
        </div>
    );
};