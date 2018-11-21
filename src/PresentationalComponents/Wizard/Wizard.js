import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Modal, Button } from '@patternfly/react-core';

class Wizard extends Component {

    constructor () {
        super();
        this.state = {
            currentStep: 0
        };
        this.handlePreviousModalStep = this.handlePreviousModalStep.bind(this);
        this.handleNextModalStep = this.handleNextModalStep.bind(this);
        this.handleOnClose = this.handleOnClose.bind(this);
    };

    handleNextModalStep() {
        this.setState(({ currentStep }) => ({
            currentStep: currentStep + 1
        }));
    }

    handlePreviousModalStep() {
        this.setState(({ currentStep }) => ({
            currentStep: currentStep - 1
        }));
    }

    // On modal close, reset currentStep back to the initial step, the call modalToggle(PF)
    handleOnClose() {
        this.setState({ currentStep: 0 });
        this.props.handleModalToggle && this.props.handleModalToggle();
    }

    render() {

        if (this.props.steps !== this.props.content.length) {
            // eslint-disable-next-line
            console.error(`[WIZARD] You specified ${this.props.steps} steps, but only passed content for ${this.props.content.length} steps`);
        }

        let renderModalActions =  [
            <Button key="cancel" variant="secondary" onClick={ this.handleOnClose }>
            Cancel
            </Button>,
            // Conditionally render 'previous' button if not on first page
            this.state.currentStep > 0
                ? <Button key="previous" variant="secondary" onClick={ this.handlePreviousModalStep }> Previous </Button>
                : null,
            // Conditionally render 'confirm' button if on last page
            this.state.currentStep < this.props.steps - 1
                ? <Button key="continue" variant="primary" onClick={ this.handleNextModalStep }> Continue </Button>
                : <Button key="confirm" variant="primary" onClick={ this.handleOnClose }> Confirm </Button>
        ];

        return (
            <Modal
                isLarge = { this.props.isLarge }
                title= { this.props.title }
                className= { this.props.className }
                isOpen={ this.props.isOpen }
                onClose={ this.handleOnClose }
                actions={ renderModalActions }>
                { this.props.content[this.state.currentStep] }
            </Modal>
        );
    }
}

Wizard.propTypes = {
    isLarge: PropTypes.bool,
    title: PropTypes.string,
    className: PropTypes.string,
    isOpen: PropTypes.any,
    handleModalToggle: PropTypes.any,
    steps: PropTypes.number,
    content: PropTypes.array
};

export default Wizard;
