import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingCard from './LoadingCard';
import { repositoriesMapper, productsMapper } from './dataMapper';
import { subscriptionsSelector } from './selectors';

const SubscriptionCard = ({ detailLoaded, subscriptions, handleClick }) => (<LoadingCard
    title="Subscriptions"
    isLoading={ !detailLoaded }
    items={ [
        {
            title: 'Red Hat products',
            value: subscriptions.rhProducts ? `${subscriptions.rhProducts.length} products` : 'None',
            target: 'red_hat_products',
            onClick: () => handleClick(
                'Red Hat products',
                productsMapper(subscriptions.rhProducts)
            )
        },
        { title: 'Status', value: subscriptions.status },
        { title: 'Auto-attached', value: subscriptions.autoAttached },
        { title: 'Katello agent', value: '' },
        {
            title: 'Repositories',
            value: subscriptions.repositories ? `${subscriptions.repositories.length} enabled` : 'None',
            target: 'repositories',
            onClick: () => {
                handleClick(
                    'Repositories',
                    repositoriesMapper(subscriptions.repositories)
                );
            }
        }
    ] }
/>);

SubscriptionCard.propTypes = {
    detailLoaded: PropTypes.bool,
    handleClick: PropTypes.func,
    subscriptions: PropTypes.shape({
        rhProducts: PropTypes.array,
        status: PropTypes.string,
        autoAttached: PropTypes.string,
        repositories: PropTypes.array
    })
};
SubscriptionCard.defaultProps = {
    detailLoaded: false,
    handleClick: () => undefined
};

export default connect(({
    entityDetails: {
        systemProfile
    }
}) => ({
    detailLoaded: systemProfile && systemProfile.loaded,
    subscriptions: subscriptionsSelector(systemProfile)
}))(SubscriptionCard);
