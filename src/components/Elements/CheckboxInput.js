import { FormControlLabel, FormGroup, Typography } from "@mui/material";
import EMICheckbox from "components/Elements/EMICheckbox";
import React from "react";

function InputTick({
	state,
	className = null,
	handleCheck,
	isDisabled,
	onBlur = () => {},
}) {
	return (
		<div className={className} style={{ width: "100%", padding: "0 10px" }}>
			<FormGroup>
				<FormControlLabel
					control={
						<EMICheckbox
							state={state.checked}
							changeHandler={() => handleCheck(state)}
							disabled={isDisabled}
						/>
					}
					label={
						<Typography style={{ fontSize: "14px" }}>{state.label}</Typography>
					}
					onBlur={onBlur}
				/>
			</FormGroup>
		</div>
	);
}

export default InputTick;
