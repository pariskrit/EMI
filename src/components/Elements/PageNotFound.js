import React from "react";

import { makeStyles } from "tss-react/mui";

import { useNavigate } from "react-router-dom";

const useStyles = makeStyles()((theme) => ({
	main: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	header: {
		fontSize: "40px",
	},
	para: {
		textAlign: "center",
		cursor: "pointer",
	},
}));

const PageNotFound = ({ message = "404 Page Not Found" }) => {
	const navigate = useNavigate();
	const { classes, } = useStyles();
	const handleGoBack = () => navigate(-1);

	return (
		<div className={classes.main}>
			<div>
				<h1 className={classes.header}>{message}</h1>

				<p onClick={handleGoBack} className={classes.para}>
					Go Back
				</p>
			</div>
		</div>
	);
};

export default PageNotFound;
