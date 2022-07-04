import React, { useState } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { makeStyles, Typography } from "@material-ui/core";
import ColourConstants from "helpers/colourConstants";

const useStyles = makeStyles({
	header: {
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
	},
});

const DynamicBreadCrumb = ({ datas, serviceName, afterClick }) => {
	const classes = useStyles();

	const DefaultSeparator = () => {
		return <span className={classes.crumbText}>{">"}</span>;
	};

	return (
		<div className={classes.container}>
			<Typography className={classes.header}>{serviceName} Times</Typography>
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

export default DynamicBreadCrumb;
