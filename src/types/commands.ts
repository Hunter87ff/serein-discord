import type Serein  from "#/core/bot";
import type { Message } from "discord.js";

export interface ContextCommand {
    name: string;
    description: string;
    aliases?: string[];
    execute: (client: Serein, message: Message, args: string[]) => Promise<void> | void;
}