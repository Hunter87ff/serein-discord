export const config = {
    mongoURI: process.env.MONGODB_URI || "mongodb://localhost:27017/serein",
    token: process.env.DISCORD_TOKEN,
    prefix: "!",
    nodelink : {
        host : process.env.NODELINK_HOST || "localhost",
        port : process.env.NODELINK_PORT || 2333,
        password : process.env.NODELINK_PASSWORD || "youshallnotpass",
        secure : process.env.NODELINK_SECURE === "true" ? true : false
    }
}

export default config;