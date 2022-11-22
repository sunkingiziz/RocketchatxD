import React from 'react';
import { View, ScrollView } from 'react-native';
import I18n from 'i18n-js';

import sharedStyles from '~/views/Styles';
import scrollPersistTaps from '~/lib/methods/helpers/scrollPersistTaps';
import KeyboardView from '~/containers/KeyboardView';
import SafeAreaView from '~/containers/SafeAreaView';
import Avatar from '~/containers/Avatar';
import { FormTextInput } from '~/containers/TextInput';
import Button from '~/containers/Button';
import { themes } from '~/lib/constants';
import { TSupportedThemes, withTheme } from '~/theme';
import updateContact, { removeContact } from '~/lib/methods/updateContact';

import { PhonebookStackParamList } from '../../../stacks/types';
import { IBaseScreen, IUserContact } from '../../../definitions';
import styles from './styles';

interface IContactProps extends IBaseScreen<PhonebookStackParamList, 'Contact'> {
	theme: TSupportedThemes;
}

const Contact = (props: IContactProps) => {
	const { theme } = props;
	const { uid, name: _name, phone } = props.route.params;
	const [name, setName] = React.useState(_name);
	const submit = () => {
		updateContact({ uid, name, phone } as IUserContact)
			.then(r => console.log('update contact: ', r))
			.catch(e => console.log(e));
	};

	const remove = () => {
		removeContact(uid).then(r => console.log('remove contact: ', r));
	};

	return (
		<KeyboardView contentContainerStyle={sharedStyles.container} keyboardVerticalOffset={128}>
			<SafeAreaView testID='contact-view'>
				<View>
					<ScrollView contentContainerStyle={sharedStyles.containerScrollView} testID='profile-view-list' {...scrollPersistTaps}>
						<View style={styles.avatarContainer} testID='profile-view-avatar'>
							<Avatar text={_name} size={100} />
						</View>
						<FormTextInput
							editable
							label={I18n.t('Name')}
							placeholder={I18n.t('Name')}
							value={name}
							onChangeText={(value: string) => setName(value)}
						/>
						<FormTextInput editable={false} label={I18n.t('Phone')} value={phone} />
						<Button title={I18n.t('Save_Changes')} onPress={submit} />
						<Button title={I18n.t('Delete')} onPress={remove} backgroundColor={themes[theme].dangerColor} />
					</ScrollView>
				</View>
			</SafeAreaView>
		</KeyboardView>
	);
};

export default withTheme(Contact);
