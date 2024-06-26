import { useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import UserNavigation from "constants/navigation/userNavigation";
import CommonUserHeader from "components/Modules/CommonUserHeader";
import CircularProgress from "@mui/material/CircularProgress";
import ContentStyle from "styles/application/ContentStyle";
import ConfirmChangeDialog from "components/Elements/ConfirmChangeDialog";
import PasswordResetDialog from "components/Elements/PasswordResetDialog";
import { appPath, usersPath } from "helpers/routePaths";
import Roles from "helpers/roles";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getClientUserSiteAppDetail } from "services/users/userDetails";

const AC = ContentStyle();

const SingleComponent = (route) => {
	let getError = route.getError;
	const { role, siteAppID, customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me")) ||
		{};

	const { id } = useParams();
	const location = useLocation();
	const navigate = useNavigate();
	let navigation = UserNavigation(id);
	if (
		(location.pathname.includes("sites") && role === Roles.siteUser) ||
		(location.pathname.includes("sites") && siteAppID !== null)
	)
		navigate(-1);

	if (location.pathname.includes("me")) {
		navigation = navigation.filter(() => false);
	}
	if (role === Roles.siteUser || siteAppID !== null) {
		navigation.splice(1, 1);
	}

	const [allData, setAllData] = useState({});
	const [inputData, setInputData] = useState({});
	const [loading, setLoading] = useState(true);
	const [openSwitch, setOpenSwitch] = useState(false);
	const [openPasswordReset, setOpenPasswordReset] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const dispatch = useDispatch();

	const isSuperAdmin =
		location.pathname === "/app/me" || role === Roles.superAdmin;

	const isClientAdmin = role === Roles.clientAdmin;

	// Handlers
	const handleGetData = useCallback(async () => {
		// NOTE: using useCallback to remove linter error. It's memoizing the function (similar
		// to caching), which should technically prevent unrequired backend calls
		// Attempting to get data

		let result = null;

		if (isSuperAdmin) result = await route.api.getAPI(id);

		if (siteAppID && !isSuperAdmin)
			result = await getClientUserSiteAppDetail(id);
		if (!siteAppID && !isSuperAdmin)
			result = await route.api.getClientUserDetail(id);

		// if success, adding data to state
		if (result.status) {
			const mainData =
				isSuperAdmin || isClientAdmin
					? result.data
					: {
							...result.data[0],
							department: {
								id: result?.data[0]?.siteDepartmentID,
								name: result?.data[0]?.siteDepartmentName,
							},
					  };

			setAllData(mainData);
			setInputData(mainData);
			localStorage.setItem("userCrumbs", JSON.stringify(mainData));
		} else {
			dispatch(showError(result?.data?.detail || "Could not get User details"));
		}

		setLoading(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	// Fetch Side effect to get data
	useEffect(() => {
		// Getting data and updating state
		handleGetData();
	}, [handleGetData]);

	useEffect(() => {
		if (allData?.id) {
			setLoading(false);
			localStorage.setItem("userCrumbs", JSON.stringify(allData));
		} else {
			setLoading(true);
		}
	}, [allData]);

	let titleName;
	try {
		titleName = JSON.parse(localStorage.getItem("userCrumbs"));
	} catch (error) {}

	//Switch
	const openConfirmationModal = () => setOpenSwitch(true);

	const changeStatus = async () => {
		setIsUpdating(true);
		try {
			const result =
				siteAppID && !isSuperAdmin
					? await route.api.patchClientUserSwitchAPI(id, [
							{ op: "replace", path: "active", value: !allData.active },
					  ])
					: !siteAppID && isClientAdmin
					? await route.api.patchSwitchAPI(id, [
							{ op: "replace", path: "active", value: !allData.active },
					  ])
					: await route.api.patchAPI(id, [
							{ op: "replace", path: "active", value: !allData.active },
					  ]);

			if (result.status) {
				setOpenSwitch(false);
				setAllData({
					...allData,
					active:
						siteAppID && !isSuperAdmin ? !allData.active : result.data.active,
				});
			} else {
				dispatch(showError(result?.data?.detail || "Status Change Failed"));
			}
		} catch (error) {
			dispatch(showError("Status Change Failed"));
		}

		setIsUpdating(false);
	};

	//Password Reset Handler

	const passwordResetModalHandler = () => {
		setOpenPasswordReset(true);
	};
	return (
		<>
			{loading ? (
				<div className="container">
					<AC.SpinnerContainer>
						<CircularProgress />
					</AC.SpinnerContainer>
				</div>
			) : (
				<div className="container">
					{openSwitch && (
						<ConfirmChangeDialog
							open={openConfirmationModal}
							closeHandler={() => setOpenSwitch(false)}
							handleChangeConfirm={changeStatus}
							isUpdating={isUpdating}
						/>
					)}
					{openPasswordReset && (
						<PasswordResetDialog
							open={passwordResetModalHandler}
							handleClose={() => setOpenPasswordReset(false)}
							apis={route.api}
							id={id}
							getError={getError}
						/>
					)}
					<CommonUserHeader
						navigation={navigation}
						current={route.name}
						siteAppID={siteAppID}
						showSwitch={route.showSwitch}
						showHistory={route.showHistory}
						showSave={route.showSave}
						showPasswordReset={route.showPasswordReset}
						handlePatchIsActive={openConfirmationModal}
						crumbs={
							route.id === 100
								? [
										{
											id: 1,
											name: `${titleName?.firstName} ${titleName?.lastName}`,
										},
								  ]
								: [
										{
											id: 1,
											name: `${customCaptions?.userPlural ?? "Users"}`,
											url: appPath + usersPath,
										},
										{
											id: 2,
											name: `${titleName?.firstName} ${titleName?.lastName}`,
										},
								  ]
						}
						currentStatus={allData?.active}
						onPasswordReset={passwordResetModalHandler}
						createdDateTime={allData.createdDateTime}
						createdUserName={allData.createdUserName}
					/>
					{
						<route.component
							title={route.title}
							apis={route.api}
							getError={getError}
							showNotes={route.showNotes}
							data={allData}
							setData={setAllData}
							inputData={inputData}
							setInputData={setInputData}
							showExternalReferenceNumber={route.showExternalReferenceNumber}
							role={role}
							isDetailsRoute={
								route.name === "Details" && role !== Roles.superAdmin
							}
						/>
					}
				</div>
			)}
		</>
	);
};

export default SingleComponent;
