import { Action } from 'redux';

import { CONTACTS } from './actionsTypes';

export interface IContactsRequest extends Action {
	uid: string;
}

export interface IContactsFailure extends Action {
	err: Record<string, any> | string;
}

export function contactsRequest(uid: string): IContactsRequest {
	return {
		type: CONTACTS.REQUEST,
		uid
	};
}

export function contactsSuccess(): Action {
	return {
		type: CONTACTS.SUCCESS
	};
}

export function contactsFailure(err: string): IContactsFailure {
	return {
		type: CONTACTS.FAILURE,
		err
	};
}

export function contactsRefresh(): Action {
	return {
		type: CONTACTS.REFRESH
	};
}

export type IContactsAction = IContactsRequest & IContactsFailure;
