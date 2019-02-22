import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, TextInput, FormGroup, Form } from '@patternfly/react-core';

class RenameDialog extends Component {
    static getDerivedStateFromProps({ entity }, { isVisible, displayName }) {
        if (entity) {
            return {
                isModalOpen: isVisible !== undefined ? isVisible : true,
                displayName: displayName !== undefined ? displayName : entity.display_name,
                isVisible: undefined
            };
        }

        return {
            isModalOpen: false,
            isVisible: undefined
        };
    }

    state = {
        isModalOpen: false
    }

    handleModalToggle = () => {
        this.setState({
            isVisible: false,
            displayName: undefined
        });
    }

    handleTextInputChange = (value) => {
        this.setState({
            displayName: value
        });
    }

    render() {
        const { isModalOpen, displayName } = this.state;
        const { onUpdateEntity, entity } = this.props;
        return (
            <Modal
                title={ `Rename host ${entity && entity.display_name}` }
                className="ins-c-dialog__host-rename"
                onClose={ this.handleModalToggle }
                isOpen={ isModalOpen }
                actions={ [
                    <Button key="cancel" variant="secondary" onClick={ this.handleModalToggle }>
                        Cancel
                    </Button>,
                    <Button key="confirm" variant="primary" onClick={ () => {
                        onUpdateEntity && onUpdateEntity(displayName);
                        this.handleModalToggle();
                    } }>
                        Confirm
                    </Button>
                ] }
            >
                <Form onSubmit={ event => {
                    event.preventDefault();
                    onUpdateEntity && onUpdateEntity(displayName);
                    this.handleModalToggle();
                } }>
                    <FormGroup label="Host display name"
                        fieldId="host-display-name">
                        <TextInput
                            id="host-display-name"
                            value={ displayName }
                            type="text"
                            onChange={ this.handleTextInputChange }
                            aria-label="Host display name"
                        />
                    </FormGroup>
                </Form>
            </Modal>);
    }
}

RenameDialog.propTypes = {
    entity: PropTypes.object,
    onUpdateEntity: PropTypes.func
};

RenameDialog.propTypes = {
    onUpdateEntity: () => undefined
};

export default RenameDialog;
