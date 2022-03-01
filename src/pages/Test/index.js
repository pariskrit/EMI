import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import TextEditor from "components/Elements/TextEditor";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
	WorkBookContainer: {
		margin: 20,
		display: "flex",
	},
	inputContainer: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
});

function Test() {
	const classes = useStyles();

	return (
		<div className={classes.WorkBookContainer}>
			<Grid container spacing={2}>
				<Grid item lg={6} md={6} xs={12}>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
					<div className={classes.inputContainer}>
						<TextEditor readOnly={true} />
					</div>
				</Grid>
			</Grid>
		</div>
	);
}

export default Test;
