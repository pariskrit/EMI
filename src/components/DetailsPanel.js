import React from "react";
import DetailsStyle from "../styles/application/DetailsStyle";

// Init styled components
const AD = DetailsStyle();

const DetailsPanel = ({ header, dataCount, description }) => {
	return (
		<AD.ParentContainer>
			<AD.HeaderText>
				{dataCount === null ? (
					<>{header}</>
				) : (
					<>
						{header} ({dataCount})
					</>
				)}
			</AD.HeaderText>
			<AD.InfoText>{description}</AD.InfoText>
		</AD.ParentContainer>
	);
};

export default DetailsPanel;
