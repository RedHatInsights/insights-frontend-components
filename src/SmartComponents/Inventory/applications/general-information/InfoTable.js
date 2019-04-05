import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table, TableHeader, TableBody, TableVariant } from '@patternfly/react-table';

class InfoTable extends Component {
    state = {
        sortBy: {}
    };

    onSort = (event, index, direction) => {
        this.props.onSort(event, index, direction);
        this.setState({
            sortBy: {
                index,
                direction
            }
        });
    }

    render() {
        const { cells, rows } = this.props;
        const { sortBy } = this.state;
        return (
            <Fragment>
                <Table
                    aria-label="Compact Table"
                    variant={ TableVariant.compact }
                    cells={ cells }
                    rows={ rows }
                    sortBy={ sortBy }
                    onSort={ this.onSort }
                >
                    <TableHeader />
                    <TableBody />
                </Table>
            </Fragment>

        );
    }
}

InfoTable.propTypes = {
    rows: PropTypes.array,
    cells: PropTypes.array,
    onSort: PropTypes.func
};
InfoTable.defaultProps = {
    cells: [],
    rows: [],
    onSort: () => undefined
};

export default InfoTable;
