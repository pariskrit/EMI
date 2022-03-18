import { FormControlLabel, FormGroup, Typography } from "@material-ui/core";
import EMICheckbox from "components/Elements/EMICheckbox";
import React from "react";

function InputTick({ state, className = null, handleCheck, isDisabled }) {
	return (
		<div className={className} style={{ width: "100%" }}>
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
				/>
			</FormGroup>
		</div>
	);
}

export default InputTick;
