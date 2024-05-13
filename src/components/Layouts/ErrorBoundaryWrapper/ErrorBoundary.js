import React from "react";
import ErrorBoundaryFallback from "components/Elements/ErrorBoundaryFallback";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}
	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo,
		});
	}

	render() {
		if (this.state.hasError) {
			return (
				<ErrorBoundaryFallback
					error={{
						message: "Something went wrong. Please try again later.",
						status: true,
					}}
				/>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
