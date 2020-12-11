import React from 'react';

export const SimpleLoader = (props: {message?: string, right?: boolean}) => {
    if (props.message) {
        return (
            <div className="ui grid container">
                <div className="ui active dimmer">
                    <p/>
                    <div className="ui text loader">{props.message}</div>
                </div>
            </div>
        );
    } else {
        if (props.right && props.right === true) {
            return (
                <div className="item right">
                    <div className="ui tiny active inline loader" />
                </div>
            );
        } else {
            return (
                <div className="item">
                    <div className="ui tiny active inline loader" />
                </div>
            );
        }
    }
};