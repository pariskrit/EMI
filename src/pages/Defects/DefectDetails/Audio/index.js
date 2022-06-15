import AudioPlayer from "components/Elements/AudioPlayer";
import AccordionBox from "components/Layouts/AccordionBox";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import ColourConstants from "helpers/colourConstants";
import DeleteDialog from "./DeleteDialog";

const useStyles = makeStyles({
	container: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	deleteButton: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
	},
});

function Audio({ src, defectId }) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);

	const closeDeleteDialog = () => setOpen(false);

	const openDeleteDialog = () => setOpen(true);

	return (
		<>
			<DeleteDialog
				open={open}
				closeHandler={closeDeleteDialog}
				entityName="Audio"
				defectId={defectId}
			/>
			<AccordionBox
				title="Audio File"
				defaultExpanded
				accordianDetailsCss={classes.container}
			>
				<AudioPlayer audioSource={src} />
				<DeleteIcon
					className={classes.deleteButton}
					alt="Delete icon"
					onClick={openDeleteDialog}
				/>
			</AccordionBox>
		</>
	);
}

export default Audio;
