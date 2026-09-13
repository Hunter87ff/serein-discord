import { Client } from "discord.js";
import config from "#/config";


export default class Serein extends Client {
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

    async start() {
        await this.login(config.token);
    }

}

