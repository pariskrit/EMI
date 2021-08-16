import React from "react";
import Navbar from "../../../components/Navbar";
import DevelopmentContent from "./DevelopmentContent";

function DevelopmentPage() {
	return (
		<div>
			<Navbar
				Content={() => {
					return <DevelopmentContent />;
				}}
			/>
		</div>
	);
}

export default DevelopmentPage;
