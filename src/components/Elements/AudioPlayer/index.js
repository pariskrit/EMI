import React, { useEffect } from "react";

function AudioPlayer({ audioSource = "", width = "350px" }) {
	useEffect(() => {
		//check audio percentage and update time accordingly
		const audioPlayer = document.querySelector(".audio-player");
		const audio = new Audio(audioSource);
		const playBtn = audioPlayer?.querySelector(".controls .toggle-play");

		const loadedMetaData = () => {
			audioPlayer.querySelector(
				".time .length"
			).textContent = getTimeCodeFromNum(audio.duration);
			audio.volume = 0.75;
		};

		audio.addEventListener("loadeddata", loadedMetaData, false);

		const durationandCurrentTime = setInterval(() => {
			const progressBar = audioPlayer.querySelector(".progress");
			progressBar.style.width =
				Math.floor((audio.currentTime / audio.duration) * 100) + "%";
			audioPlayer.querySelector(
				".time .current"
			).textContent = getTimeCodeFromNum(audio.currentTime);
			if (progressBar.style.width === "100%") {
				playBtn.classList.add("play");
				playBtn.classList.remove("pause");
			}
		}, 1000);

		//click on timeline to skip around
		const timeline = audioPlayer?.querySelector(".timeline");
		const timeLineOfplayer = (e) => {
			const timelineWidth = window.getComputedStyle(timeline).width;
			const timeToSeek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
			audio.currentTime = timeToSeek;
		};
		audioPlayer?.querySelector(".timeline") &&
			timeline.addEventListener("click", timeLineOfplayer, false);

		//click volume slider to change volume
		const volumeSlider = audioPlayer?.querySelector(".controls .volume-slider");
		const volumeSettings = (e) => {
			const sliderWidth = window.getComputedStyle(volumeSlider).width;
			const newVolume = e.offsetX / parseInt(sliderWidth);
			audio.volume = newVolume;
			audioPlayer.querySelector(".controls .volume-percentage").style.width =
				newVolume * 100 + "%";
		};
		audioPlayer?.querySelector(".controls .volume-slider") &&
			volumeSlider.addEventListener("click", volumeSettings, false);

		//toggle between playing and pausing on button click
		const playSetting = () => {
			if (audio.paused) {
				playBtn.classList.remove("play");
				playBtn.classList.add("pause");
				audio.play();
			} else {
				playBtn.classList.remove("pause");
				playBtn.classList.add("play");
				audio.pause();
			}
		};

		const volumeSetting = () => {
			const volumeEl = audioPlayer.querySelector(".volume-container .volume");
			audio.muted = !audio.muted;
			if (audio.muted) {
				volumeEl.classList.remove("icono-volumeMedium");
				volumeEl.classList.add("icono-volumeMute");
			} else {
				volumeEl.classList.add("icono-volumeMedium");
				volumeEl.classList.remove("icono-volumeMute");
			}
		};
		audioPlayer?.querySelector(".controls .toggle-play") &&
			playBtn.addEventListener("click", playSetting, false);

		audioPlayer?.querySelector(".volume-button") &&
			audioPlayer
				.querySelector(".volume-button")
				.addEventListener("click", volumeSetting);

		//turn 128 seconds into 2:08
		function getTimeCodeFromNum(num) {
			let seconds = parseInt(num);
			let minutes = parseInt(seconds / 60);
			seconds -= minutes * 60;
			const hours = parseInt(minutes / 60);
			minutes -= hours * 60;

			if (hours === 0)
				return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
			return `${String(hours).padStart(2, 0)}:${minutes}:${String(
				seconds % 60
			).padStart(2, 0)}`;
		}

		return () => {
			audioPlayer
				.querySelector(".volume-button")
				.removeEventListener("click", volumeSetting);
			playBtn.removeEventListener("click", playSetting, false);
			volumeSlider.removeEventListener("click", volumeSettings, false);
			timeline.removeEventListener("click", timeLineOfplayer, false);
			audio.removeEventListener("loadeddata", loadedMetaData, false);
			clearInterval(durationandCurrentTime);
		};
	}, [audioSource]);

	return (
		<section style={{ width }}>
			<div className="rt-container">
				<div className="col-rt-12">
					<div className="Scriptcontent">
						<div className="audio-player">
							<div className="controls">
								<div className="play-container">
									<div className="toggle-play play"></div>
								</div>
								<div className="timeline">
									<div className="progress-container">
										<div className="progress-background"></div>
										<div className="progress"></div>
									</div>

									<div className="time">
										<div className="current">0:00</div>
										<div className="divider">/</div>
										<div className="length"></div>
									</div>
								</div>

								<div className="volume-container">
									<div className="volume-button">
										<div className="volume icono-volumeMedium"></div>
									</div>

									<div className="volume-slider">
										<div className="volume-percentage"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default AudioPlayer;
