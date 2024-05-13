import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "redux/store";
import App from "./App";
import "./index.css";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import Notification from "components/Elements/Notification";
import ErrorBoundary from "components/Layouts/ErrorBoundaryWrapper/ErrorBoundary";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Configuration object constructed.
const config = {
	auth: {
		clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID,
	},
};

// create PublicClientApplication instance
const publicClientApplication = new PublicClientApplication(config);
publicClientApplication.initialize();

ReactDOM.createRoot(document.getElementById("root")).render(
	<MsalProvider instance={publicClientApplication}>
		<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
			<Provider store={store}>
				<ErrorBoundary>
					<App />
					<Notification />
				</ErrorBoundary>
			</Provider>
		</GoogleOAuthProvider>
	</MsalProvider>
);
