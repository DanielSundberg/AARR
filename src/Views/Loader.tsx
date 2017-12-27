import * as React from 'react';

class Loader extends React.Component {
    render() {
        return (
        <div className="ui grid container">
            <div className="ui active dimmer">
                <p/>
                <div className="ui text loader">Fetching data...</div>
            </div>
        </div>);
    }
}

export default Loader;