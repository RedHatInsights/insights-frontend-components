<<<<<<< HEAD
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Card,
    CardHeader,
    CardBody,
    TextContent,
    Text,
    TextVariants,
    Grid,
    GridItem,
    GutterSize
} from '@patternfly/react-core';
=======
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TextContent, Text, TextVariants, Grid, GridItem, GutterSize } from '@patternfly/react-core';
>>>>>>> Add General info and get data from correct places
import { Table } from '../../../PresentationalComponents/Table';
import { Pagination } from '../../../PresentationalComponents/Pagination';
import './general-information.scss';

class GeneralInformation extends Component {
    render() {
        const { entity } = this.props;
        const facts = entity.facts.qpc || entity.facts.inventory;
        const timeZone = new Date(entity.created).toString().split(' GMT').slice(1)[0];
        return (
            <Grid sm={ 6 } md={ 6 } lg={ 6 } gutter={ GutterSize.md }>
                <GridItem>
                    <TextContent>
                        <Card>
                            <CardHeader>
                                <Text component={TextVariants.h1}>System</Text>
                            </CardHeader>
                            <CardBody>
                                <div>
                                    <span>Manufacturer:</span>
                                    <span>{facts.virtualized_type || 'Unknown'}</span>
                                </div>
                                <div>
                                    <span>Release:</span>
                                    <span>{facts.os_release || 'Unknown'}</span>
                                </div>
                                <div>
                                    <span>Server Type:</span>
                                    <span>{facts.infrastructure_type || 'Unknown'}</span>
                                </div>
                                <div>
                                    <span>Time Zone:</span>
                                    <span>{timeZone && `${timeZone.slice(0, 3)}:${timeZone.slice(3)}`}</span>
                                </div>
                            </CardBody>
                        </Card>
                    </TextContent>
                </GridItem>
                <GridItem>
                    <TextContent>
                        <Card>
                            <CardHeader>
                                <Text component={TextVariants.h1}>Bios</Text>    
                            </CardHeader>
                            <CardBody>
                                <div>
                                    <span>UUID:</span>
                                    <span>{entity.bios_uuid || 'Unknown'}</span>
                                </div>
                            </CardBody>
                        </Card>
                    </TextContent>
                </GridItem>
                <GridItem span={ 12 }>
                    <TextContent>
                        <Card>
                            <CardHeader>
                                <Text component={TextVariants.h1}>Network</Text>
                            </CardHeader>
                            <CardBody>
                                <Table rows={[]}
                                    header={[
                                        { title: 'Process Name', hasSort: false },
                                        { title: 'IP Address', hasSort: false },
                                        { title: 'Port', hasSort: false }
                                    ]}
                                    footer={<Pagination numberOfItems={0} />}
                                />
                            </CardBody>
                        </Card>
                    </TextContent>
                </GridItem>
            </Grid>
        );
    }
}

GeneralInformation.propTypes = {
    entity: PropTypes.shape({
        created: PropTypes.string,
        // eslint-disable-next-line camelcase
        bios_uuid: PropTypes.string,
        facts: PropTypes.oneOfType([
            PropTypes.shape({
                inventory: PropTypes.shape({})
            }),
            PropTypes.shape({
                qpc: PropTypes.shape({})
            })
        ])
    })
};
GeneralInformation.defaultProps = {
    entity: {
        facts: {
            inventory: {}
        }
    }
};

const mapStateToProps = ({ entityDetails: { entity }}) => ({ entity });

export default connect(mapStateToProps)(GeneralInformation);
