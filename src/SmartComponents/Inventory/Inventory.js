import React, { createContext, Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import routerParams from '../../Utilities/RouterParams';
import InventoryList from './InventoryList';
import InventoryDetail from './InventoryDetail';
import { Filter } from './Filter';
import Pagination from './Pagination';
import { Card, CardBody, CardHeader, CardFooter } from '@patternfly/react-core';

export const InventoryContext = createContext('inventory');

class InventoryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onRefreshData: () => undefined
        };
    }

    render() {
        const { items = [], pathPrefix = 0, filters, apiBase, showHealth, ...props } = this.props;
        return (
            <InventoryContext.Provider value={ {
                onRefreshData: this.state.onRefreshData,
                setRefresh: (onRefreshData) => this.setState({
                    onRefreshData
                })
            } }>
                <Card>
                    <CardHeader>
                        <Filter { ...props } filters={ filters } pathPrefix={ pathPrefix } apiBase={ apiBase } />
                    </CardHeader>
                    <CardBody>
                        <InventoryList
                            { ...props }
                            items={ items }
                            pathPrefix={ pathPrefix }
                            apiBase={ apiBase }
                            showHealth={ showHealth }
                        />
                    </CardBody>
                    <CardFooter>
                        <Pagination />
                    </CardFooter>
                </Card>
            </InventoryContext.Provider>
        );
    }
}

const InventoryItem = ({ root, pathPrefix = 0, apiBase, ...props }) => (
    <InventoryDetail { ...props } root={ root } pathPrefix={ pathPrefix } apiBase={ apiBase } />
);

// const InventoryPagination = ({ pathPrefix = 0, apiBase, ...props }) => (
//     <Pagination {...props} pathPrefix={pathPrefix} apiBase={apiBase} />
// )

const Inventory = ({ match, noTable = false, items = [], pathPrefix = 0, apiBase }) => {
    return (
        <Switch>
            {
                !noTable &&
                <Route exact path={ match.url } render={ props => (
                    <InventoryTable { ...props } items={ items } pathPrefix={ pathPrefix } apiBase={ apiBase } />
                ) } />
            }
            <Route path={ `${match.url}${match.url.substr(-1, 1) === '/' ? '' : '/'}:inventoryId` }
                render={ props => (
                    <InventoryItem { ...props } root={ match.url } pathPrefix={ pathPrefix } apiBase={ apiBase } />
                ) }
            />
        </Switch>
    );
};

export default routerParams((Inventory));

export function inventoryConnector() {
    return {
        InventoryTable,
        InventoryDetail: InventoryItem
    };
}
