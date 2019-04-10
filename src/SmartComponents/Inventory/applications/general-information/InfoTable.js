import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
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
        const { cells, rows, sortBy: sortByProps } = this.props;
        const { sortBy: sortByState } = this.state;
        const sortBy = sortByState.hasOwnProperty('index') ? sortByState : sortByProps;
        return (
            <Fragment>
                {
                    cells.length !== 1 ? <Table
                        aria-label="Compact Table"
                        variant={ TableVariant.compact }
                        cells={ cells }
                        rows={ rows }
                        sortBy={ sortBy }
                        onSort={ this.onSort }
                    >
                        <TableHeader />
                        <TableBody />
                    </Table> :
                        <TextContent>
                            { rows.map((row, key) => (
                                <Text component={ TextVariants.small } key={ key }>
                                    { row.title || row }
                                </Text>
                            )) }
                        </TextContent>
                }
            </Fragment>

        );
    }
}

InfoTable.propTypes = {
    rows: PropTypes.array,
    cells: PropTypes.array,
    onSort: PropTypes.func,
    sortBy: PropTypes.shape({
        index: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
        direction: PropTypes.string
    })
};
InfoTable.defaultProps = {
    cells: [],
    rows: [],
    onSort: () => undefined,
    sortBy: {}
};

export default InfoTable;
