import { CustomScheme, protocol, app } from "electron";
import { ProtocolRouter } from "./router";

export { ProtocolRouter };

/**
 * A class for managing and registering custom protocol handlers in Electron.
 *
 * This class allows defining and applying multiple custom protocol schemes along with their associated routers.
 * It ensures the schemes are registered as privileged and their handlers are applied to new sessions.
 */
export class ProtocolProvider<C> {
    #schemeRouters = new Array<{
        customScheme: CustomScheme;
        router: () => ProtocolRouter<any>;
    }>();

    /**
     * Private constructor for initializing a `ProtocolProvider` instance.
     * Use the static `register` method to create an instance.
     *
     * @param customScheme - The custom scheme to be registered.
     *                       This defines the protocol's name and its security settings.
     * @param router - A function that takes the Electron `Protocol` and scheme name,
     *                 and returns a `ProtocolRouter` for handling requests on this scheme.
     */
    private constructor(customScheme: CustomScheme, router: () => ProtocolRouter<C>) {
        this.#schemeRouters.push({ customScheme, router });
    }

    /**
     * Static method to create a new `ProtocolProvider` instance and register the first protocol.
     *
     * @param customScheme - The custom scheme to be registered.
     * @param router - A function that takes the Electron `Protocol` and scheme name,
     *                 and returns a `ProtocolRouter` for handling requests on this scheme.
     * @returns A new instance of `ProtocolProvider`.
     */
    static register<C>(customScheme: CustomScheme, router: () => ProtocolRouter<C>): ProtocolProvider<C> {
        return new ProtocolProvider(customScheme, router);
    }

    /**
     * Registers an additional custom scheme and its router with the provider.
     *
     * @param customScheme - The custom scheme to be registered.
     * @param router - A function that takes the Electron `Protocol` and scheme name,
     *                 and returns a `ProtocolRouter` for handling requests on this scheme.
     * @returns The current `ProtocolProvider` instance, enabling method chaining.
     */
    register<C>(customScheme: CustomScheme, router: () => ProtocolRouter<C>): this {
        this.#schemeRouters.push({ customScheme, router });
        return this;
    }

    /**
     * Applies the custom schemes by registering them as privileged schemes and setting up event listeners.
     *
     * - Registers all custom schemes as privileged using `protocol.registerSchemesAsPrivileged`.
     * - Adds a listener to the `session-created` event to set up the handlers for each new session.
     *
     * This method should be called after registering all the schemes.
     */
    apply() {
        protocol.registerSchemesAsPrivileged(this.#schemeRouters.map(protocol => protocol.customScheme));

        app.on('session-created', session =>
            this.#schemeRouters.forEach(schemeRouter =>
                schemeRouter.router().register(session.protocol, schemeRouter.customScheme.scheme)));
    }

    /**
     * Getter to retrieve all the custom schemes that have been registered.
     *
     * @returns An array of all registered `CustomScheme` objects.
     */
    get customScheme() {
        return this.#schemeRouters.map(schemeRouter => schemeRouter.customScheme);
    }
}