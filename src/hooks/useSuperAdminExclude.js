import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const useSuperAdminExclude = () => {
	const history = useHistory();
	const isLoading = useSelector((state) => state.commonData.isLoading);
	const { position } = JSON.parse(localStorage.getItem("me"));
	if (!isLoading) {
		if (position === null) {
			if (history.length > 1) {
				history.goBack();
			} else {
				history.push("/app/me");
			}
		}
	}
};

export default useSuperAdminExclude;
