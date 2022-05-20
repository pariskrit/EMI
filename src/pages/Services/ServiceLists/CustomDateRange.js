import React from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	LinearProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ColourConstants from "helpers/colourConstants";
import AddDialogStyle from "styles/application/AddDialogStyle";
import TextFieldContainer from "components/Elements/TextFieldContainer";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";

const ADD = AddDialogStyle();

const useStyle = makeStyles({
	input: {
		width: "100%",
		padding: 10,
		border: "1px solid",
		borderRadius: 5,
	},
	header: {
		marginRight: "auto",
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: 21,
		color: ColourConstants.commonText,
	},
	textfield: {
		marginBottom: "0px !important",
	},
});

function CustomDateRange({
	open,
	closeHandler,
	customDate,
	handleChange,
	onSubmit,
	isError,
	isLoading,
}) {
	const { from, to } = customDate;
	const classes = useStyle();
	return (
		<Dialog open={open} onClose={closeHandler}>
			{isLoading && <LinearProgress className={classes.loading} />}
			<form onSubmit={onSubmit}>
				<ADD.ActionContainer>
					<DialogTitle id="alert-dialog-title">
						{<ADD.HeaderText>Customised Date Range</ADD.HeaderText>}
					</DialogTitle>
					<ADD.ButtonContainer>
						<div className="modalButton">
							<ADD.CancelButton onClick={closeHandler} variant="contained">
								Cancel
							</ADD.CancelButton>
						</div>
						<div className="modalButton">
							<ADD.ConfirmButton
								variant="contained"
								className={classes.createButton}
								type="submit"
							>
								Submit
							</ADD.ConfirmButton>
						</div>
					</ADD.ButtonContainer>
				</ADD.ActionContainer>

				<DialogContent>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<ErrorInputFieldWrapper
								errorMessage={isError.from ? "Please fill the date" : null}
							>
								<TextFieldContainer
									className={classes.textfield}
									label={"From"}
									name={"from"}
									value={from}
									onChange={(e) => handleChange("from", e)}
									isRequired={true}
									type="date"
									placeholder="Select Date"
									error={isError.from}
								/>
							</ErrorInputFieldWrapper>
						</Grid>
						<Grid item xs={6}>
							<ErrorInputFieldWrapper
								errorMessage={isError.to ? "Please fill the date" : null}
							>
								<TextFieldContainer
									className={classes.textfield}
									label={"To"}
									name={"to"}
									value={to}
									onChange={(e) => handleChange("to", e)}
									isRequired={true}
									type="date"
									placeholder="Select Date"
									error={isError.to}
								/>
							</ErrorInputFieldWrapper>
						</Grid>
					</Grid>
				</DialogContent>
			</form>
		</Dialog>
	);
}

export default CustomDateRange;
