import React from "react";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";

const Home = () => {
	return (
		<Container>
			<h1>I am the home component. I have no utility at the moment</h1>

			<Container>
				<Link to="/login">GO LOG IN</Link>
			</Container>

			<Container>
				<Link to="/app/applications">
					Check out the Application List Screen
				</Link>
			</Container>
		</Container>
	);
};

export default Home;
