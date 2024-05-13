import React from "react";
import ErrorDialog from "components/Elements/ErrorDialog";
import {
	Route,
	Navigate,
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
} from "react-router-dom";
import access from "helpers/access";
import MainApp from "pages";
import Launch from "pages/Launch/Launch";
import Login from "pages/Login/Login";
import ProtectedRoute from "components/HOC/ProtectedRoute";
import ForgotPassword from "pages/ForgotPassword/ForgotPassword";
import ResetPassword from "pages/ResetPassword/ResetPassword";
import RegisterUserEmail from "pages/RegisterUser/RegisterUser";
import Test from "pages/Test";
import {
	analyticsPath,
	appPath,
	applicationPortalPath,
	defectsPath,
	feedbackPath,
	loginPath,
	modelDetailsPath,
	modelsPath,
	noticeboardPath,
	modelImport,
	usersPath,
	clientsPath,
	sitePath,
	applicationListPath,
	siteAppPath,
	servicesPath,
	clientPath,
} from "helpers/routePaths";
import "./App.scss";
import Portal from "pages/ApplicationPortal/Portal";
import ServicesPage from "pages/Services/Links/ServicesPage";
import ModelsPage from "pages/Models/Links/ModelsPage";
import DefectsPage from "pages/Defects/Links/DefectsPage";
import AnalyticsPage from "pages/Analytics/Links";
import FeedbackPage from "pages/Feedback/Links/FeedbackPage";
import NoticeBoardsPage from "pages/Noticeboards/Links/NoticeBoards";
import ModelDetailPage from "pages/Models/ModelDetails/Links/ModelDetailPage";
import AccessRoute from "components/HOC/AccessRoute";
import ModelMapData from "pages/Models/ModelMapData";
import UsersPage from "pages/Users/Links/UsersPage";
import { userRoutes } from "pages/Users/Links/UserPage";
import SingleComponent from "pages/Users/Links/SingleComponent";
import SitePage from "pages/Clients/Sites/Links/SitePage";
import ApplicationPage from "pages/Applications/Links/ApplicationPage";
import SiteAppPage from "pages/Clients/Sites/SiteApplication/Links/SiteAppPage";
import ClientPage from "pages/Clients/Links/ClientPage";
import RoleRoute, { RoleRoutes } from "components/HOC/RoleRoute";
import roles from "helpers/roles";
import ClientDetails from "pages/Clients/ClientDetailScreen/ClientDetails";
import ProtectedLogin from "components/HOC/ProtectedLogin";
const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path="/" element={<Navigate to={loginPath} />} />
			<Route
				path={loginPath}
				element={
					<ProtectedLogin>
						<Login />
					</ProtectedLogin>
				}
			/>
			<Route path="/forgot-password" element={<ForgotPassword />} />
			<Route path="/ResetPassword" element={<ResetPassword />} />
			<Route path="/register" element={<RegisterUserEmail />} />
			<Route path="/launch" element={<Launch />} />

			{/* Protected Routes */}
			<Route
				path={appPath}
				element={
					<ProtectedRoute>
						<MainApp />
					</ProtectedRoute>
				}
			>
				{/* PORTAL PAGE */}
				<Route path={applicationPortalPath} element={<Portal />} />
				{/* CLIENTS PAGE */}
				<Route path={`${clientsPath}/*`} element={<ClientPage />} />
				<Route element={<RoleRoute roles={[roles.clientAdmin]} />}>
					<Route path={`${clientPath}/:id`} element={<ClientDetails />} />
				</Route>
				{/* APPLICATIONS PAGE */}
				<Route
					path={`${applicationListPath}/*`}
					element={<ApplicationPage />}
				/>
				{/* SITES PAGE */}
				<Route path={`${sitePath}/*`} element={<SitePage />} />
				{/* SITE APPLICATIONS PAGE */}

				<Route path={`${siteAppPath}/*`} element={<SiteAppPage />} />

				{/* MODEL PAGES */}
				<Route path={`${modelsPath}/*`} element={<ModelsPage />} />
				<Route element={<AccessRoute access={access.modelAccess} />}>
					<Route path={`${modelImport}/:modelId`} element={<ModelMapData />} />
				</Route>
				{/* SERVICE PAGES */}
				<Route path={`${servicesPath}/*`} element={<ServicesPage />} />
				{/* DEFECTS PAGES */}
				<Route path={`${defectsPath}/*`} element={<DefectsPage />} />
				{/*  ANALYTICS PAGES */}
				<Route path={`${analyticsPath}/*`} element={<AnalyticsPage />} />
				{/* FEEDBACK PAGES */}
				<Route path={`${feedbackPath}/*`} element={<FeedbackPage />} />
				{/* NOTICEBOARD PAGE	 */}
				<Route path={noticeboardPath} element={<NoticeBoardsPage />} />
				{/* USER PAGES */}
				<Route path={usersPath} element={<UsersPage />} />
				{userRoutes.map((x) => (
					<Route
						key={x.id}
						path={x.path}
						element={<SingleComponent {...x} />}
					/>
				))}
			</Route>
			<Route
				path="/report/:id/print"
				element={
					<ProtectedRoute>
						<Test />
					</ProtectedRoute>
				}
			/>
		</>
	)
);
function App() {
	return (
		<div className="App">
			<ErrorDialog />
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
