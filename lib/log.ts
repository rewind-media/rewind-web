import {CategoryProvider} from "typescript-logging-category-style";
import {LogLevel} from "typescript-logging";

export const WebLog = CategoryProvider.createProvider("RewindLogProvider", {
    level: LogLevel.Info,
}).getCategory("rewind").getChildCategory("web")