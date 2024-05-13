import React from "react";
import CommonHeader from "components/Modules/CommonUserHeader/CommonHeader";
import NavButtons from "components/Elements/NavButtons";
import Roles from "helpers/roles";
import RoleWrapper from "components/Modules/RoleWrapper";
import { useNavigate } from "react-router-dom";

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
	createdDateTime,
	createdUserName,
	siteAppID,
}) => {
	const navigate = useNavigate();

	const onClick = (url) => navigate(url);

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
					current,
					createdDateTime,
					createdUserName,
					siteAppID,
				}}
			/>
			<RoleWrapper roles={[Roles.siteUser, Roles.clientAdmin]}>
				<NavButtons
					navigation={navigation}
					current={current}
					onClick={onClick}
				/>
			</RoleWrapper>
		</>
	);
};

export default CommonUserHeader;
