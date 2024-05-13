import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import TabTitle from "components/Elements/TabTitle";
import ProfileDetail from "./ProfileDetail";

const useStyles = makeStyles()((theme) => ({
	detailContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
	},
}));

const UserProfilePage = ({
	title,
	apis,
	getError,
	data,
	setData,
	inputData,
	setInputData,
	isDetailsRoute,
}) => {
	const { id } = useParams();

	const { classes, cx } = useStyles();

	//Init State

	const [errors, setErrors] = useState({
		firstName: null,
		lastName: null,
		email: null,
	});

	return (
		<>
			<div className={classes.detailContainer}>
				<TabTitle title={"My Profile"} />

				<Grid container spacing={2}>
					<Grid item xs={12}>
						<ProfileDetail
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
					</Grid>
				</Grid>
			</div>
		</>
	);
};

export default UserProfilePage;
