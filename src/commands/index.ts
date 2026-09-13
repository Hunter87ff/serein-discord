import type Serein from "#/core/bot";
import context from "./context";



export async function loadContextCommands(client: Serein) {
    let _count = 0;
    for (const command of context) {
        client.commands.set(command.name, command);
        if (command.aliases) {
            for (const alias of command.aliases) {
                client.aliases.set(alias, command.name);
            }
        }
        _count++;
    }
    console.log(`Loaded ${_count} context commands.`);
}
