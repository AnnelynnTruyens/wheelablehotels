import { useState } from "react";
import styles from "../Forms.module.css";
import { createRoom } from "../../../services/RoomService";
import Progress from "./Partials/Progress";
import AddRoom from "./Partials/AddRoom";

interface AddRoomsProps {
	goToNext: () => void;
	goToPrevious: () => void;
	hotelId: string;
}

const AddRooms: React.FC<AddRoomsProps> = ({
	goToNext,
	goToPrevious,
	hotelId,
}) => {
	const [roomIds, setRoomIds] = useState<number[]>([0]);
	const [roomDataList, setRoomDataList] = useState<any[]>([]);
	const [error, setError] = useState<Error | null>(null);

	const addRoom = () => {
		setRoomIds((prev) => [...prev, prev.length]);
	};

	const removeRoom = (roomId: number) => {
		setRoomIds((prev) => prev.filter((id) => id !== roomId));
		setRoomDataList((prev) => prev.filter((_, index) => index !== roomId));
	};

	const handleRoomDataChange = (roomId: number, data: any) => {
		setRoomDataList((prev) => {
			const updated = [...prev];
			updated[roomId] = data;
			return updated;
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		try {
			for (const roomData of roomDataList) {
				const roomBody = {
					...roomData,
					hotelId,
				};
				await createRoom(roomBody);
			}
			goToNext();
		} catch (err: any) {
			console.error("Error creating rooms:", err);
			setError(err);
		}
	};

	return (
		<div className={styles.container_full}>
			<Progress step={3} />
			<h1 className={styles.title}>Add rooms</h1>
			<p>Please only add accessible rooms.</p>

			<form method="post" className={styles.form} onSubmit={handleSubmit}>
				{roomIds.map((roomId) => (
					<div key={roomId} className={styles.roomContainer}>
						<AddRoom
							onDataChange={(data) => handleRoomDataChange(roomId, data)}
							roomId={roomId}
						/>
						<button type="button" onClick={() => removeRoom(roomId)}>
							Delete
						</button>
					</div>
				))}

				<button type="button" onClick={addRoom}>
					Add another room
				</button>

				{error && <p className={styles.error}>Error: {error.message}</p>}

				<div className={styles.buttons}>
					<button type="button" onClick={goToPrevious}>
						Previous
					</button>
					<button type="submit">Next</button>
				</div>
			</form>
		</div>
	);
};

export default AddRooms;
