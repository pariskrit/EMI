import UserNotes from "./UserNotes";
import UserDetail from "./UserDetail";
import { Grid } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useState, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import ContentStyle from "styles/application/ContentStyle";

const AC = ContentStyle();

const useStyles = makeStyles({
	detailContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
	},
});

const UserDetails = ({ title, apis, getError, showNotes, data, setData }) => {
	const { id } = useParams();

	const classes = useStyles();

	//Init State
	// const [allData, setAllData] = useState([]);
	// const [haveData, setHaveData] = useState(false);
	const [errors, setErrors] = useState({
		firstName: null,
		lastName: null,
		email: null,
	});
	const [notes, setNotes] = useState([]);

	//Handle Update
	const handleApiCall = async (path, value) => {
		if (path === "externalRef") {
			try {
				const result = await apis.patchExternalReferenceAPI(id, [
					{ op: "replace", path, value },
				]);
				if (result.status) {
					localStorage.setItem("userCrumbs", JSON.stringify(result.data));
					return true;
				} else {
					throw new Error(result);
				}
			} catch (err) {
				if (err?.response?.data?.detail) {
					getError(err.response.data.detail);
				}
				if (err?.response?.data?.errors?.name) {
					getError(err.response.data.errors.name[0]);
				}
				return err;
			}
		} else {
			try {
				const result = await apis.patchAPI(id, [
					{ op: "replace", path, value },
				]);
				if (result.status) {
					return true;
				} else {
					const err = result.data.errors;
					setErrors({ ...errors, ...err });
					// console.log(result.data.errors);
					throw new Error(result);
				}
			} catch (err) {
				if (err?.response?.data?.detail) {
					getError(err.response.data.detail);
				}
				if (err?.response?.data?.errors?.name) {
					getError(err.response.data.errors.name[0]);
				}
				return err;
			}
		}
	};

	//NOTES
	//FETCH NOTES
	const handleGetNotes = useCallback(async () => {
		// NOTE: using useCallback to remove linter error. It's memoizing the function (similar
		// to caching), which should technically prevent unrequired backend calls
		// Attempting to get data
		try {
			// Getting data from API
			let result = await apis.getNotesAPI(id);

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

	// Fetch Side effect to get data
	useEffect(() => {
		// Getting data and updating state
		handleGetNotes().catch((err) => console.log(err));
	}, [handleGetNotes]);

	return (
		<>
			<div className={classes.detailContainer}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<UserDetail
							title={title}
							data={data}
							setData={setData}
							patchData={handleApiCall}
							errors={errors}
							setErrors={setErrors}
						/>
					</Grid>
					{showNotes && (
						<Grid item xs={12}>
							<UserNotes
								id={+id}
								notes={notes}
								setNotes={setNotes}
								getError={getError}
								apis={apis}
								handleGetNotes={handleGetNotes}
							/>
						</Grid>
					)}
				</Grid>
			</div>
		</>
	);
};

export default UserDetails;
