import Serein from "#/core/bot";
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder,
} from "discord.js";

declare type InteractionExecuteFN = (client: Serein, interaction: ChatInputCommandInteraction<"cached">) => any;
declare type AutoCompleteExecuteFN = (client: Serein, interaction: AutocompleteInteraction) => any;

export interface Command {
    data: SlashCommandBuilder;
    execute: InteractionExecuteFN;
    autocomplete?: AutoCompleteExecuteFN;
}