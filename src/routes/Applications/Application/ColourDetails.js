import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import ColourEditDialog from "./ColourEditDialog";
import ColourConstants from "../../../helpers/colourConstants";
import AccordionBox from "components/AccordionBox";

const useStyles = makeStyles((theme) => ({
	colourContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
		paddingRight: "2%",
	},
	colourAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "99%",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	sectionHeading: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "17px",
	},
	colourContent: {
		display: "flex",
		width: "100%",
		paddingLeft: 2,
		paddingBottom: 15,
	},
	colourExample: {
		width: 33,
		height: 33,
		marginRight: 10,
	},
	colourText: {
		display: "flex",
		alignItems: "center",
		fontSize: "14px",
		color: ColourConstants.commonText,
	},
	linkTextContainer: {
		display: "flex",
		alignItems: "center",
		marginLeft: 30,
	},
	editLink: {
		textDecoration: "underline",
		"&:hover": {
			cursor: "pointer",
		},
		fontSize: "14px",
		color: ColourConstants.activeLink,
	},
}));

const ColourDetails = ({ inputColour, setInputColour }) => {
	// Init hooks
	const classes = useStyles();

	// Init state
	const [openEditDialog, setOpenEditDialog] = useState(false);

	// Handlers
	const handleEditOpen = () => {
		setOpenEditDialog(true);
	};
	const handleEditClose = () => {
		setOpenEditDialog(false);
	};
	const handleUpdateColour = (newColour) => {
		// TODO: in prod, this will trigger a PUT fetch
		setInputColour(newColour);
		setOpenEditDialog(false);
	};

	// Variable style
	const bgColour = {
		backgroundColor: inputColour,
	};

	return (
		<>
			<ColourEditDialog
				open={openEditDialog}
				handleClose={handleEditClose}
				handleUpdateColour={handleUpdateColour}
				currentColour={inputColour}
			/>
			<div className={`${classes.colourContainer} colorContainer`}>
				<AccordionBox
					title="Primary Application Colour"
					defaultExpanded={false}
				>
					<div className={classes.colourContent}>
						<div className={classes.colourExample} style={bgColour}></div>
						<div className={classes.colourText}>
							<Typography>{inputColour}</Typography>
						</div>
						<div className={classes.linkTextContainer}>
							<Typography onClick={handleEditOpen}>
								<Link className={classes.editLink}>Edit</Link>
							</Typography>
						</div>
					</div>
				</AccordionBox>
			</div>
		</>
	);
};

export default ColourDetails;
