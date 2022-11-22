import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

import { sanitizer } from '../utils';

export const CONTACTS_TABLE = 'contacts';

export default class Contact extends Model {
	static table = CONTACTS_TABLE;

	@field('uid') uid;

	@field('name') name;

	@field('fname') fname;

	@field('phone') phone;

	@field('fav') fav;
}
