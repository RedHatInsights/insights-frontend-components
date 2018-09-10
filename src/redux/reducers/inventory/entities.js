import { ACTION_TYPES, SELECT_ENTITY, CHANGE_SORT, FILTER_ENTITIES } from '../../action-types';
import { mergeArraysByKey } from '../../../Utilities/helpers';
import { SortDirection } from '../../../PresentationalComponents/Table';
import sortBy from 'lodash/sortBy';

export const defaultState = { loaded: false };

const defaultColumns = [
  {key: 'display_name', title: 'System Name'},
  {key: 'account', title: 'Account'}
]

function entitiesPending(state) {
    return {
        ...state,
        loaded: false
    };
}

function filterEntities(state, {payload: {key, filterString}}) {
    const entities = filterString ?
      state.rows.filter(item => item[key] && item[key].indexOf(filterString) !== -1) :
      [...state.rows];
    return {
        ...state,
        entities: entities
    }
}

function entitiesLoaded(state, { payload }) {
    const entities = mergeArraysByKey([state.rows, payload]);
    return {
        ...state,
        loaded: true,
        columns: mergeArraysByKey([state.columns, defaultColumns], 'key'),
        rows: entities,
        entities
    }
}

function selectEntity(state, { payload: { id, selected } }) {
    const ents = [...state.rows];
    ents.find(entity => entity.id === id).selected = selected;
    return {
        ...state,
        entities: ents
    }
}

function changeSort(state, {payload: {key, direction}}) {
    const sortedRows = sortBy(state.entities, [e => e[key]]);
    return {
        ...state,
        entities: SortDirection.up === direction ? sortedRows : sortedRows.reverse(),
    }
}

export default {
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: entitiesPending,
    [ACTION_TYPES.LOAD_ENTITIES_FULFILLED]: entitiesLoaded,
    [SELECT_ENTITY]: selectEntity,
    [CHANGE_SORT]: changeSort,
    [FILTER_ENTITIES]: filterEntities
};
