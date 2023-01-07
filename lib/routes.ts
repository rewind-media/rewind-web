import { ServerRoutes } from "@rewind-media/rewind-protocol";

export namespace WebRoutes {
  export const root = `${ServerRoutes.root}`;

  export const home = `${root}home`;

  export const show = `${root}show/:showId`;
  export const formatShowRoute = (showId: string) =>
    show.replace(":showId", showId);

  export const season = `${root}season/:seasonId`;
  export const formatSeasonRoute = (seasonId: string) =>
    season.replace(":seasonId", seasonId);

  export const episode = `${root}episode/:episodeId`;
  export const formatEpisodeRoute = (episodeId: string) =>
    episode.replace(":episodeId", episodeId);

  export const library = `${root}library/:libraryId`;
  export const formatLibraryRoute = (libraryId: string) =>
    library.replace(":libraryId", libraryId);

  export const player = `${root}player/:libraryId/:mediaId`;
  export const formatPlayerRoute = (libraryId: string, mediaId: string) =>
    player.replace(":libraryId", libraryId).replace(":mediaId", mediaId);

  export namespace Settings {
    export const root = `${WebRoutes.root}settings/`;
    export const client = `${root}client`;
    export const user = `${root}user`;

    export namespace Admin {
      export const root = `${Settings.root}admin/`;
      export const users = `${root}users`;
      export const libraries = `${root}libraries`;
    }
  }

  export namespace Auth {
    export const root = `${WebRoutes.root}auth/`;
    export const login = `${root}login`;
  }
}
