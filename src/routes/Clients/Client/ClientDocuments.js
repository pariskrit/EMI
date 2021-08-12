import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ColourConstants from "../../../helpers/colourConstants";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ArrowIcon from "../../../assets/icons/arrowIcon.svg";
import Typography from "@material-ui/core/Typography";
import DropUpload from "../../../components/DropUpload";
import ProvidedAssetNoImage from "../../../components/ProvidedAsset/ProvidedAssetNoImage";
import API from "../../../helpers/api";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	logoContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
		paddingLeft: "2%",
	},
	logoAccordion: {
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
	logoContentParent: {
		width: "100%",
	},
	spinnerContainer: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	trademarkContainer: {
		marginTop: 10,
	},
	trademarkText: {
		fontSize: "14px",
	},
	uploaderContainer: {
		marginTop: "2%",
	},
	dividerStyle: {
		width: "100%",
	},
}));
function ClientDocuments() {
	const classes = useStyles();
	const { id } = useParams();

	const [listOfDocuments, setListOfDocuments] = useState([
		{ id: 1, name: "document1.pdf" },
		{ id: 2, name: "document2.pdf" },
	]);

	const handleLogoUpload = (e) => {
		let photo = document.getElementById("image-file").files[0];
		let formData = new FormData();

		formData.append("photo", photo);
		fetch("/upload/image", { method: "POST", body: formData });
	};

	const fetchDocuments = async () => {
		console.log("fetching...");
		try {
			const result = await API.get("/api/ClientDocuments", { clientId: id });
			console.log(result);
		} catch (error) {}
	};

	useEffect(() => {
		// fetchDocuments();
	}, []);
	return (
		<div className={classes.logoContainer}>
			<Accordion className={classes.logoAccordion}>
				<AccordionSummary
					expandIcon={
						<img
							alt="Expand icon"
							src={ArrowIcon}
							className={classes.expandIcon}
						/>
					}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography className={classes.sectionHeading}>
						Client documents (3)
					</Typography>
				</AccordionSummary>

				<AccordionDetails>
					<div className={classes.logoContentParent}>
						{listOfDocuments.map((document, index) => {
							// Preventing duplication of dividers
							if (index === listOfDocuments.length - 1) {
								return (
									<ProvidedAssetNoImage
										key={index}
										name={document.name}
										showBottomDivider={true}
									/>
								);
							} else {
								return (
									<ProvidedAssetNoImage key={index} name={document.name} />
								);
							}
						})}

						<div className={classes.uploaderContainer}>
							<DropUpload uploadReturn={handleLogoUpload} applicationID={1} />
						</div>
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	);
}

export default ClientDocuments;
