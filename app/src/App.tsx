import "./App.css";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import AuthContainer from "./contexts/AuthContainer";
import { AuthProvider } from "./contexts/AuthContext";
import Authentication from "./pages/Authentication/Authentication";

function App() {
	return (
		<>
			<AuthProvider>
				<AuthContainer>
					<Header />
					<Authentication />
					<Footer />
				</AuthContainer>
			</AuthProvider>
		</>
	);
}

export default App;
