import config from "#/config";
import { logger } from "#/utils/logging";
import { Client, type Message } from "discord.js";

export default class Serein extends Client {
    public logger = logger;
    constructor() {
        super({
            intents: [
                "Guilds",
                "GuildMessages",
                "MessageContent",
                "GuildMembers",
                "GuildMessageReactions",
            ],
        });

    }

    async onReady() {
        this.logger.info(`Logged in as ${this.user?.tag}`);
    }

    async onMessageCreate(message: Message) {
        if (message.author.bot || !message.guild) return;
    }

    async start() {
        this.on("clientReady", this.onReady.bind(this));
        this.on("messageCreate", this.onMessageCreate.bind(this));
        await this.login(config.token);
    }
}
