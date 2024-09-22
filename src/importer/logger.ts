import moment from "moment";

const originalConsoleLog = console.log;
console.log = function (message?: any, ...optionalParams: any[]) {
    originalConsoleLog(
        `${moment().format("DD-MM-YYYY HH:MM:SS")} | [info] | -> ` + message,
        ...optionalParams
    );
};

const originalConsoleError = console.error;
console.error = function (message?: any, ...optionalParams: any[]) {
    originalConsoleError(
        `${moment().format("DD-MM-YYYY HH:MM:SS")} | [error] | -> ` + message,
        ...optionalParams
    );
};

const originalConsoleInfo = console.info;
console.info = function (message?: any, ...optionalParams: any[]) {
    originalConsoleInfo(
        `${moment().format("DD-MM-YYYY HH:MM:SS")} | [info] | -> ` + message,
        ...optionalParams
    );
};

const originalConsoleDebug = console.debug;
console.debug = function (message?: any, ...optionalParams: any[]) {
    originalConsoleDebug(
        `${new Date()} | [debug] | -> ` + message,
        ...optionalParams
    );
};

export const productionConsole = function (production: boolean) {
    const originalConsoleWarn = console.warn;
    console.warn = function (message?: any, ...optionalParams: any[]) {
        !production &&
            originalConsoleWarn(
                `${moment().format("DD-MM-YYYY HH:MM:SS")} | [warn] | -> ` +
                    message,
                ...optionalParams
            );
    };
    console.info = function (message?: any, ...optionalParams: any[]) {
        !production &&
            originalConsoleInfo(
                `${moment().format("DD-MM-YYYY HH:MM:SS")} | [info] | -> ` +
                    message,
                ...optionalParams
            );
    };
};
