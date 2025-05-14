import { Protocol } from "electron";

enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS',
    TRACE = 'TRACE',
    CONNECT = 'CONNECT'
}

type ProtocolHandler<Path extends string, C> = (request: { request: Request; params: ExtractParams<Path> }, context?: C) => Response | Promise<Response>;

/**
 * Interface for a protocol router that handles various HTTP methods.
 *
 * Each method (GET, POST, PUT, DELETE, etc.) allows you to register a handler for a specific path.
 * - `path`: The URL path with optional parameters (e.g., `/user/:id`).
 * - `handler`: A function that processes the request and returns a response or a promise of a response.
 *
 * All methods support method chaining by returning `this`.
 */
export interface ProtocolRouter<C> {
    /**
     * Registers a handler for GET requests to the specified path.
     *
     * @param path - The URL path for the request.
     *               It can include parameter placeholders like `/user/:id`.
     * @param handler - A function that processes the incoming request.
     *                  - `request`: Contains details about the request.
     *                  - `params`: An object containing extracted parameters from the `path`.
     *                  - `context` (optional): A user-defined context object, if provided.
     *                  The handler must return a `Response` or a `Promise<Response>`.
     * @returns The current instance of the router for method chaining.
     */
    get<Path extends string>(path: Path, handler: ProtocolHandler<Path, C>): this;

    /**
     * Registers a handler for POST requests to the specified path.
     *
     * @param path - The URL path for the request.
     *               It can include parameter placeholders like `/user/:id`.
     * @param handler - A function that processes the incoming request.
     *                  - `request`: Contains details about the request.
     *                  - `params`: An object containing extracted parameters from the `path`.
     *                  - `context` (optional): A user-defined context object, if provided.
     *                  The handler must return a `Response` or a `Promise<Response>`.
     * @returns The current instance of the router for method chaining.
     */
    post<Path extends string>(path: Path, handler: ProtocolHandler<Path, C>): this;

    /**
     * Registers a handler for PUT requests to the specified path.
     *
     * @param path - The URL path for the request.
     *               It can include parameter placeholders like `/user/:id`.
     * @param handler - A function that processes the incoming request.
     *                  - `request`: Contains details about the request.
     *                  - `params`: An object containing extracted parameters from the `path`.
     *                  - `context` (optional): A user-defined context object, if provided.
     *                  The handler must return a `Response` or a `Promise<Response>`.
     * @returns The current instance of the router for method chaining.
     */
    put<Path extends string>(path: Path, handler: ProtocolHandler<Path, C>): this;

    /**
     * Registers a handler for DELETE requests to the specified path.
     *
     * @param path - The URL path for the request.
     *               It can include parameter placeholders like `/user/:id`.
     * @param handler - A function that processes the incoming request.
     *                  - `request`: Contains details about the request.
     *                  - `params`: An object containing extracted parameters from the `path`.
     *                  - `context` (optional): A user-defined context object, if provided.
     *                  The handler must return a `Response` or a `Promise<Response>`.
     * @returns The current instance of the router for method chaining.
     */
    delete<Path extends string>(path: Path, handler: ProtocolHandler<Path, C>): this;

    /**
     * Registers a handler for PATCH requests to the specified path.
     *
     * @param path - The URL path for the request.
     *               It can include parameter placeholders like `/user/:id`.
     * @param handler - A function that processes the incoming request.
     *                  - `request`: Contains details about the request.
     *                  - `params`: An object containing extracted parameters from the `path`.
     *                  - `context` (optional): A user-defined context object, if provided.
     *                  The handler must return a `Response` or a `Promise<Response>`.
     * @returns The current instance of the router for method chaining.
     */
    patch<Path extends string>(path: Path, handler: ProtocolHandler<Path, C>): this;

