import { productionConsole } from "../importer/logger";
import { IRoute, Iconfig, Ilogs, expressConfig } from "../interfaces/Iexpress";

export const payloadHandler = (
    payload: expressConfig,
    configured: { [key: string]: boolean }
) => {
    try {
        let { express, config, routes } = payload;
        let { https, port, host, cors, bodyParser } = express;
        let { logs, secureHeaders, production } = config as Iconfig;
        let { request, requestPayload, response } = logs as Ilogs;
        productionConsole(production as boolean);
        if (typeof port != "number") throw new Error(`port should be a number`);
        if (typeof host != "string") throw new Error(`host should be a string`);
        if (typeof bodyParser == "object") {
            if (typeof bodyParser.limit != "string")
                throw new Error(`limit should be a string`);
            if (!Array.isArray(bodyParser.contentType))
                throw new Error(`contentType should be an array`);
            configured.bodyParser = true;
        }
        if (typeof cors == "object") {
            if (!Array.isArray(cors.origin))
                throw new Error(`origin should be an array`);
            if (typeof cors.methods != "string")
                throw new Error(`methods should be a string`);
            if (typeof cors.allowedHeaders != "string")
                throw new Error(`allowedHeaders should be a string`);
            if (typeof cors.exposedHeaders != "string")
                throw new Error(`exposedHeaders should be a string`);
            if (typeof cors.credentials != "boolean")
                throw new Error(`credentials should be a boolean`);
            if (typeof cors.preflightContinue != "boolean")
                throw new Error(`preflightContinue should be a boolean`);
            if (typeof cors.optionsSuccessStatus != "number")
                throw new Error(`optionsSuccessStatus should be a number`);
            configured.cors = true;
        }
        if (https?.cert && https?.key) {
            console.log(`Server is starting on 'https' protocol`);
            configured.https = true;
        } else {
            throw new Error(
                `Cert or Key is missing or invalid path for 'https' protocol`
            );
        }
        if (typeof config?.routePrefix == "string")
            throw new Error(`routes prefix should be strin`);
        if (String(config?.routePrefix)[0] != "/")
            throw new Error(`Please add valid path, (use '/' at starting)`);
        if (String(config?.routePrefix)[-1] == "/")
            throw new Error(`Don't add '/' at end in path`);
        if (typeof logs == "object") {
            if (typeof request != "boolean")
                throw new Error(`request should be a boolean`);
            if (typeof requestPayload != "boolean")
                throw new Error(`requestPayload should be a boolean`);
            if (typeof response != "boolean")
                throw new Error(`response should be a boolean`);
            configured.logs = true;
        }
        if (typeof secureHeaders == "object") {
            if (typeof secureHeaders.contentSecurityPolicy != "string")
                throw new Error(`contentSecurityPolicy should be a string`);
            if (typeof secureHeaders.frameGuard != "string")
                throw new Error(`frameGuard should be a string`);
            if (typeof secureHeaders.xssFilter != "string")
                throw new Error(`xssFilter should be a string`);
            if (typeof secureHeaders.contentTypeOptions != "string")
                throw new Error(`contentTypeOptions should be a string`);
            if (typeof secureHeaders.referrerPolicy != "string")
                throw new Error(`referrerPolicy should be a string`);
            if (typeof secureHeaders.featurePolicy != "string")
                throw new Error(`featurePolicy should be a string`);
            configured.secureHeaders = true;
        }
        if (typeof routes == "object") {
            if (!Array.isArray(routes))
                throw new Error(`routes should be an array`);
            routes.forEach((route: IRoute) => {
                validateRoute(route);
            });
        }
    } catch (e) {
        console.error("Error while validate payload", e);
        throw new Error(e as string);
    }
};
const validateRoute = (route: IRoute) => {
    if (typeof route?.path != "string")
        throw new Error(`prefix should be a string`);
    if (String(route.path)[0] != "/")
        throw new Error(`Please add valid path, (use '/' at starting)`);
    if (String(route.path)[-1] == "/")
        throw new Error(`Don't add '/' at end in path`);
    if (!Array.isArray(route?.middleware))
        throw new Error(`middlewares should be an array`);
    if (!Array.isArray(route?.routes))
        throw new Error(`routes should be an array`);
    if (!["get", "post", "put", "delete", "patch"].includes(route?.method))
        throw new Error(
            `${route?.method} method should be a valid HTTP method`
        );
    if (Array.isArray(route?.routes)) {
        route.routes.forEach((nestedRoute: IRoute) => {
            validateRoute(nestedRoute);
        });
    }
};
