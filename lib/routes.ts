import { ServerRoutes } from "@rewind-media/rewind-protocol";

export namespace WebRoutes {
  export const root = `${ServerRoutes.root}`;
  export namespace Browse {
    export const root = `${WebRoutes.root}browse/`;
    export const home = `${root}home`;
    export const show = `${root}show/:show`;
    export const season = `${root}season/:season`;
    export const episode = `${root}episode/:episode`;

    export const formatShowRoute = (showId: string) =>
      show.replace(":show", showId);
    export const formatSeasonRoute = (seasonId: string) =>
      season.replace(":season", seasonId);
    export const formatEpisodeRoute = (library: string) =>
      episode.replace(":episode", library);

    export namespace Library {
      export const root = `${Browse.root}lib/:library/`;
      export const show = `${root}show`;
      export const formatShowRoute = (libraryId: string) =>
        show.replace(":library", libraryId);
    }

    export namespace Settings {
      export const root = `${Browse.root}settings/`;
      export const client = `${root}client`;
      export const user = `${root}user`;

      export namespace Admin {
        export const root = `${Settings.root}admin/`;
        export const users = `${root}users`;
      }
    }
  }

  export namespace View {
    export const root = `${WebRoutes.root}view/`;
    export const show = `${root}show/:library/:id`;
    export const formatPlayerRoute = (library: string, id: string) =>
      `${root}show/${library}/${id}`;
  }

  export namespace Auth {
    export const root = `${WebRoutes.root}auth/`;
    export const login = `${root}login`;
  }
}
