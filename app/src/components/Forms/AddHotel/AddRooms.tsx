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
					<div key={roomId} className={styles.room_container}>
						<AddRoom
							onDataChange={(data) => handleRoomDataChange(roomId, data)}
							roomId={roomId}
						/>
						<button
							type="button"
							className={styles.delete_btn}
							onClick={() => removeRoom(roomId)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								aria-label="delete button"
							>
								<path
									d="M3 6H5M5 6H21M5 6V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M10 11V17M14 11V17"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
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
