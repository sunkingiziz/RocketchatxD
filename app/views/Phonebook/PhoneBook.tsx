import React from 'react';
import { SafeAreaView, withSafeAreaInsets } from 'react-native-safe-area-context';
import { FlatList, ListRenderItem, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigationOptions } from '@react-navigation/stack';

import { withTheme } from '~/theme';
import { withDimensions } from '~/dimensions';
import { getUserSelector } from '~/selectors/login';
import * as HeaderButton from '~/containers/HeaderButton';
import { MAX_SIDEBAR_WIDTH } from '~/lib/constants';
import log, { logEvent } from '~/lib/methods/helpers/log';
import database from '~/lib/database';
import { contactsRequest } from '~/actions/contacts';
import { Services } from '~/lib/services';
import events from '~/lib/methods/helpers/log/events';
import Navigation from '~/lib/navigation/appNavigation';
import { addUser, removeUser } from '~/actions/selectedUsers';
import { ISelectedUser } from '~/reducers/selectedUsers';

import { IBaseScreen, IUserContact, IApplicationState, IUser, TUserContactModel } from '../../definitions';
import { getRoomTitle, getUidDirectMessage } from '../../lib/methods/helpers';
import { PhonebookStackParamList } from '../../stacks/types';
import StatusBar from '../../containers/StatusBar';
import * as List from '../../containers/List';
import Contact from '../../containers/Contact';
import I18n from '../../i18n';

interface IPhoneBookProps extends IBaseScreen<PhonebookStackParamList, 'PhoneBook'> {
	user: IUser;
	users: ISelectedUser[];
	displayMode: string;
	width: number;
	refreshing: boolean;
	rooms: string[];
}

const navigationOptions = ({ navigation, isMasterDetail }: IPhoneBookProps): StackNavigationOptions => ({
	headerLeft: () =>
		isMasterDetail ? <HeaderButton.CloseModal navigation={navigation} /> : <HeaderButton.Drawer navigation={navigation} />,
	title: I18n.t('Phonebook')
});
const PhoneBook = (props: IPhoneBookProps) => {
	const {
		dispatch,
		navigation,
		displayMode,
		user,
		width,
		isMasterDetail,
		refreshing,
		rooms
		// users: selectedUsers
	} = props;
	const [contacts, setContacts] = React.useState([] as TUserContactModel[]);
	const [selectedContacts, setSelectedContacts] = React.useState([] as TUserContactModel[]);

	const renderItem: ListRenderItem<TUserContactModel> = ({ item }) => (
		<Contact
			contact={item}
			onPress={() => createDirect(item)} // Send direct messages
			displayMode={displayMode}
			onLongPress={() => handleOnLongPressContact(item)}
			isSelected={isContactSelected(item)}
			swipeEnabled={true}
			toggleFav={() => toggleFavorite(item.uid)}
			editContact={() => handleOnPressContact(item)}
			width={isMasterDetail ? MAX_SIDEBAR_WIDTH : width}
		/>
	);
	const toggleFavorite = React.useCallback((uid: string) => {
		setContacts(prev => {
			const newContact = prev.find(c => c.uid === uid);
			if (newContact) {
				try {
					const db = database.active;
					// const contactsCollection = db.get('contacts');
					db.write(async () => {
						try {
							await newContact.update(() => (newContact.fav = !newContact.fav));
						} catch (e) {
							log(e);
						}
					});
				} catch (e) {
					log(e);
				}
			}
			return [...prev];
		});
	}, []);

	React.useEffect(() => {
		(() => {
			const db = database.active;
			const contactsCollection = db.get('contacts');
			contactsCollection
				.query()
				.observe()
				.subscribe(change => {
					setContacts([...change]);
				});
		})();
		onRefresh();
	}, []);

	React.useEffect(() => {
		renderHeader();
	}, [selectedContacts.length > 0]);

	const handleOnLongPressContact = (item: TUserContactModel) => {
		// item is selected
		if (selectedContacts.filter(i => i.uid === item.uid).length) {
			deselectContact(item);
		}
		// item is not selected
		else {
			selectContact(item);
		}
	};
	const selectContact = (contact: TUserContactModel) => {
		setSelectedContacts(prev => [...prev.filter(c => c.uid !== contact.uid), contact]);
		dispatch(addUser({ _id: contact.uid, name: contact.name, fname: contact.name }));
	};
	const deselectContact = (contact: TUserContactModel) => {
		setSelectedContacts(prev => [...prev.filter(c => c.uid !== contact.uid)]);
		dispatch(removeUser({ _id: contact.uid, name: contact.name, fname: contact.name }));
	};
	const isContactSelected = (item: TUserContactModel) => Boolean(selectedContacts.filter(i => i.uid === item.uid).length);
	const handleOnPressContact = (item: TUserContactModel) => {
		if (isContactSelected(item)) deselectContact(item);
		else if (selectedContacts.length) selectContact(item);
		else navigation.navigate('Contact', { ...(item._raw as IUserContact) });
	};

	const createChannel = () => {
		logEvent(events.NEW_MSG_CREATE_CHANNEL);
		Navigation.navigate('SelectedUsersView', { nextAction: () => Navigation.navigate('CreateChannelView') });
		setSelectedContacts([]);
	};

	const getHeader = (): StackNavigationOptions => {
		const { route } = props;
		const header: StackNavigationOptions = {
			title: route.name,
			headerRight: undefined
		};
		if (selectedContacts.length) {
			header.headerRight = () => (
				<HeaderButton.Container>
					<HeaderButton.Item iconName='create' onPress={createChannel} />
				</HeaderButton.Container>
			);
		}
		return header;
	};

	const renderHeader = () => {
		const { navigation } = props;
		const options = getHeader();
		navigation.setOptions(options);
	};

	const onRefresh = () => {
		(() => {
			dispatch(contactsRequest(user.id));
			// await getContacts(user.id);
			setSelectedContacts([]);
		})();
	};

	const createDirect = async (contact: IUserContact) => {
		try {
			const directMsgResult = await Services.createDirectMessage(contact.phone);
			console.log('direct messages return: ', directMsgResult);
			if (directMsgResult.success) {
				let { room } = directMsgResult;
				// return this.setState(({ room }) => ({ room: { ...room, rid } }), resolve);
				const roomInfoResult = await Services.getRoomInfo(room.rid);
				if (roomInfoResult.success) {
					room = { ...room, ...roomInfoResult.room };
				}
				const params = {
					rid: room.rid,
					name: getRoomTitle(room),
					t: room.t,
					roomUserId: getUidDirectMessage(room)
				};
				let navigate = navigation.push;
				// if this is a room focused
				if (rooms.includes(room.rid)) {
					({ navigate } = navigation);
				}
				navigate('RoomView', params);
			}
		} catch {
			// do nothing
		}
	};

	return (
		<SafeAreaView testID='phonebook-view'>
			{/* {renderHeader()} */}
			<StatusBar />
			<List.Separator />
			<FlatList
				data={contacts}
				renderItem={renderItem}
				refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
			/>
		</SafeAreaView>
	);
};

PhoneBook.navigationOptions = navigationOptions;

const mapStateToProps = (state: IApplicationState) => ({
	rooms: state.room.rooms,
	displayMode: state.sortPreferences.displayMode,
	user: getUserSelector(state),
	users: state.selectedUsers.users,
	isMasterDetail: state.app.isMasterDetail,
	refreshing: state.contacts.refreshing
});

export default connect(mapStateToProps)(withDimensions(withTheme(withSafeAreaInsets(PhoneBook))));
