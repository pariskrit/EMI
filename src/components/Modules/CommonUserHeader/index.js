import React from "react";
import CommonHeader from "./CommonHeader";
import NavButtons from "components/Elements/NavButtons";
import Roles from "helpers/roles";
import RoleWrapper from "../RoleWrapper";
import { useHistory } from "react-router-dom";

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
	const history = useHistory();

	const onClick = (url) => history.push(url);

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
