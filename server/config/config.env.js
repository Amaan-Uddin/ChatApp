module.exports = {
	allowedOrigins: String(process.env.ALLOWED_ORIGINS),
	serverPort: String(process.env.PORT),
	mongodbURI: String(process.env.MONGODB_URI),
	privateAccessKey: String(process.env.PRIVATE_ACCESS_KEY),
	publicAccessKey: String(process.env.PUBLIC_ACCESS_KEY),
	privateRefreshKey: String(process.env.PRIVATE_REFRESH_KEY),
	publicRefreshKey: String(process.env.PUBLIC_REFRESH_KEY),
}
