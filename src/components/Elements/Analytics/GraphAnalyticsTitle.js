import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Typography } from "@mui/material";
import ColourConstants from "helpers/colourConstants";
import Link from "@mui/material/Link";
import { makeStyles } from "tss-react/mui";
const useStyles = makeStyles()((theme) => ({
	header: {
		marginTop: 40,
		color: ColourConstants.commonText,
		fontSize: 20,
		fontWeight: "bold",
	},
	normalLink: {
		color: ColourConstants.activeLink,
		fontSize: 14,
		textDecoration: "underline",
		"&:hover": {
			cursor: "pointer",
		},
	},
	activeLink: {
		color: ColourConstants.commonText,
		fontSize: 14,
		"&:hover": {
			textDecoration: "none",
		},
	},
	crumbText: {
		fontSize: "20px",
		color: ColourConstants.commonText,
	},

	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		marginBottom: "20px",
	},
}));

const GraphAnalyticsTitle = ({
	datas,
	title,
	subTitle,
	afterClick,
	isConditionMonitor = false,
	conditionMonitorData,
}) => {
	const { classes, cx } = useStyles();

	const DefaultSeparator = () => {
		return <span className={classes.crumbText}>{">"}</span>;
	};

	return (
		<div className={classes.container}>
			<Typography className={classes.header}>{title} Analysis </Typography>
			<Typography className={classes.subHeader}>{subTitle} </Typography>
			{isConditionMonitor && (
				<Typography className={classes.subHeader}>
					{conditionMonitorData}{" "}
				</Typography>
			)}
			<Breadcrumbs aria-label="breadcrumb" separator={<DefaultSeparator />}>
				{datas.map((data, index) =>
					datas.length - 1 === index ? (
						<Typography key={data.id} className={classes.activeLink}>
							{data.name}
						</Typography>
					) : (
						<Link
							className={classes.normalLink}
							key={data.id}
							onClick={() => afterClick(data)}
						>
							{data.name}
						</Link>
					)
				)}
			</Breadcrumbs>
		</div>
	);
};

export default GraphAnalyticsTitle;
