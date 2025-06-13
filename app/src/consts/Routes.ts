const ROUTES = {
	home: "/",
	hotelOverview: "/search",
	hotelDetail: { path: "/hotel/:hotelName", to: "/hotel/" },
	addReview: { path: "/hotel/review/:hotelName/", to: "/hotel/review/" },

	login: "/login",
	register: "/register",

	userDashboard: "/profile",
	favourites: "/favourites",

	userProfile: { path: "/user/:userName", to: "/user/" },

	addHotel: "/hotel/add",

	adminDashboard: "/admin",
	adminHotels: "/admin/hotels",
	adminUsers: "/admin/users",

	contact: "/contact",
	accessibility: "/accessibility-statement",
	privacy: "/privacy-policy",

	notFound: "*", // 404
};

export default ROUTES;
