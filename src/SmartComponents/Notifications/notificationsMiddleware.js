import { addNotification } from '../../redux/actions/notifications';

const matchPending = type => type.match(/^.+_PENDING$/);
const matchFulfilled = type => type.match(/^.+_FULFILLED$/);
const matchRejected = type => type.match(/^.+_REJECTED$/);

const notificationMiddleware = ({ dispatch }) => next => (action) => {
    const { meta, type } = action;
    if (meta && meta.flashMessage) {
        const { flashMessage } = meta;
        if (matchPending(type) && flashMessage.pending) {
            dispatch(addNotification({ ...flashMessage.pending }));
        } else if (matchFulfilled(type) && flashMessage.fulfilled) {
            dispatch(addNotification({ ...flashMessage.fulfilled }));
        } else if (matchRejected(type) && flashMessage.rejected) {
            dispatch(addNotification({ ...flashMessage.rejected }));
        }
    }

    if ((matchRejected(type) && !meta) || matchRejected(type) && meta && !meta.noError && meta.flashMessage && !meta.flashMessage.rejected) {
        dispatch(addNotification({
            variant: 'danger',
            title: action.payload.title, description: action.payload.detail,
            dismissable: true
        }));
    }

    next(action);
};

export default notificationMiddleware;
