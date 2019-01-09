import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import { routerParams } from '../../../../index';
import SystemPolicyCard from '../SystemPolicyCard';
import propTypes from 'prop-types';

class SystemPolicyCards extends React.Component {
    render() {
        const { policies } = this.props;
        if (!policies) {
            return ('Loading policy information...');
        } else {
            return (
                <div id="system_policy_cards">
                    <Grid gutter='md'>
                        { policies.map((policy, i) => (
                            <GridItem span={4} key={i}>
                                <SystemPolicyCard policy={policy} />
                            </GridItem>
                        ))}
                    </Grid>
                </div>
            );
        }
    }
}

SystemPolicyCards.propTypes = {
    policies: propTypes.array
};

export default routerParams(SystemPolicyCards);