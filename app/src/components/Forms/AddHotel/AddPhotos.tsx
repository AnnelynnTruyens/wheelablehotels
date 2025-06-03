import { useState } from "react";
import styles from "../Forms.module.css";
import Progress from "./Partials/Progress";
import FormFileInput from "../Partials/FormFileInput";

interface AddPhotosProps {
	goToNext: () => void; // Callback to handle going to next step
	goToPrevious: () => void; // Callback to handle going to previous step
}

const AddPhotos: React.FC<AddPhotosProps> = ({ goToNext, goToPrevious }) => {
	const [hotelFiles, setHotelFiles] = useState<FileList | null>(null);
	const [roomFiles, setRoomFiles] = useState<FileList | null>(null);

	const handleHotelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setHotelFiles(e.target.files);
		}
	};

	const handleRoomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setRoomFiles(e.target.files);
		}
	};

	return (
		<div className={styles.container_full}>
			<Progress />
			<h1 className={styles.title}>Add photos</h1>
			<form method="post" className={styles.form} onSubmit={goToNext}>
				<FormFileInput
					label="General"
					id="hotelImages"
					name="hotelImages"
					onChange={handleHotelFileChange}
				/>
				{hotelFiles && (
					<div>
						<p>Selected Files:</p>
						<ul>
							{Array.from(hotelFiles).map((file, index) => (
								<li key={index}>{file.name}</li>
							))}
						</ul>
					</div>
				)}
				<FormFileInput
					label="Room name"
					id="roomImages"
					name="roomImages"
					onChange={handleRoomFileChange}
				/>
				{roomFiles && (
					<div>
						<p>Selected Files:</p>
						<ul>
							{Array.from(roomFiles).map((file, index) => (
								<li key={index}>{file.name}</li>
							))}
						</ul>
					</div>
				)}
				<div className={styles.buttons}>
					<button onClick={goToPrevious}>Previous</button>
					<button type="submit">Next</button>
				</div>
			</form>
		</div>
	);
};

export default AddPhotos;
