// 2. update contact:
// update db -> api post

// handle when offline
// 	rocket: show indicator => user resend manually
import { Collection, Q } from '@nozbe/watermelondb';

import database from '~/lib/database';
import { IUserContact, TUserContactModel } from '~/definitions';
import { Services } from '~/lib/services';

import log from './helpers/log';

export async function updateContact(updatedContact: IUserContact) {
	const db = database.active;
	const contactCollection: Collection<TUserContactModel> = db.get('contacts');
	try {
		// api post

		const result = await Services.updateContact(updatedContact);
		// update databse
		if (result?.success) {
			const contacts = await contactCollection.query(Q.where('uid', updatedContact.uid)).fetch();
			if (contacts.length)
				await db.write(async () => {
					await contacts[0].update(() => {
						contacts[0].name = updatedContact.name;
						contacts[0].fname = updatedContact.fname;
						contacts[0].fav = updatedContact.fav;
					});
				});

			return true;
		}
		return false;
	} catch (e) {
		log(e);
	}
	return false;
}

export default async function insertContact(newContact: IUserContact) {
	const db = database.active;
	const contactCollection: Collection<TUserContactModel> = db.get('contacts');
	try {
		// api post

		const result = await Services.insertContact({ uid: newContact.uid } as IUserContact);
		// update databse
		if (result?.success) {
			await db.write(async () => {
				await contactCollection.create(contact => {
					const contactRes = result.newContact;
					contact.uid = newContact.uid;
					contact.name = contactRes.name;
					contact.fname = contactRes.fname;
					contact.fav = contactRes.fav;
					contact.phone = contactRes.phone;
				});
			});

			return true;
		}
		return false;
	} catch (e) {
		log(e);
	}
	return false;
}

export async function removeContact(uid: string) {
	const db = database.active;
	try {
		const contactCollection = db.get('contacts');
		const result = await Services.removeContact({ uid });
		if (result?.success) {
			db.write(async () => {
				const contacts = await contactCollection.query(Q.where('uid', uid)).fetch();
				if (contacts.length) {
					contacts[0].destroyPermanently();
				}
			});
			return true;
		}
		return false;
	} catch (e) {
		log(e);
	}
	return false;
}
