import SiteWrapper from "components/SiteWrapper";
import { siteScreenNavigation } from "helpers/constants";
import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

const SiteWrapperHOC = () => (WrappedComponent) => {
	const App = (props) => {
		const { id, clientId } = useParams();
		const history = useHistory();
		const [modal, setModal] = useState({ import: false, add: false });
		const toggleAddModal = (show) => {
			setModal((th) => ({ ...th, add: show }));
		};
		return (
			<SiteWrapper
				current={current}
				navigation={siteScreenNavigation}
				onNavClick={(urlToGo) =>
					history.push(`/client/${clientId}/site/${id}${urlToGo}`)
				}
				status=""
				lastSaved=""
				showAdd
				onClickAdd={() => setModal((th) => ({ ...th, add: true }))}
				Component={() => (
					<WrappedComponent
						{...props}
						modal={modal}
						toggleAddModal={toggleAddModal}
					/>
				)}
			/>
		);
	};
	return App;
};

export default SiteWrapperHOC;
