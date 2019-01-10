import React, { Component } from 'react';
import propTypes from 'prop-types';
import { routerParams } from '../../../../index';
import SystemPolicyCards from './SystemPolicyCards';
import SystemRulesTable from './SystemRulesTable';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import { Card, CardBody } from '@patternfly/react-core';

const COMPLIANCE_API_ROOT = '/r/insights/platform/compliance';

const QUERY = gql`
query System($systemId: String!){
    system(id: $systemId) {
        id
        name
        profiles {
            name
            ref_id
            compliant(system_id: $systemId)
            rules_failed(system_id: $systemId)
            rules_passed(system_id: $systemId)
            last_scanned(system_id: $systemId)
            rules {
                title
                severity
                rationale
                ref_id
                description
                compliant(system_id: $systemId)
            }
        }
	}
}
`;

const client = new ApolloClient({
    link: new HttpLink({ uri: COMPLIANCE_API_ROOT + '/graphql' }),
    cache: new InMemoryCache()
});

const SystemQuery = ({ data, loading }) => (
    <React.Fragment>
        <SystemPolicyCards policies={ data.system && data.system.profiles } loading={ loading } />
        <br/>
        <Card>
            <CardBody>
                <SystemRulesTable profileRules={ data.system && data.system.profiles.map((profile) => ({
                    profile: profile.name,
                    rules: profile.rules
                })) }
                loading={ loading }
                />
            </CardBody>
        </Card>
    </React.Fragment>
);

class SystemDetails extends Component {
    componentWillUnmount() {
        client.clearStore();
    }

    render() {
        const { match: { params: { inventoryId }}} = this.props;
        return (
            <ApolloProvider client={ client }>
                <Query query={ QUERY } variables={ { systemId: inventoryId } }>
                    { ({ data, error, loading }) => (
                        error ? `Oops! Error loading System data: ${error}` :
                            <SystemQuery data={ data } error={ error } loading={ loading } />
                    ) }
                </Query>
            </ApolloProvider>
        );
    }
}

SystemDetails.propTypes = {
    match: propTypes.shape({
        params: propTypes.shape({
            inventoryId: propTypes.string
        })
    })
};

SystemDetails.defaultProps = {
    match: {
        params: {}
    }
};

SystemQuery.propTypes = {
    data: propTypes.shape({
        system: propTypes.shape({
            profiles: propTypes.array
        })
    }),
    loading: propTypes.bool
};

SystemQuery.defaultProps = {
    data: {
        system: {
            profiles: []
        }
    },
    loading: true
};

export default routerParams(SystemDetails);