    /**
     * Registers a handler for HEAD requests to the specified path.
     *
     * @param path - The URL path for the request.
     *               It can include parameter placeholders like `/user/:id`.
     * @param handler - A function that processes the incoming request.
     *                  - `request`: Contains details about the request.
     *                  - `params`: An object containing extracted parameters from the `path`.
     *                  - `context` (optional): A user-defined context object, if provided.
     *                  The handler must return a `Response` or a `Promise<Response>`.
     * @returns The current instance of the router for method chaining.
     */
    head<Path extends string>(path: Path, handler: ProtocolHandler<Path, C>): this;

    /**
     * Registers a handler for OPTIONS requests to the specified path.
     *
     * @param path - The URL path for the request.
     *               It can include parameter placeholders like `/user/:id`.
     * @param handler - A function that processes the incoming request.
     *                  - `request`: Contains details about the request.
     *                  - `params`: An object containing extracted parameters from the `path`.
     *                  - `context` (optional): A user-defined context object, if provided.
     *                  The handler must return a `Response` or a `Promise<Response>`.
     * @returns The current instance of the router for method chaining.
     */
    options<Path extends string>(path: Path, handler: ProtocolHandler<Path, C>): this;

    /**
     * Registers a handler for TRACE requests to the specified path.
     *
     * @param path - The URL path for the request.
     *               It can include parameter placeholders like `/user/:id`.
     * @param handler - A function that processes the incoming request.
     *                  - `request`: Contains details about the request.
     *                  - `params`: An object containing extracted parameters from the `path`.
     *                  - `context` (optional): A user-defined context object, if provided.
     *                  The handler must return a `Response` or a `Promise<Response>`.
     * @returns The current instance of the router for method chaining.
     */
    trace<Path extends string>(path: Path, handler: ProtocolHandler<Path, C>): this;

    /**
     * Registers a handler for CONNECT requests to the specified path.
     *
     * @param path - The URL path for the request.
     *               It can include parameter placeholders like `/user/:id`.
     * @param handler - A function that processes the incoming request.
     *                  - `request`: Contains details about the request.
     *                  - `params`: An object containing extracted parameters from the `path`.
     *                  - `context` (optional): A user-defined context object, if provided.
     *                  The handler must return a `Response` or a `Promise<Response>`.
     * @returns The current instance of the router for method chaining.
     */
    connect<Path extends string>(path: Path, handler: ProtocolHandler<Path, C>): this;
}

/**
 * A class for conveniently handling requests for custom protocols.
 */
export class ProtocolRouter<C> {

    readonly #routes: { [key in HttpMethod | '*']?: Map<string, [ProtocolHandler<string, C>]> } = {};
    readonly #handler: (request: Request) => (Response) | (Promise<Response>);

