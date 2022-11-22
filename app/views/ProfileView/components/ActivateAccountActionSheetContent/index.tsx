import React from 'react';

import { useActionSheet } from '../../../../containers/ActionSheet';
import ActionSheetContentWithInputAndSubmit from '../../../../containers/ActionSheet/ActionSheetContentWithInputAndSubmit';
import i18n from '../../../../i18n';
import { activateAccount } from '../../../../lib/services/restApi';
import { useTheme } from '../../../../theme';


export function ActivateAccountActionSheetContent(): React.ReactElement {
	const { hideActionSheet } = useActionSheet();
	
	
	const { colors } = useTheme();

	const handleActivateAccount = async (otp: string) => {
		hideActionSheet();
		await activateAccount(otp);
	};

	return (
		<ActionSheetContentWithInputAndSubmit
			title={i18n.t('Verify_OTP')}
			description={i18n.t('OTP_code_was_sent_to_your_phone')}
			onCancel={hideActionSheet}
			onSubmit={password => handleActivateAccount(password)}
			placeholder={i18n.t('OTP_code')}
			testID='profile-view-activate-account-sheet'
			iconName='circle-check'
            iconColor={colors.successColor}
			confirmTitle={i18n.t('Activate_account')}
			confirmBackgroundColor={colors.successColor}
		/>
	);
}



