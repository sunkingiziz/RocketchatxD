import { take, fork, put, delay, race, select, cancel } from '@redux-saga/core/effects';
import * as types from '~/actions/actionsTypes';
import { contactsFailure, contactsSuccess, contactsRefresh } from '~/actions/contacts';
import getContacts from '~/lib/methods/getContacts';
import log from '~/lib/methods/helpers/log';

const handleContactsRequest = function* handleContactsRequest(uid) {
	try {
		getContacts(uid);
		yield put(contactsRefresh());
		yield delay(1000);
		yield put(contactsSuccess());
		// setTimeout(null, 300);
	} catch (e) {
		log(e);
		yield put(contactsFailure());
	}
};

const root = function* root() {
	while (true) {
		const { uid } = yield take(types.CONTACTS.REQUEST);
		const isAuthenticated = yield select(state => state.login.isAuthenticated);
		if (isAuthenticated) {
			const contactsRequestTask = yield fork(handleContactsRequest, uid);
			yield race({
				contactsSuccess: take(types.CONTACTS.SUCCESS),
				roomsFailure: take(types.ROOMS.FAILURE),
				logout: take(types.LOGOUT),
				timeout: delay(30000)
			});
			yield cancel(contactsRequestTask);
		}
	}
};

export default root;
