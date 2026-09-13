import config from "#/config";
import {loadContextCommands} from "#/commands";
import type { ContextCommand } from "#/types/commands";
import { Client, Collection, type Message } from "discord.js";

export default class Serein extends Client {
    public commands: Collection<string, ContextCommand> = new Collection();
    public aliases: Collection<string, string> = new Collection();

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
        console.log(`Logged in as ${this.user?.tag}`);

        // Initialize commands instance to be used by commands registration
        await loadContextCommands(this);
    }

    async onMessageCreate(message: Message) {
        if (message.author.bot || !message.guild) return;

        const prefix = config.prefix;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;

        const command =
            this.commands.get(commandName) ||
            this.commands.get(this.aliases.get(commandName) || "");

        if (!command) return;

        try {
            await command.execute(this, message, args);
        } catch (error) {
            console.error(`Error executing context command ${commandName}:`, error);
            await message.reply("There was an error trying to execute that command!").catch(() => {});
        }
    }

    async start() {
        this.on("clientReady", this.onReady.bind(this));
        this.on("messageCreate", this.onMessageCreate.bind(this));
        await this.login(config.token);
    }
}
