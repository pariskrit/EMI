import React, { useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UserNotes from "./UserNotes";
import UserDetail from "./UserDetail";
import Roles from "helpers/roles";
import AccessWrapper from "components/Modules/AccessWrapper";

const useStyles = makeStyles({
	detailContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
	},
});

const UserDetails = ({
	title,
	apis,
	getError,
	data,
	setData,
	inputData,
	setInputData,
}) => {
	const { id } = useParams();

	const classes = useStyles();

	//Init State

	const [errors, setErrors] = useState({
		firstName: null,
		lastName: null,
		email: null,
	});
	const [notes, setNotes] = useState([]);

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
							errors={errors}
							setErrors={setErrors}
							getError={getError}
							apis={apis}
							id={+id}
							inputData={inputData}
							setInputData={setInputData}
						/>
					</Grid>
					<Grid item xs={12}>
						<AccessWrapper accessRoles={[Roles.user, Roles.admin]}>
							<UserNotes
								id={+id}
								notes={notes}
								setNotes={setNotes}
								getError={getError}
								apis={apis}
								handleGetNotes={handleGetNotes}
							/>
						</AccessWrapper>
					</Grid>
				</Grid>
			</div>
		</>
	);
};

export default UserDetails;
