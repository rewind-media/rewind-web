import { ClientUser } from "@rewind-media/rewind-protocol";

declare global {
  namespace Express {
    interface User extends ClientUser {}
  }
}

declare global {
  namespace Express {
    interface User extends ClientUser {}
  }
}
