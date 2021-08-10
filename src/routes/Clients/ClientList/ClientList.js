import React from "react";
import Navbar from "../../../components/Navbar";
import ClientListContent from "./ClientListContent";

const ClientList = () => {
	return (
		<div>
			<Navbar Content={ClientListContent} />
		</div>
	);
};

export default ClientList;
