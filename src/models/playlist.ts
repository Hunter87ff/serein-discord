import {Model, Schema, model} from "mongoose";

export interface IPlaylist {
    name: string;
    tracks: string[];
    userId: string;
}

const playlistSchema = new Schema<IPlaylist>({
    name: {
        type: String,
        required: true,
    },
    tracks: {
        type: [String],
        default: [],
    },
    userId: {
        type: String,
        required: true,
    },
});

export const Playlist: Model<IPlaylist> = model<IPlaylist>("Playlist", playlistSchema);