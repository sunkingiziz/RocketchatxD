import { CONTACTS } from '~/actions/actionsTypes';
import { IContactsAction } from '~/actions/contacts';

export interface IContacts {
	isFetching: boolean;
	refreshing: boolean;
	failure: boolean;
	errorMessage: Record<string, any> | string;
}

export const initialState: IContacts = {
	isFetching: false,
	refreshing: false,
	failure: false,
	errorMessage: {}
};
export default function contacts(state = initialState, action: IContactsAction): IContacts {
	switch (action.type) {
		case CONTACTS.REQUEST:
			return {
				...state,
				isFetching: true,
				failure: false,
				errorMessage: {}
			};
		case CONTACTS.SUCCESS:
			return {
				...state,
				isFetching: false,
				refreshing: false
			};
		case CONTACTS.FAILURE:
			return {
				...state,
				isFetching: false,
				refreshing: false,
				failure: true,
				errorMessage: action.err
			};
		case CONTACTS.REFRESH:
			return {
				...state,
				isFetching: true,
				refreshing: true
			};
		default:
			return state;
	}
}
