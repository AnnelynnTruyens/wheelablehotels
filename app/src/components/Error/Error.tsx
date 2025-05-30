const Error = ({ message }: { message: string | undefined }) => {
	return (
		<main>
			<p role="log">Error: {message}</p>
		</main>
	);
};

export default Error;
