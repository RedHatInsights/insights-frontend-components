import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    CardHeader,
    CardBody,
    TextContent,
    Text,
    TextList,
    TextVariants,
    TextListItemVariants,
    TextListVariants,
    TextListItem
} from '@patternfly/react-core';
import { Skeleton, SkeletonSize } from '../../../../PresentationalComponents/Skeleton';

const LoadingCard = ({ title, isLoading, items }) => {
    return (
        <Card>
            <CardHeader>
                <TextContent>
                    <Text component={ TextVariants.h1 }>
                        { title }
                    </Text>
                </TextContent>
            </CardHeader>
            <CardBody>
                <TextContent>
                    <TextList component={ TextListVariants.dl }>
                        { items.map((item, key) => (
                            <Fragment key={ key }>
                                <TextListItem component={ TextListItemVariants.dt }>
                                    { item.title }
                                </TextListItem>
                                <TextListItem component={ TextListItemVariants.dd }>
                                    { isLoading && <Skeleton size={ item.size || SkeletonSize.sm } /> }
                                    { !isLoading && (
                                        item.onClick ?
                                            <a onClick={ event => {
                                                event.preventDefault();
                                                item.onClick(event, item);
                                            } } href={ `${window.location.href}/${item.target}` }>{ item.value }</a> :
                                            item.value
                                    ) }
                                </TextListItem>
                            </Fragment>
                        )) }
                    </TextList>
                </TextContent>
            </CardBody>
        </Card>
    );
};

LoadingCard.propTypes = {
    title: PropTypes.node.isRequired,
    isLoading: PropTypes.bool,
    items: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.node,
        value: PropTypes.node,
        size: PropTypes.oneOf(Object.values(SkeletonSize))
    }))
};

LoadingCard.defaultProps = {
    isLoading: true,
    items: [
        {
            title: 'bla',
            value: 'ff'
        }
    ]
};

export default LoadingCard;
