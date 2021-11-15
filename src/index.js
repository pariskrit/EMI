import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "redux/store";
import App from "./App";
import "./index.css";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

// Configuration object constructed.
const config = {
	auth: {
		clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID,
	},
};

// create PublicClientApplication instance
const publicClientApplication = new PublicClientApplication(config);

ReactDOM.render(
	<React.StrictMode>
		<MsalProvider instance={publicClientApplication}>
			<Provider store={store}>
				<App />
			</Provider>
		</MsalProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
