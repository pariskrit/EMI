import { useEffect, useState, useRef, useMemo } from "react";

function useInfiniteScroll(
	data,
	count,
	fetchData,
	page,
	searchText,
	scrollEvent = window
) {
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);
	const dataRef = useRef(data);
	const countRef = useRef(count);
	const pageRef = useRef(page.pageNo);
	const prevPageRef = useRef(0);

	useMemo(() => {
		dataRef.current = data;
		countRef.current = count;
		pageRef.current = page.pageNo;
	}, [data, count, page.pageNo]);

	useEffect(() => {
		setHasMore(true);
		pageRef.current = 1;
	}, [searchText]);

	useEffect(() => {
		prevPageRef.current = page.pageNo === 1 ? 0 : prevPageRef.current;
	}, [page.pageNo]);

	const fetchMoreData = async () => {
		if (countRef.current / pageRef.current <= page.pageSize) {
			setHasMore(false);
			return;
		}

		if (prevPageRef.current !== pageRef.current) {
			prevPageRef.current = pageRef.current;
			setLoading(true);
			await fetchData(pageRef.current, dataRef.current);
			setLoading(false);
		}
	};

	// useEffect(() => {
	// 	window.addEventListener("scroll", handleScroll);
	// 	return () => window.removeEventListener("scroll", handleScroll);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	const handleScroll = async (event, uniqueId) => {
		if (loading) return;

		if (
			Math.floor(
				document.getElementById(uniqueId).offsetHeight +
					document.getElementById(uniqueId).scrollTop
			) -
				document.getElementById(uniqueId).scrollHeight >=
			0
		) {
			await fetchMoreData();
		}
	};
	const gotoTop = () => {
		scrollEvent.scroll({ top: 0, left: 0, behavior: "smooth" });
	};
	return { hasMore, loading, gotoTop, handleScroll };
}

export default useInfiniteScroll;
