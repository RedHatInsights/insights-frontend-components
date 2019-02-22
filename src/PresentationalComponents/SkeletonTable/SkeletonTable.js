import React from 'react';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Skeleton, SkeletonSize } from '../Skeleton';
import PropTypes from 'prop-types';

class SkeletonTable extends React.Component {
    createColumns = () => {
        const { colSize } = this.props;
        return [
            ...Array(colSize)
        ].map(() => ({ title: <Skeleton size={SkeletonSize.sm} /> }))
    }

    createRows = () => {
        const { colSize, rowSize } = this.props;
        return [
            ...Array(rowSize)
        ].map(() => [...Array(colSize)].map(() => ({ title: <Skeleton size={SkeletonSize.md} /> })))
    }

    render() {
        return (
            <Table cells={this.createColumns()} rows={this.createRows()} aria-label="Loading">
                <TableHeader />
                <TableBody />
            </Table>
        );
    }
}

SkeletonTable.propTypes = {
    colSize: PropTypes.number.isRequired,
    rowSize: PropTypes.number
}

SkeletonTable.defaultProps = {
    rowSize: 0
}


export default SkeletonTable;
