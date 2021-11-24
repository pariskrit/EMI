import React from "react";
import CommonHeader from "./CommonHeader";
import NavButtons from "components/Elements/NavButtons";

import Roles from "helpers/roles";
import RoleWrapper from "components/Modules/RoleWrapper";

const CommonUserHeader = ({
	status,
	lastSaved,
	onClickAdd,
	onClickSave,
	onDuplicate,
	onImport,
	showDuplicate,
	showHistory,
	showSave,
	showSwitch,
	showImport,
	crumbs,
	isUpdating,
	currentStatus,
	handlePatchIsActive,
	navigation,
	current,
	showPasswordReset,
	onPasswordReset,
}) => {
	return (
		<>
			<CommonHeader
				{...{
					status,
					lastSaved,
					onClickAdd,
					onClickSave,
					onDuplicate,
					onImport,
					showDuplicate,
					showHistory,
					showSave,
					showSwitch,
					showImport,
					crumbs,
					isUpdating,
					currentStatus,
					handlePatchIsActive,
					showPasswordReset,
					onPasswordReset,
				}}
			/>
			<RoleWrapper accessRoles={[Roles.user, Roles.clientAdmin]}>
				<NavButtons navigation={navigation} current={current} />
			</RoleWrapper>
		</>
	);
};

export default CommonUserHeader;
