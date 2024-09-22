import "./importer/logger";
import { expressConfig } from "./interfaces/Iexpress";
import { payloadHandler } from "./services/payloadHandler";

export default async function (payload: expressConfig) {
    try {
        let configured: { [key: string]: boolean } = {};
        await payloadHandler(payload, configured);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
