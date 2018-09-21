import { applyReducerHash } from '../../Utilities/ReducerRegistry';
import entitiesReducer, { defaultState as entitiesDefault } from './inventory/entities';
import entityDetailsReducer, { defaultState as entityDefault } from './inventory/entityDetails';

export { entitiesReducer, entityDetailsReducer };

<<<<<<< HEAD
export function mergeWithEntities(additionalReducers = Function.prototype) {
    return ({
        entities: (state, payload) => ({
            ...additionalReducers({
                ...applyReducerHash({
                    ...entitiesReducer
                }, entitiesDefault)(state, payload)
            }, payload)
        })
    });
}

export function mergeWithDetail(additionalReducers = Function.prototype) {
    return ({
        entityDetails: (state, payload) => ({
            ...additionalReducers({
                ...applyReducerHash({
                    ...entityDetailsReducer
                }, entityDefault)(state, payload)
            }, payload)
        })
    });
=======
export function mergeWithEntities(additionalReducers = (state) => state) {
  return ({
    entities: (state, payload) => ({
      ...additionalReducers({
        ...applyReducerHash({
          ...entitiesReducer,
        }, entitiesDefault)(state, payload)
      }, payload)
    })
  })
}

export function mergeWithDetail(additionalReducers = (state) => state) {
  return ({
    entityDetails: (state, payload) => ({
      ...additionalReducers({
        ...applyReducerHash({
          ...entityDetailsReducer,
        }, entityDefault)(state, payload)
      }, payload)
    })
  })
>>>>>>> Add documentation how to use hot loaded app and fix multiple bugs when testing it
}
