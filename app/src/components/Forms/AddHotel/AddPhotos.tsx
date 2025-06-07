import { useState } from "react";
import styles from "../Forms.module.css";
import Progress from "./Partials/Progress";
import FormFileInput from "../Partials/FormFileInput";
import { createImage } from "../../../services/ImageService";

interface AddPhotosProps {
	goToNext: () => void; // Callback to handle going to next step
	goToPrevious: () => void; // Callback to handle going to previous step
	hotelId: string;
}

const AddPhotos: React.FC<AddPhotosProps> = ({
	goToNext,
	goToPrevious,
	hotelId,
}) => {
	const [files, setFiles] = useState<FileList | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles(e.target.files);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const uploadImages = async (
				files: FileList,
				meta: { hotelId?: string; roomId?: string }
			) => {
				if (!files || files.length === 0) {
					console.warn("No files to upload");
					return;
				}
				for (const file of Array.from(files)) {
					const formData = new FormData();
					formData.append("file", file);
					formData.append("name", file.name);
					formData.append("alt", file.name);
					if (meta.hotelId) formData.append("hotelId", meta.hotelId);
					if (meta.roomId) formData.append("roomId", meta.roomId);
					await createImage(formData); // assuming `createImage` handles FormData
				}
			};

			if (files) {
				await uploadImages(files, { hotelId });
			}

			goToNext();
		} catch (err) {
			console.error("Failed to upload images", err);
		}
	};

	return (
		<div className={styles.container_full}>
			<Progress step={4} />
			<h1 className={styles.title}>Add photos</h1>
			<form method="post" className={styles.form} onSubmit={handleSubmit}>
				<FormFileInput
					label="General"
					id="hotelImages"
					name="hotelImages"
					onChange={handleFileChange}
				/>
				<div className={styles.buttons}>
					<button onClick={goToPrevious}>Previous</button>
					<button type="submit">Next</button>
				</div>
			</form>
		</div>
	);
};

export default AddPhotos;
