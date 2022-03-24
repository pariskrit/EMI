export const setPositionForPayload = (e, data) => {
	const { destination, source } = e;
	if (destination.index === data.length - 1) {
		return data[destination.index]?.pos + 1024;
	}
	if (destination.index === 0) {
		return data[destination.index]?.pos - 1024;
	}

	if (destination.index > source.index) {
		return (
			(+data[destination.index]?.pos + +data[e.destination.index + 1]?.pos) / 2
		);
	}
	return (
		(+data[destination.index]?.pos + +data[e.destination.index - 1]?.pos) / 2
	);
};
