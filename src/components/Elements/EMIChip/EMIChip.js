import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import { makeStyles } from "tss-react/mui";
import { DefectChipTypes } from "helpers/getDefectChipTypesCc";

const EMIChip = ({
	label = "Chips",
	clickHandler,
	deleteHandler,
	className = null,
	disabled,
	data,
}) => {
	const useStyles = makeStyles()((theme) => ({
		content: {
			display: "flex",
			flexDirection: "row",
			gap: 5,
			marginBottom: 15,
			flex: "1",
			justifyContent: "start",
			alignItems: "center",
			flexGrow: "1",
			flexWrap: "wrap",
		},
	}));

	const { classes } = useStyles();

	return (
		<div className={`${classes.content} ${className}`}>
			{data
				?.filter((item) => ![1, 2, 3].includes(item.chipType))
				.map((item, index) => (
					<Chip
						key={item.id || index}
						label={
							`${DefectChipTypes(item.chipType)[0]?.caption} : ${
								item.chipType === 8 ? (item.value ? "Yes" : "No") : item.value
							} ` ?? label
						}
						variant="outlined"
						onClick={clickHandler}
						onDelete={() => deleteHandler(item)}
						sx={{
							fontSize: "15px",
							borderColor: "#307ad6",
							color: "#307ad6",
							padding: "20px 5px",
							borderRadius: "60px",
							"& .MuiChip-deleteIcon": {
								fill: "#307ad6",
							},
						}}
						disabled={disabled}
					/>
				))}
		</div>
	);
};

export default EMIChip;
