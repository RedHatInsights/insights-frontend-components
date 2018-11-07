
import get from 'lodash/get';
import { addNotification } from '../../redux/actions/notifications';

const shouldDispatchDefaultError = ({
    isRejected,
    hasCustomNotification,
    noErrorOverride,
    dispatchDefaultFailure
}) => isRejected && !hasCustomNotification && !noErrorOverride && dispatchDefaultFailure;

const createNotificationsMiddleware = (options = {}) => {
    const defaultOptions = {
        dispatchDefaultFailure: true,
        pendingSuffix: '_PENDING',
        fulfilledSuffix: '_FULFILLED',
        rejectedSuffix: '_REJECTED',
        autoDismiss: true,
        dismissDelay: 5000,
        errorTitleKey: 'title',
        errorDescriptionKey: 'detail'
    };
    const middlewareOptions = { ...defaultOptions, ...options };

    const matchPending = type => type.match(new RegExp(`^.*${middlewareOptions.pendingSuffix}$`));
    const matchFulfilled = type => type.match(new RegExp(`^.*${middlewareOptions.fulfilledSuffix}$`));
    const matchRejected = type => type.match(new RegExp(`^.*${middlewareOptions.rejectedSuffix}$`));

    const defaultNotificationOptions = {
        dismissable: !middlewareOptions.autoDismiss,
        dismissDelay: middlewareOptions.dismissDelay
    };

    return ({ dispatch }) => next => action => {
        const { meta, type } = action;
        if (meta && meta.flashMessage) {
            const { flashMessage } = meta;
            if (matchPending(type) && flashMessage.pending) {
                dispatch(addNotification({ ...defaultNotificationOptions, ...flashMessage.pending }));
            } else if (matchFulfilled(type) && flashMessage.fulfilled) {
                dispatch(addNotification({ ...defaultNotificationOptions, ...flashMessage.fulfilled }));
            } else if (matchRejected(type) && flashMessage.rejected) {
                dispatch(addNotification({ ...defaultNotificationOptions, ...flashMessage.rejected }));
            }
        }

        if (shouldDispatchDefaultError({
            isRejected: matchRejected(type),
            hasCustomNotification: meta && meta.flashMessage && meta.flashMessage.rejected,
            noErrorOverride: meta && meta.noError,
            dispatchDefaultFailure: middlewareOptions.dispatchDefaultFailure
        })) {
            dispatch(addNotification({
                variant: 'danger',
                title: get(action.payload, middlewareOptions.errorTitleKey), description: get(action.payload, middlewareOptions.errorDescriptionKey),
                dismissable: true
            }));
        }

        next(action);
    };

};

export default createNotificationsMiddleware;
