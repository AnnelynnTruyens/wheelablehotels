import { useState } from "react";
import AddStart from "../../components/Forms/AddHotel/AddStart";
import AddHotelInfo from "../../components/Forms/AddHotel/AddHotelInfo";
import AddRooms from "../../components/Forms/AddHotel/AddRooms";
import AddPhotos from "../../components/Forms/AddHotel/AddPhotos";
import AddHotelOverview from "../../components/Forms/AddHotel/AddHotelOverview";

const AddHotel = () => {
	const [step, setStep] = useState<number>(1);

	const goToNext = () => {
		const newStep = step + 1;
		setStep(newStep);
	};

	const goToPrevious = () => {
		const newStep = step - 1;
		setStep(newStep);
	};

	const handleSubmit = () => {
		console.log("Form submitted");
	};

	if (step === 1)
		return (
			<main id="main">
				<title>Add hotel | Wheelable Hotels</title>

				<AddStart goToNext={goToNext} />
			</main>
		);
	else if (step === 2)
		return (
			<main id="main">
				<title>Add hotel | Wheelable Hotels</title>

				<AddHotelInfo goToNext={goToNext} goToPrevious={goToPrevious} />
			</main>
		);
	else if (step === 3)
		return (
			<main id="main">
				<title>Add hotel | Wheelable Hotels</title>

				<AddRooms goToNext={goToNext} goToPrevious={goToPrevious} />
			</main>
		);
	else if (step === 4)
		return (
			<main id="main">
				<title>Add hotel | Wheelable Hotels</title>

				<AddPhotos goToNext={goToNext} goToPrevious={goToPrevious} />
			</main>
		);
	else if (step === 5)
		return (
			<main id="main">
				<title>Add hotel | Wheelable Hotels</title>

				<AddHotelOverview
					goToPrevious={goToPrevious}
					handleSubmit={handleSubmit}
				/>
			</main>
		);
	else
		return (
			<main id="main">
				<title>Add hotel | Wheelable Hotels</title>
				<h1>Add hotel</h1>
				<p>Something went wrong, try again.</p>
			</main>
		);
};

export default AddHotel;
