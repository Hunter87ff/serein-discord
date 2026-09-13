import type { ContextCommand } from "#/types/commands";

const pingCommand: ContextCommand = {
    name: "ping",
    description: "Check bot latency and API ping.",
    aliases: ["latency"],
    execute: async (client, message) => {
        const sent = await message.reply("Pinging...");
        const latency = sent.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        await sent.edit(`🏓 Pong!\n- **Bot Latency:** \`${latency}ms\`\n- **API Latency:** \`${apiLatency}ms\``);
    },
};

export default pingCommand;