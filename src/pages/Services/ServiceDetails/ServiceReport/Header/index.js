import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { isoDateWithoutTimeZone } from "helpers/utils";
import clsx from "clsx";

const media = "@media (max-width: 768px)";
const useStyles = makeStyles({
	headerText: {
		marginTop: 10,
		fontSize: 28,
		textAlign: "center",
	},
	workOrder: {
		fontSize: 17,
		fontWeight: 550,
		textAlign: "center",
	},
	horizon: {
		border: "0.05rem solid black",
	},
	main: {
		fontSize: 17,
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-between",
		[media]: {
			flexDirection: "column",
		},
	},
	first: {
		flexBasis: "auto",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "flex-start",
		[media]: {
			columnGap: 50,
		},
	},
	list: {
		display: "flex",
		columnGap: 10,
	},
	headings: {
		display: "block",
		fontWeight: 520,
		marginTop: 10,
		marginBottom: 10,
		[media]: {
			margin: 0,
			paddingTop: 5,
			fontSize: 15,
		},
	},
	keyHeading: {
		width: "150px",
	},
});

const Header = ({ state, customCaptions }) => {
	const classes = useStyles();
	const date = isoDateWithoutTimeZone(
		state.scheduledDate ? state.scheduledDate + "Z" : state.scheduledDate
	);
	return (
		<>
			<Typography className={classes.headerText} component="h1" gutterBottom>
				<strong>{customCaptions.service} Report</strong>
			</Typography>
			<div className={classes.workOrder}>
				{customCaptions.serviceWorkOrder} {state.workOrder}
			</div>
			<hr className={classes.horizon} />
			<div className={classes.main}>
				<div className={classes.first}>
					<div className={classes.list}>
						<span className={clsx(classes.headings, classes.keyHeading)}>
							{customCaptions.model}
						</span>
						<span className={classes.headings}>
							{state.modelName} {state.model}
						</span>
					</div>
					<div className={classes.list}>
						<span className={clsx(classes.headings, classes.keyHeading)}>
							{customCaptions.interval}
						</span>
						<span className={classes.headings}>{state.interval}</span>
					</div>
					<div className={classes.list}>
						<span className={clsx(classes.headings, classes.keyHeading)}>
							{customCaptions.role}
						</span>
						<span className={classes.headings}>{state.role}</span>
					</div>
					<div className={classes.list}>
						<span className={clsx(classes.headings, classes.keyHeading)}>
							{customCaptions.modelType}
						</span>
						<span className={classes.headings}>{state.typeName}</span>
					</div>
				</div>
				<div className={classes.first}>
					<div className={classes.list}>
						<span className={clsx(classes.headings, classes.keyHeading)}>
							{customCaptions.service} Status
						</span>
						<span className={classes.headings}>{state.status}</span>
					</div>
					<div className={classes.list}>
						<span className={clsx(classes.headings, classes.keyHeading)}>
							{customCaptions.model} Version
						</span>
						<span className={classes.headings}>
							{state.activeModelVersionID}
						</span>
					</div>
					<div className={classes.list}>
						<span className={clsx(classes.headings, classes.keyHeading)}>
							{customCaptions.asset}
						</span>
						<span className={classes.headings}>{state.siteAssetName}</span>
					</div>
				</div>
				<div className={classes.first}>
					<div className={classes.list}>
						<span className={clsx(classes.headings, classes.keyHeading)}>
							{customCaptions.service} Completion Date
						</span>
						<span className={classes.headings}>{date}</span>
					</div>
				</div>
			</div>
			<hr className={classes.horizon} />
		</>
	);
};

export default Header;