    /**
     * Initializes a new instance of `ProtocolRouter`.
     *
     * This constructor directly creates a `ProtocolRouter` instance for handling custom protocol requests.
     * It optionally supports a user-defined context to be included in the request handlers.
     *
     * @param contextBuilder - (Optional) A function to build a custom context object for each request.
     *                         The function is called with the incoming `Request` object and can return
     *                         a context object synchronously or as a promise. The resulting context
     *                         is passed to the route handler, allowing additional data or metadata
     *                         to be included in the request processing.
     */
    constructor(contextBuilder?: (request: Request) => (C | Promise<C>)) {
        this.#handler = async request => {
            let lastError = null;
            try {
                const url = new URL(request.url);
                const pathParts = `/${url.host}${url.pathname}`.split('/');
                const requestMethod = request.method.toUpperCase() as unknown as HttpMethod;

                const entries = Object.entries(this.#routes);
                for (const [method, entry] of entries) {
                    if (method !== '*' && method !== requestMethod) {
                        continue;
                    }
                    for (const [path, handlers] of entry) {
                        try {
                            const routeParts = path.split('/');
                            if (routeParts.length !== pathParts.length) continue;

                            const params: Record<string, string> = {};
                            let matched = true;

                            for (let i = 0; i < routeParts.length; i++) {
                                const routePart = routeParts[i];
                                const pathPart = pathParts[i];
                                if (routePart.startsWith(':')) {
                                    params[routePart.slice(1)] = decodeURIComponent(pathPart);
                                } else if (routePart !== pathPart) {
                                    matched = false;
                                    break;
                                }
                            }
                            if (matched) {
                                for (const handler of handlers) {
                                    try {
                                        if (contextBuilder === undefined) {
                                            return await handler({ request, params });
                                        } else {
                                            let context: C | undefined = undefined;
                                            try {
                                                context = await contextBuilder(request);
                                            } catch (error) {
                                                if (error instanceof Response) {
                                                    return error;
                                                } else {
                                                    if (handler.length < 2) {
                                                        return await handler({ request, params });
                                                    }
                                                    lastError = error;
                                                    continue;
                                                }
                                            }
                                            return await handler({ request, params }, context);
                                        }
                                    } catch (error) {
                                        lastError = error;
                                        continue;
                                    }
                                }
                            }
                        } catch (error) {
                            lastError = error;
                            continue;
                        }
                    }
                }
            } catch (error) {
                lastError = error;
            }

            if (lastError) {
                return Response.json({ message: 'Internal error', reason: lastError }, { status: 500 });
            } else {
                return Response.json({ message: 'Not found' }, { status: 404 });
            }
        };

        for (const method of Object.values(HttpMethod)) {
            this[method.toLowerCase() as Lowercase<HttpMethod>] = this.#add.bind(this, method);
        }
    }

    /**
     * Registers the protocol router to handle requests for the specified scheme.
     *
     * This method associates the `ProtocolRouter` instance with a custom protocol scheme,
     * allowing it to handle all requests matching the given scheme. The routing logic defined
     * in the `ProtocolRouter` instance will process incoming requests for this scheme.
     *
     * @param protocol - The Electron `Protocol` module used to register custom protocols.
     *                   This is responsible for managing custom schemes and routing requests.
     * @param scheme - The custom protocol scheme to handle (e.g., `my-app`, `custom`).
     *                 All requests starting with `<scheme>://` will be routed through this handler.
     */
    register(protocol: Protocol, scheme: string) {
        if (Object.entries(this.#routes).length === 0) {
            return new Error('No handlers have been registered. Please add at least one handler before calling this method.');
        }
        protocol.handle(scheme, this.#handler.bind(this));
    }

    #add<Path extends string>(method: HttpMethod | '*', path: Path, handler: ProtocolHandler<Path, C>) {
        if (this.#routes[method] === undefined) {
            this.#routes[method] = new Map();
            this.#routes[method].set(path, [handler]);
        } else {
            const handlers = this.#routes[method].get(path);
            if (handlers) {
                handlers.push(handler);
            } else {
                this.#routes[method].set(path, [handler]);
            }
        }
        return this;
    }

    /**
     * Registers a handler for the specified path, regardless of the HTTP method.
     *
     * @param path - The URL path for the request.
     *               It can include parameter placeholders like `/user/:id`.
     * @param handler - A function that processes the incoming request.
     *                  - `request`: Contains details about the request.
     *                  - `params`: An object containing extracted parameters from the `path`.
     *                  - `context` (optional): A user-defined context object, if provided.
     *                  The handler must return a `Response` or a `Promise<Response>`.
     * @returns The current instance of the router for method chaining.
     */
    on<Path extends string>(path: Path, handler: ProtocolHandler<Path, C>) {
        return this.#add('*', path, handler);
    }
}

type ExtractParams<Path extends string> =
    Path extends `${infer _Start}/:${infer Param}/${infer Rest}`
    ? { [key in Param]: string } & ExtractParams<Rest>
    : Path extends `:${infer Param}`
    ? { [key in Param]: string }
    : Path extends `${infer _Start}/:${infer Param}` ? { [key in Param]: string } : {};
