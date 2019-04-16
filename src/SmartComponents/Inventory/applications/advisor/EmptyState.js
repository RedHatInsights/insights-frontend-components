import React from 'react';
import {
    Bullseye,
    Title,
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody
} from '@patternfly/react-core';
import { ChartSpikeIcon, CubesIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

const AdvisorEmptyState = ({ title, text, ...props }) => (<Bullseye { ...props }>
    <EmptyState>
        <EmptyStateIcon icon={ ChartSpikeIcon || CubesIcon } size="lg" />
        <Title headingLevel="h5" size="lg">{ title }</Title>
        <EmptyStateBody>
            { text }
        </EmptyStateBody>
        <Button variant="primary">Try it free</Button>
    </EmptyState>
</Bullseye>);

AdvisorEmptyState.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string
};

AdvisorEmptyState.defaultProps = {
    title: '',
    text: ''
};

export default AdvisorEmptyState;
