import { AppDispatch } from '../lib/redux/store';
import { toggleModal } from '../lib/redux/noteSlice';

export const toggleModalService = (modalObj: {
  name: string;
  visible: boolean;
}) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(toggleModal(modalObj));
    } catch (error) {
      return {
        message: 'Can not toggle the current modal',
        type: 'error',
      };
    }
  };
};
