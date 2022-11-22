import Animated from 'react-native-reanimated';

import { IUserContact } from '../../definitions';

export interface IContactProp {
	contact: IUserContact;
	displayMode: string;
	onPress: () => void;
	onLongPress: () => void;
	isSelected: boolean;
	width: number;
	swipeEnabled: boolean;
	toggleFav: (uid: string) => void;
	editContact: (conttact: IUserContact) => void;
}

export interface ILeftActionsProps {
	transX: Animated.SharedValue<number>;
	width: number;
	onToggleFav(): void;
	displayMode: string;
	favorite: boolean;
}
export interface IRightActionsProps {
	transX: Animated.SharedValue<number>;
	favorite: boolean;
	width: number;
	toggleFav(): void;
	onEdit(): void;
	displayMode: string;
}
