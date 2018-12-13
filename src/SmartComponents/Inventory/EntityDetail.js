import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Title, Grid, GridItem, Label, Dropdown, DropdownPosition, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { BulletList } from 'react-content-loader';
import get from 'lodash/get';
import { connect } from 'react-redux';
import ApplicationDetails from './ApplicationDetails';

class EntityDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    getFact = (path) => {
        const { entity } = this.props;
        return get(entity, path, 'unknown');
    }

    toggleActions = (collapsed) => {
        this.setState({
            isOpen: collapsed
        });
    }
    render() {
        const { loaded, entity } = this.props;
        const { isOpen } = this.state;
        if (!loaded) {
            return (
                <div>
                    <BulletList/>
                </div>
            );
        }

        return (
            <div className="ins-entity-detail">
                <Grid className="ins-entity-header">
                    <GridItem md={ 6 }>
                        <Title size='2xl'>{ entity && entity.display_name }</Title>
                    </GridItem>
                    <GridItem md={ 6 }>
                        <Dropdown
                            onSelect={ this.onSelect }
                            toggle={ <DropdownToggle onToggle={ this.toggleActions }>Actions</DropdownToggle> }
                            isOpen={ isOpen }
                            position={ DropdownPosition.right }
                            dropdownItems={ [
                                <DropdownItem key="1">Some action</DropdownItem>
                            ] }
                        />
                    </GridItem>
                </Grid>
                <Grid className="ins-entity-facts">
                    <GridItem md={ 6 }>
                        <div>
                            <span>
                                Hostname:
                            </span>
                            <span>
                                { this.getFact('facts.inventory.hostname') }
                            </span>
                        </div>
                        <div>
                            <span>
                                UUID:
                            </span>
                            <span>
                                { this.getFact(`canonical_facts['machine_id']`) }
                            </span>
                        </div>
                        <div>
                            <span>
                                System:
                            </span>
                            <span>
                                { this.getFact('facts.inventory.release') }
                            </span>
                        </div>
                    </GridItem>
                    <GridItem md={ 6 }>
                        <div>
                            <span>
                                Last Check-in:
                            </span>
                            <span>
                                { (new Date(this.getFact('updated'))).toLocaleString() }
                            </span>
                        </div>
                        <div>
                            <span>
                                Registered:
                            </span>
                            <span>
                                { (new Date(this.getFact('created'))).toLocaleString() }
                            </span>
                        </div>
                    </GridItem>
                </Grid>
                <Grid className="ins-entity-tags">
                    { entity && entity.tags && Object.values(entity.tags).map((oneTag, key) => (
                        <GridItem span={ 1 } key={ key } data-key={ key } widget="tag">
                            <Label isCompact>
                                <TimesIcon />{ oneTag }
                            </Label>
                        </GridItem>
                    )) }
                </Grid>
                <ApplicationDetails />
            </div>
        );
    }
}

EntityDetails.propTypes = {
    loaded: PropTypes.bool.isRequired,
    entity: PropTypes.object
};

EntityDetails.defualtProps = {
    entity: {}
}

export default connect(({ entityDetails }) => ({ ...entityDetails }))(EntityDetails);
