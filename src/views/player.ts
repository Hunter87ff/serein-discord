import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    type BaseMessageOptions,
    type ColorResolvable,
    type User,
} from "discord.js";
import type { Player, Track } from "lavalink-client";

export interface PlayerViewStateOptions {
    title?: string;
    uri?: string;
    thumbnail?: string | null;
    author?: string;
    durationFormatted?: string;
    requester?: User | { id: string; username?: string; toString: () => string } | null;
    autoplay?: boolean;
    loop?: "off" | "track" | "queue" | string;
    volume?: number;
    queueLength?: number;
    paused?: boolean;
    color?: ColorResolvable;
}

/**
 * Format milliseconds into human readable format like "2m 26s" or "1h 05m 20s"
 */
export function formatDuration(ms: number): string {
    if (!ms || isNaN(ms) || ms <= 0) return "0s";
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(" ");
}

/**
 * Helper to capitalize words
 */
function capitalize(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Builds the player UI message options (Embed + ActionRows)
 */
export function buildPlayerView(options: PlayerViewStateOptions): BaseMessageOptions {
    const {
        title = "Unknown Title",
        uri,
        thumbnail,
        author,
        durationFormatted = "0m 00s",
        requester,
        autoplay = false,
        loop = "off",
        volume = 100,
        queueLength = 0,
        paused = false,
        color = 0xfee75c, // Yellow bar like in the screenshot
    } = options;

    const requesterMention = requester ? (typeof requester === "string" ? `<@${requester}>` : requester.toString()) : "Unknown";

    const embed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({
            name: "NOW PLAYING",
            iconURL: "https://media.discordapp.net/attachments/1184938343025344685/1185268809582526514/nowplaying.gif", // Audio radar/playing icon
        })
        .setDescription(
            `**${uri ? `[${title}](${uri})` : title}**\n\n` +
            `• Duration: ${durationFormatted}\n` +
            `• Requester: ${requesterMention}\n\n` +
            `⚡ Autoplay: ${autoplay ? "On" : "Off"} • Loop: ${capitalize(loop)} • Volume: ${volume} • Queue: ${queueLength}`,
        );

    if (thumbnail) {
        embed.setThumbnail(thumbnail);
    }

    // Row 1: Playback controls: Previous, Loop, Play/Pause, Shuffle, Skip
    const playbackControlsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder({emoji: "⏮️", custom_id: "player_previous", style: ButtonStyle.Secondary}),
        new ButtonBuilder({emoji: "🔁", custom_id: "player_loop", style: loop !== "off" ? ButtonStyle.Primary : ButtonStyle.Secondary}),
        new ButtonBuilder({emoji: "⏯️", custom_id: "player_play_pause", style: paused ? ButtonStyle.Success : ButtonStyle.Secondary}),
        new ButtonBuilder({emoji: "🔀", custom_id: "player_shuffle", style: ButtonStyle.Secondary}),
        new ButtonBuilder({emoji: "⏭️", custom_id: "player_skip", style: ButtonStyle.Secondary}),
    );


    // Row 2: Secondary controls: Volume Down, Queue, Stop, Lyrics/Info, Volume Up
    const secondaryControlsRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder({emoji: "🔉", custom_id: "player_volume_down", style: ButtonStyle.Secondary}),
        new ButtonBuilder({emoji: "📑", custom_id: "player_queue", style: ButtonStyle.Secondary}),
        new ButtonBuilder({emoji: "⏹️", custom_id: "player_stop", style: ButtonStyle.Danger}),
        new ButtonBuilder({emoji: "📰", custom_id: "player_lyrics", style: ButtonStyle.Secondary}),
        new ButtonBuilder({emoji: "🔊", custom_id: "player_volume_up", style: ButtonStyle.Secondary}),
    );

    return {
        embeds: [embed],
        components: [playbackControlsRow, secondaryControlsRow],
    };
}

/**
 * Helper to build the view directly from a Lavalink Player instance
 */
export function buildPlayerViewFromPlayer(player: Player, track?: Track | null): BaseMessageOptions {
    const currentTrack = track ?? player.queue.current;

    return buildPlayerView({
        title: currentTrack?.info.title ?? "Nothing Playing",
        uri: currentTrack?.info.uri,
        thumbnail: currentTrack?.info.artworkUrl || currentTrack?.info.artworkUrl || null,
        author: currentTrack?.info.author,
        durationFormatted: currentTrack?.info.duration ? formatDuration(currentTrack.info.duration) : "0s",
        requester: (currentTrack?.requester as User | undefined) ?? null,
        autoplay: (player.getData("autoplay") as boolean) || false,
        loop: player.repeatMode || "off",
        volume: player.volume,
        queueLength: player.queue.tracks.length,
        paused: player.paused,
    });
}
