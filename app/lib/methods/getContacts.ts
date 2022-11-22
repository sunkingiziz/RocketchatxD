import { Collection } from '@nozbe/watermelondb';

import { TUserContactModel } from '~/definitions/IUser';
import database from '~/lib/database';
import { Services } from '~/lib/services';

import log from './helpers/log';
// 1. load contacts:
// 	network -> api
// 	error -> db

// => getContacts()

export default async function getContacts(uid: string) {
	const db = database.active;
	const contactCollection: Collection<TUserContactModel> = db.get('contacts');
	const phonebookContacts = await contactCollection.query().fetch();
	try {
		const result = await Services.getContacts(uid);
		if (result.success) {
			const contacts = [...result.phonebook];

			// save to databse

			await db.write(async () => {
				const filteredContactsToCreate = contacts.filter(i1 => !phonebookContacts.find(i2 => i1.uid === i2.uid));
				const filteredContactsToUpdate = phonebookContacts.filter(i1 => contacts.find(i2 => i2.uid === i1.uid));

				// add new contact
				const contactsCreate = filteredContactsToCreate.map(contact =>
					contactCollection.prepareCreate((c: TUserContactModel) => {
						Object.assign(c, contact);
					})
				);

				// modify changed contact
				const contactsUpdate = filteredContactsToUpdate.map(contact => {
					const newContact = contacts.find(c => c.uid === contact.uid);
					return Object.assign(contact, newContact);
				});

				const batchRecords = [...contactsCreate, ...contactsUpdate];
				await db.batch(...batchRecords);
			});

			return contacts;
		}
	} catch (e) {
		log(e);
	}

	return phonebookContacts;
}
