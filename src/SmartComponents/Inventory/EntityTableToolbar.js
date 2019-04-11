import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Filter } from './Filter';
import { TableToolbar } from '../../PresentationalComponents/TableToolbar';
import { Split, SplitItem } from '@patternfly/react-core';

const EntityTableToolbar = ({
    total,
    page,
    onRefresh,
    perPage,
    filters,
    hasItems,
    pathPrefix,
    apiBase,
    children,
    pagination,
    ...props
}) => (
    <TableToolbar results={ total } className="ins-c-inventory__table--toolbar">
        <Split>
            <SplitItem>
                <Filter {...props}
                    hasItems={hasItems}
                    filters={filters}
                    pathPrefix={pathPrefix}
                    apiBase={apiBase}
                    totalItems={total}
                />
            </SplitItem>
            <SplitItem isMain>
                {children}
            </SplitItem>
            <SplitItem>
                {pagination}
            </SplitItem>
        </Split>
    </TableToolbar>
);

EntityTableToolbar.propTypes = {
    total: PropTypes.number,
    filters: PropTypes.array,
    hasItems: PropTypes.bool,
    pathPrefix: PropTypes.number,
    apiBase: PropTypes.string
};

function mapStateToProps({ entities: { total }}, { totalItems, hasItems }) {
    return {
        total: hasItems ? totalItems : total
    };
}

export default connect(mapStateToProps)(EntityTableToolbar);
