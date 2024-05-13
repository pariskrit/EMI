import React, { useContext } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import ColourConstants from "helpers/colourConstants";
import { ServiceContext } from "contexts/ServiceDetailContext";
import { coalesc } from "helpers/utils";

const useStyles = makeStyles()((theme) => ({
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
}));

const DynamicBreadCrumb = ({ datas, serviceName, afterClick }) => {
	const { classes, cx } = useStyles();

	const DefaultSeparator = () => {
		return <span className={classes.crumbText}>{">"}</span>;
	};
	const [serviceDetail] = useContext(ServiceContext);

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
			<Typography className={classes.activeLink} style={{ fontWeight: "bold" }}>
				{serviceDetail?.serviceDetail?.workOrder} -{" "}
				{serviceDetail?.serviceDetail?.modelName +
					" " +
					coalesc(serviceDetail?.serviceDetail?.model) +
					" "}
				{serviceDetail?.serviceDetail?.modelTemplateType === "A"
					? `- ${serviceDetail?.serviceDetail?.siteAssetName}  `
					: null}
				- {serviceDetail?.serviceDetail?.role}
			</Typography>
		</div>
	);
};

export default DynamicBreadCrumb;
