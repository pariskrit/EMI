import EMICheckbox from "components/Elements/EMICheckbox";
import React from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";
import PropTypes from "prop-types";

const ADD = AddDialogStyle();

/* The checkBoxes prop should be an array like [{id:1,name:'ok',checked:false,isDisabled:false}] */
function CheckboxContainer({
	checkBoxes = [],
	onCheck,
	header = "",
	horizontalAlign = false,
}) {
	return (
		<div>
			<ADD.HeaderText>{header}</ADD.HeaderText>
			<div
				style={
					horizontalAlign
						? { display: "flex", flexWrap: "wrap", columnGap: "20px" }
						: {}
				}
			>
				{checkBoxes.map((checkBox) => (
					<ADD.CheckboxLabel key={checkBox?.id}>
						<EMICheckbox
							state={checkBox?.checked}
							changeHandler={
								checkBox?.isDisabled ? () => {} : () => onCheck(checkBox)
							}
							disabled={checkBox?.isDisabled}
						/>
						{checkBox?.name}
					</ADD.CheckboxLabel>
				))}
			</div>
		</div>
	);
}

CheckboxContainer.propTypes = {
	checkBoxes: PropTypes.array,
	onCheck: PropTypes.func,
	header: PropTypes.string,
	horizontalAlign: PropTypes.bool,
};

export default CheckboxContainer;
