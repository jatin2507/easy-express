import express from "express";
import joi from "joi";

export interface Imethods {
    get: "get";
    post: "post";
    put: "put";
    delete: "delete";
    patch: "patch";
    any: "any";
}

export interface IRoute {
    path: string;
    method: keyof Imethods;
    handler?: express.RequestHandler;
    middleware?: express.RequestHandler[];
    validators?: [
        {
            type: "query" | "body" | "params";
            schema: joi.Schema;
        }
    ];
    routes?: IRoute[];
}
export interface Icors {
    origin?: string[];
    methods?: string;
    allowedHeaders?: string;
    exposedHeaders?: string;
    credentials?: boolean;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
}
export interface Ihttps {
    key: string;
    cert: string;
}
export interface IbodyParser {
    limit: string;
    contentType: string[];
}
export interface Ilogs {
    request: boolean;
    requestPayload: boolean;
    response: boolean;
}

export interface IsecureHeaders {
    contentSecurityPolicy: string;
    frameGuard: string;
    xssFilter: string;
    contentTypeOptions: string;
    referrerPolicy: string;
    featurePolicy: string;
}

export interface IbullBoard {
    path: string;
}

export interface Iconfig {
    logs: Ilogs;
    routePrefix: string;
    bullBoard: IbullBoard;
    secureHeaders: IsecureHeaders;
    production: boolean;
}
export interface Iexpress {
    https?: Ihttps;
    port?: number;
    host?: string;
    cors?: Icors;
    bodyParser?: IbodyParser;
}
export interface expressConfig {
    express: Iexpress;

    config?: Iconfig;

    routes: IRoute[];
}
