import React from "react";
import { Box } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import DynamicBreadCrumb from "./DynamicBreadCrumb";
import ModalHeader from "./ModalHeader";
import ColourConstants from "helpers/colourConstants";

const useStyles = makeStyles()((theme) => ({
	headerContainer: {
		textAlign: "center",
		marginTop: 25,
	},
	crumbText: {
		fontWeight: "bold",
		fontSize: "20px",
		color: ColourConstants.commonText,
	},
}));

const GraphTitle = ({
	serviceName = "",
	datas = [],
	hasBreadCrumb = false,
	modelName = "",
	asset = "",
	stageName = "",
	zoneName = "",
	taskName = "",
	afterClick = () => {},
	questionName = "",
}) => {
	const { classes, cx } = useStyles();

	return (
		<Box className={classes.headerContainer}>
			{hasBreadCrumb ? (
				<DynamicBreadCrumb
					serviceName={serviceName}
					datas={datas}
					afterClick={afterClick}
				/>
			) : (
				<ModalHeader
					{...{
						modelName,
						asset,
						stageName,
						zoneName,
						taskName,
						questionName,
					}}
				/>
			)}
		</Box>
	);
};

export default GraphTitle;
