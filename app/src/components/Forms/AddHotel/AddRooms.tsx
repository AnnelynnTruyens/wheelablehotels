import React, { useState } from "react";
import styles from "../Forms.module.css";
import AddRoom from "./Partials/AddRoom";
import Progress from "./Partials/Progress";

interface AddRoomsProps {
	goToNext: () => void; // Callback to handle going to next step
	goToPrevious: () => void; // Callback to handle going to previous step
}

const AddRooms: React.FC<AddRoomsProps> = ({ goToNext, goToPrevious }) => {
	// State to manage the list of rooms
	const [roomIds, setRoomIds] = useState<number[]>([0]); // Start with one room
	const [roomDataList, setRoomDataList] = useState<any[]>([]); // State to store room data

	// Function to add another room
	const addRoom = () => {
		setRoomIds((prevRoomIds) => [...prevRoomIds, prevRoomIds.length]); // Add a new room ID
	};

	// Function to remove a specific room
	const removeRoom = (roomId: number) => {
		setRoomIds((prevRoomIds) => prevRoomIds.filter((id) => id !== roomId)); // Remove the room ID
		setRoomDataList((prevDataList) =>
			prevDataList.filter((_, index) => index !== roomId)
		); // Remove the room data
	};

	// Function to handle room data change
	const handleRoomDataChange = (roomId: number, data: any) => {
		setRoomDataList((prevDataList) => {
			const newDataList = [...prevDataList];
			newDataList[roomId] = data;
			return newDataList;
		});
	};

	// Function to handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Collect data from all AddRoom components
		console.log("Submitting rooms:", roomDataList);

		// Proceed to the next step
		goToNext();
	};

	return (
		<div className={styles.container_full}>
			<Progress step={3} />
			<h1 className={styles.title}>Add rooms</h1>
			<p>Please only add accessible rooms.</p>

			<form method="post" className={styles.form} onSubmit={handleSubmit}>
				{/* Render multiple AddRoom components */}
				{roomIds.map((roomId) => (
					<div key={roomId} className={styles.roomContainer}>
						<AddRoom
							onDataChange={(data) => handleRoomDataChange(roomId, data)}
						/>
						<button
							type="button"
							className={styles.deleteButton}
							onClick={() => removeRoom(roomId)}
						>
							Delete
						</button>
					</div>
				))}

				{/* Button to add another room */}
				<button type="button" onClick={addRoom}>
					Add another room
				</button>

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
