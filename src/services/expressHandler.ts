import {
    IRoute,
    IbodyParser,
    Iconfig,
    Iexpress,
    Ihttps,
} from "../interfaces/Iexpress";
import expressInstance, { Request, Response } from "express";
import corsInstance from "cors";
import httpInstance from "http";
import httpsInstance from "https";
import Joi, { ObjectSchema } from "joi";
export const expressHandler = async function (
    {
        express,
        config,
        routes,
    }: {
        express: Iexpress;
        config: Iconfig;
        routes: IRoute[];
    },
    configured: { [key: string]: boolean }
) {
    try {
        let app = expressInstance();
        let server = httpInstance.createServer(app);
        if (configured.cors) app.use(corsInstance(express.cors));
        if (configured.bodyParser) {
            let { limit, contentType } = express.bodyParser as IbodyParser;
            app.use(expressInstance.json({ limit, type: contentType }));
        }
        if (configured.https) {
            let { key, cert } = express.https as Ihttps;
            server = httpsInstance.createServer({ key, cert }, app);
        }
        app.use((req: Request, res: Response, next: any) => {
            config.logs.request &&
                console.log(`Request: ${req.route} ${req.method}`);
            config.logs.requestPayload &&
                console.log({
                    body: req.body,
                    params: req.params,
                    query: req.query,
                });
            res.on("finish", () => {
                config.logs.response &&
                    console.log(
                        `Response: ${req.route} ${req.method} status Code: ${res.statusCode} `
                    );
            });
            next();
        });
        let routers: IRoute | [] = [];
        await routeshandlers(routes, routers);
        routers.forEach(async (route: IRoute) => {
            let method: "get" | "post" | "put" | "delete" | "use" | "patch" =
                route.method == "any" ? "use" : route.method;
            let validationMiddleware = route.validators
                ? joiValidations(route?.validators)
                : [];
            let middleware = route?.middleware || [];
            app[method](
                route.path,
                ...validationMiddleware,
                ...middleware,
                route?.handler as expressInstance.RequestHandler
            );
        });
    } catch (error) {
        throw new Error(error as string);
    }
};

const routeshandlers = async function (
    routes: IRoute[],
    entireRoutes: IRoute[],
    prefix?: string
) {
    routes.forEach(async (route: IRoute) => {
        if (route.routes)
            await routeshandlers(routes, entireRoutes, route.path);
        else entireRoutes.push({ ...route, path: `${prefix}${route.path}` });
    });
};

const joiValidations = function (
    validators?: { type: "query" | "body" | "params"; schema: Joi.Schema }[]
): expressInstance.RequestHandler[] {
    let _validators = validators?.map((validator) => {
        let type: "query" | "body" | "params" = validator.type;
        const schema = validator.schema as ObjectSchema;
        return function (req: Request, res: Response, next: any) {
            try {
                const data = req[type];
                let { error } = schema.validate(data);
                if (error) throw new Error(error.message);
                next();
            } catch (error) {
                res.status(400).send(error);
            }
        };
    });
    return _validators as expressInstance.RequestHandler[];
};
