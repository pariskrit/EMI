import { useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import UserNavigation from "constants/navigation/userNavigation";
import CommonUserHeader from "components/Modules/CommonUserHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import ContentStyle from "styles/application/ContentStyle";
import ConfirmChangeDialog from "components/Elements/ConfirmChangeDialog";
import PasswordResetDialog from "components/Elements/PasswordResetDialog";
import { userProfilePath, usersPath } from "helpers/routePaths";
import Roles from "helpers/roles";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AC = ContentStyle();

const SingleComponent = (route) => {
	let getError = route.getError;
	const { role } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const { id } = useParams();
	const location = useLocation();
	const history = useHistory();
	const navigation = UserNavigation(id);

	if (location.pathname.includes("sites") && role === Roles.siteUser)
		history.goBack();

	if (location.pathname.includes("me")) {
		navigation.shift();
		navigation.unshift({
			name: "Details",
			main: "Details",
			url: userProfilePath,
		});
		navigation.pop();
		navigation.pop();
	}
	if (role === Roles.siteUser) {
		navigation.splice(1, 1);
	}

	const [allData, setAllData] = useState({});
	const [inputData, setInputData] = useState({});
	const [loading, setLoading] = useState(true);
	const [openSwitch, setOpenSwitch] = useState(false);
	const [openPasswordReset, setOpenPasswordReset] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	// Handlers
	const handleGetData = useCallback(async () => {
		// NOTE: using useCallback to remove linter error. It's memoizing the function (similar
		// to caching), which should technically prevent unrequired backend calls
		// Attempting to get data
		try {
			// Getting data from API
			let result = await route.api.getAPI(id);

			// if success, adding data to state
			if (result.status) {
				setAllData(result.data);
				setInputData(result.data);
				localStorage.setItem("userCrumbs", JSON.stringify(result.data));
				setLoading(false);
				return true;
			} // Handling 404
			else if (result.status === 404) {
				return;
			} else {
				// If error, throwing to catch
				throw new Error(result);
			}
		} catch (err) {
			// TODO: real error handling

			return false;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	// Fetch Side effect to get data
	useEffect(() => {
		// Getting data and updating state
		handleGetData().catch((err) => console.log(err));
	}, [handleGetData]);

	useEffect(() => {
		if (allData.id) {
			setLoading(false);
			localStorage.setItem("userCrumbs", JSON.stringify(allData));
		} else {
			setLoading(true);
		}
	}, [allData]);

	let titleName = JSON.parse(localStorage.getItem("userCrumbs"));

	//Switch
	const openConfirmationModal = () => setOpenSwitch(true);

	const changeStatus = async () => {
		setIsUpdating(true);
		const result = await route.api.patchSwitchAPI(id, [
			{ op: "replace", path: "active", value: !allData.active },
		]);

		if (result.status) {
			setOpenSwitch(false);
			setAllData({ ...allData, active: result.data.active });
		} else {
			if (result.data.detail) {
				getError(result.data.detail);
			} else {
				return { success: false, errors: { ...result.data.errors } };
			}
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
										{ id: 1, name: "Users", url: usersPath },
										{
											id: 2,
											name: `${titleName?.firstName} ${titleName?.lastName}`,
										},
								  ]
						}
						currentStatus={allData?.active}
						onPasswordReset={passwordResetModalHandler}
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
						/>
					}
				</div>
			)}
		</>
	);
};

export default SingleComponent;
