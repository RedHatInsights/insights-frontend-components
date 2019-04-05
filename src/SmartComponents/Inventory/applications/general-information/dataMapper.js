/* eslint-disable camelcase */

import React from 'react';
import {
    OutlinedCheckSquareIcon,
    OutlinedSquareIcon,
    OutlinedQuestionCircleIcon,
    OutlinedArrowAltCircleUpIcon,
    OutlinedArrowAltCircleDownIcon
} from '@patternfly/react-icons';
import { sortable } from '@patternfly/react-table';
import { SortByDirection } from '@patternfly/react-table';

const statusHelper = {
    DOWN: <OutlinedArrowAltCircleUpIcon className="ins-c-inventory__detail--up" />,
    UP: <OutlinedArrowAltCircleDownIcon className="ins-c-inventory__detail--down" />
};

export const diskMapper = (devices = []) => ({
    cells: [
        {
            title: 'Device',
            transforms: [ sortable ]
        },
        {
            title: 'Label',
            transforms: [ sortable ]
        },
        {
            title: 'Mount point',
            transforms: [ sortable ]
        },
        {
            title: 'Options',
            transforms: [ sortable ]
        },
        {
            title: 'Type',
            transforms: [ sortable ]
        }
    ],
    rows: devices.map(({
        device,
        mount_point,
        options,
        type
    }) => [
        device,
        mount_point,
        Object.values(options),
        type
    ])
});

export const productsMapper = (products = []) => ({
    cells: [
        {
            title: 'Name',
            transforms: [ sortable ]
        },
        'Status'
    ],
    rows: products.map(product => ([
        product.name,
        {
            title: statusHelper[product.status] ||
                <OutlinedQuestionCircleIcon className="ins-c-inventory__detail--unknown" />
        }
    ]))
});

export const interfaceMapper = (data = []) => ({
    cells: [
        {
            title: 'MAC address',
            transforms: [ sortable ]
        },
        {
            title: 'MTU',
            transforms: [ sortable ]
        },
        {
            title: 'Name',
            transforms: [ sortable ]
        },
        'State',
        {
            title: 'Type',
            transforms: [ sortable ]
        }
    ],
    rows: data.map(item => ([
        item.mac_address,
        item.mtu,
        item.name,
        {
            title: statusHelper[item.state] ||
                <OutlinedQuestionCircleIcon className="ins-c-inventory__detail--unknown" />
        },
        item.type
    ]))
});

export const repositoriesMapper = (repositories = []) => ({
    cells: [
        {
            title: 'Name',
            transforms: [ sortable ]
        },
        'Enabled',
        'GPG check'
    ],
    rows: repositories.map(repository => ([
        {
            title: <a href={ repository.base_url } target="_blank" rel="noopener noreferrer">{ repository.name }</a>,
            sortValue: repository.name
        },
        { title: repository.enabled ? <OutlinedCheckSquareIcon /> : <OutlinedSquareIcon /> },
        { title: repository.gpgcheck ? <OutlinedCheckSquareIcon /> : <OutlinedSquareIcon /> }
    ]))
});

export const generalMapper = (data = [], title = '') => ({
    cells: [{
        title,
        transforms: [ sortable ]
    }],
    rows: data.map(item => ([ item ]))
});
