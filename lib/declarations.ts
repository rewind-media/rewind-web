import { ClientUser } from "@rewind-media/rewind-protocol";
import React from "react";

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
