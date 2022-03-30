import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
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
});

const PageNotFound = ({ message = "404 Page Not Found" }) => {
	const history = useHistory();
	const classes = useStyles();
	const handleGoBack = () => history.goBack();

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
