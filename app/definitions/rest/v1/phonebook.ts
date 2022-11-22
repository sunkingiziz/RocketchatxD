import { IUserContact } from '~/definitions';

export type PhoneBookEnpoints = {
	'phonebook.getContacts': {
		GET: (params: { uid: string }) => {
			phonebook: IUserContact[];
		};
	};
	'phonebook.insertContact': {
		POST: (params: { uid: string }) => {
			newContact: IUserContact;
		};
	};
	'phonebook.updateContact': {
		POST: (params: { updatedContact: IUserContact }) => {
			phonebook: IUserContact[];
		};
	};
	'phonebook.removeContact': {
		POST: (params: { uid: string }) => {};
	};
};
