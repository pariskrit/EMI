import React, { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import Roles from "helpers/roles";
import TabTitle from "components/Elements/TabTitle";
import { getLocalStorageData } from "helpers/utils";
import { getUserDetailsNotes } from "services/users/userDetails";
import HistoryBar from "../HistorySidebar/HistoryBar";
import { useDispatch, useSelector } from "react-redux";
import { clientUserSiteAppPage } from "services/History/models";
import { HistoryCaptions } from "helpers/constants";
import UserDetailSuperAdmin from "./UserDetailSuperAdmin";
import UserDetailClientAdmin from "./UserDetailClientAdmin";
import UserDetailSiteUser from "./UserDetailSiteUser";
import { SuperAdminUserDetail } from "services/History/users";

const useStyles = makeStyles()((theme) => ({
	detailContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
	},
}));

const UserDetails = ({
	title,
	apis,
	getError,
	data,
	setData,
	inputData,
	setInputData,
	role,
	isDetailsRoute,
}) => {
	const { id } = useParams();

	const { classes } = useStyles();

	//Init State

	const [errors, setErrors] = useState({
		firstName: null,
		lastName: null,
		email: null,
	});
	const [notes, setNotes] = useState([]);
	const me = getLocalStorageData("me");

	//NOTES
	//FETCH NOTES
	const handleGetNotes = useCallback(async () => {
		// NOTE: using useCallback to remove linter error. It's memoizing the function (similar
		// to caching), which should technically prevent unrequired backend calls
		// Attempting to get data
		try {
			let result = await getUserDetailsNotes(
				data?.clientUserID || id || +data?.id
			);

			// if success, adding data to state
			if (result.status) {
				setNotes(result.data);
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

	//Fetch Side effect to get data
	useEffect(() => {
		if (role !== Roles.superAdmin && id)
			// Getting data and updating state
			handleGetNotes().catch((err) => getError(err));
	}, [handleGetNotes, role, id, getError]);
	const { isHistoryDrawerOpen } = useSelector((state) => state.commonData);

	const dispatch = useDispatch();

	//Separation of User Details  Screens
	const getUsertDetail = () => {
		if (role === Roles?.superAdmin) {
			return (
				<UserDetailSuperAdmin
					title={title}
					data={data}
					setData={setData}
					errors={errors}
					setErrors={setErrors}
					getError={getError}
					apis={apis}
					id={(+data?.userID || +id) ?? data.id}
					clientUserId={data.clientUserID ?? data.id}
					inputData={inputData}
					setInputData={setInputData}
					isDetailsRoute={isDetailsRoute}
				/>
			);
		}
		if (role === Roles?.clientAdmin) {
			return (
				<UserDetailClientAdmin
					title={title}
					data={data}
					setData={setData}
					errors={errors}
					setErrors={setErrors}
					getError={getError}
					apis={apis}
					id={(+data?.userID || +id) ?? data.id}
					clientUserId={data.clientUserID ?? data.id}
					inputData={inputData}
					setInputData={setInputData}
					isDetailsRoute={isDetailsRoute}
					notes={notes}
					setNotes={setNotes}
					handleGetNotes={handleGetNotes}
				/>
			);
		}
		if (role === Roles?.siteUser) {
			return (
				<UserDetailSiteUser
					title={title}
					data={data}
					setData={setData}
					errors={errors}
					setErrors={setErrors}
					getError={getError}
					apis={apis}
					id={(+data?.userID || +id) ?? data.id}
					clientUserId={data.clientUserID ?? data.id}
					inputData={inputData}
					setInputData={setInputData}
					isDetailsRoute={isDetailsRoute}
					notes={notes}
					setNotes={setNotes}
					handleGetNotes={handleGetNotes}
				/>
			);
		}

		return <div>Role not recognized</div>;
	};

	const HistoryBarApi =
		role === Roles?.superAdmin ? SuperAdminUserDetail : clientUserSiteAppPage;

	return (
		<>
			<div className={classes.detailContainer}>
				<TabTitle
					title={`${
						!id
							? "My Profile"
							: !me?.application
							? data?.firstName + " " + data?.lastName
							: data?.firstName +
							  " " +
							  data?.lastName +
							  " " +
							  " | " +
							  me?.application?.name
					}`}
				/>
				{role !== Roles?.clientAdmin && (
					<HistoryBar
						id={id}
						showhistorybar={isHistoryDrawerOpen}
						dispatch={dispatch}
						fetchdata={(id, pageNumber, pageSize) =>
							HistoryBarApi(id, pageNumber, pageSize)
						}
						origin={HistoryCaptions.clientUserSite}
					/>
				)}

				<Grid container spacing={2}>
					{getUsertDetail()}
				</Grid>
			</div>
		</>
	);
};

export default UserDetails;
