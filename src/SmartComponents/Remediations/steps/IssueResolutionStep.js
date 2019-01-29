import React, { Component } from 'react';

import propTypes from 'prop-types';

import {
    Form,
    Radio,
    Stack,
    StackItem
} from '@patternfly/react-core';

import { Reboot } from '../../../PresentationalComponents/Reboot';
import { Battery } from '../../../PresentationalComponents/Battery';
import './IssueResolutionStep.scss';

function isSelectedByDefault ({ id }, index, issue, state) {
    const selected = state.selectedResolutions[issue.id];

    if (selected) {
        return selected === id;
    }

    return index === 0;
}

function IssueResolutionStep (props) {
    return (
        <Stack gutter='sm'>
            <StackItem><h1 className='ins-m-text__bold'>{ props.state.issuesById[props.issue.id].description }</h1></StackItem>
            <StackItem><h2>Please review the available resolution steps and make your selection:</h2></StackItem>
            <StackItem>
                <Form>
                    {
                        props.issue.resolutions.map((resolution, i) => (
                            <div className="ins-c-resolution-option" key={ resolution.id }>
                                <Radio
                                    label={
                                        <React.Fragment>
                                            { resolution.description }
                                            <Stack className='ins-c-resolution-choice__details'>
                                                { /*
                                                <StackItem>
                                                    <Battery label="Risk of Change" severity={ resolution.resolution_risk } />
                                                </StackItem>
                                                */ }
                                                { resolution.needs_reboot &&
                                                    <StackItem>
                                                        <Reboot red/>
                                                    </StackItem>
                                                }
                                            </Stack>
                                        </React.Fragment>
                                    }
                                    aria-label={ resolution.description }
                                    id={ resolution.id }
                                    name="radio"
                                    defaultChecked={ isSelectedByDefault(resolution, i, props.issue, props.state) }
                                    onChange={ () => props.onResolutionSwitch(props.issue.id, resolution.id) }
                                />
                            </div>
                        ))
                    }
                </Form>
            </StackItem>
        </Stack>
    );
}

IssueResolutionStep.propTypes = {
    issue: propTypes.object.isRequired,
    state: propTypes.object.isRequired,
    onResolutionSwitch: propTypes.func.isRequired
};

export default IssueResolutionStep;
