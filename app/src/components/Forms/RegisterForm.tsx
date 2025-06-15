import { Link, useNavigate } from "react-router";
import ROUTES from "../../consts/Routes";
import styles from "./Forms.module.css";
import FormInput from "./Partials/FormInput";
import { useState } from "react";
import { login, register } from "../../services/AuthService";
import Loading from "../Loading/Loading";

// Type register component
interface RegisterFormProps {
	onLogin: (token: string) => void; // Callback to handle login success
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onLogin }) => {
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		role: "user",
	});
	const [isLoading, setIsLoading] = useState<Boolean>(false);
	const [error, setError] = useState<string | undefined>();

	const { username, email, password, role } = formData;

	// Function to handle change in register form
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// Function to handle register
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		setIsLoading(true);
		register({ username, email, password, role })
			.then(() => {
				login({ email, password })
					.then(({ data }) => {
						onLogin(data.token);
						navigate(ROUTES.userDashboard);
						setIsLoading(false);
					})
					.catch((error) => {
						const message =
							error.response?.data?.message ||
							"Login failed. Please try again.";
						setError(message);
						navigate(ROUTES.login);
						setIsLoading(false);
					});
			})
			.catch((error) => {
				const message =
					error.response?.data?.message || "Register failed. Please try again.";
				setError(message);
				setIsLoading(false);
			});
	};

	if (isLoading) return <Loading />;
	else
		return (
			<div className={styles.container_center}>
				<p className={styles.title_small}>Join our community!</p>
				<form onSubmit={handleSubmit} className={styles.form}>
					<FormInput
						label="Username"
						type="text"
						id="username"
						name="username"
						value={username}
						placeholder="JohnDoe"
						onChange={handleChange}
						required={true}
						autocomplete="username"
					/>
					<FormInput
						label="Email"
						type="email"
						id="email"
						name="email"
						value={email}
						placeholder="john.doe@example.com"
						onChange={handleChange}
						required={true}
						autocomplete="email"
					/>
					<FormInput
						label="Password"
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={handleChange}
						required={true}
						autocomplete="new-password"
					/>
					{error && <p className={styles.error}>{error}</p>}
					<div className={styles.buttons}>
						<button type="submit">Register</button>
						<Link to={ROUTES.login}>I already have an account</Link>
					</div>
				</form>
			</div>
		);
};

export default RegisterForm;
