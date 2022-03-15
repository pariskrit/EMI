import React from "react";
import DetailsStyle from "styles/application/DetailsStyle";

// Init styled components
const AD = DetailsStyle();

const DetailsPanel = ({
	header,
	dataCount,
	description,
	countStyle = null,
}) => {
	return (
		<AD.ParentContainer>
			<AD.HeaderText>
				{dataCount === null ? (
					<>{header}</>
				) : (
					<>
						{header}{" "}
						<span style={countStyle ? countStyle : null}>({dataCount})</span>
					</>
				)}
			</AD.HeaderText>
			<AD.InfoText>{description}</AD.InfoText>
		</AD.ParentContainer>
	);
};

export default DetailsPanel;
