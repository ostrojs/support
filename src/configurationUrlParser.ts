import querystring from 'querystring';

export interface ParsedDatabaseConfiguration {
    driver: string | null;
    database: string | null;
    host: string | null;
    port: string | null;
    username: string | null;
    password: string | null;
    [key: string]: any;
}

/**
 * Class ConfigurationUrlParser.
 */
class ConfigurationUrlParser {
    public $driverAliases: Record<string, string>;

    /**
     * Create a new instance.
     */
    constructor() {
        this.$driverAliases = {
            'mssql': 'sqlsrv',
            'mysql2': 'mysql', // RDS
            'postgres': 'pgsql',
            'postgresql': 'pgsql',
            'sqlite3': 'sqlite',
            'redis': 'tcp',
            'rediss': 'tls',
        };
    }

    /**
     * Parse configuration URL into config object.
     *
     * @param config - Configuration object or string URL.
     * @returns Parsed configuration.
     */
    public parseConfiguration(config: string | Record<string, any>): Record<string, any> {
        let conf: Record<string, any> = typeof config === 'string' ? { url: config } : config;
        const $url = conf['url'];

        if (!$url) {
            return conf;
        }
        const urlParts = this.parseUrl(conf['url']);
        const decodedComponents = this.parseStringsToNativeTypes(urlParts);

        return {
            ...conf,
            ...this.getPrimaryOptions(decodedComponents),
            ...this.getQueryOptions(urlParts),
        };
    }

    /**
     * Get primary connection options from URL parts.
     *
     * @param url - Parsed URL parts.
     * @returns Primary options object.
     */
    public getPrimaryOptions(url: any): ParsedDatabaseConfiguration {
        return {
            driver: this.getDriver(url),
            database: this.getDatabase(url),
            host: url.hostname || url.host || null,
            port: url.port || null,
            username: url.username || url.user || null,
            password: url.password || url.pass || null,
        };
    }

    /**
     * Get driver name for the given URL protocol.
     *
     * @param url - URL object.
     * @returns Driver name or null.
     */
    public getDriver(url: any): string | null {
        const alias = url.protocol && url.protocol.replace(':', '');

        if (!alias) {
            return null;
        }

        return this.$driverAliases[alias] || alias;
    }

    /**
     * Get database name from URL pathname.
     *
     * @param url - URL object.
     * @returns Database name or null.
     */
    public getDatabase(url: any): string | null {
        let path = url.pathname || '';
        if (path.startsWith('/')) {
            path = path.slice(1);
        }
        return path !== '' ? path : null;
    }

    /**
     * Get query string options.
     *
     * @param url - URL object.
     * @returns Query options object.
     */
    public getQueryOptions(url: any): Record<string, any> {
        const queryString = url.search ? url.search.replace(/^\?/, '') : (url.query || '');

        if (!queryString) {
            return {};
        }

        const query = querystring.parse(queryString);
        const result: Record<string, any> = {};
        for (const key in query) {
            result[key] = this.parseStringsToNativeTypes(query[key]);
        }
        return result;
    }

    /**
     * Parse database configuration URL string into a URL object.
     *
     * @param url - URL string.
     * @returns Parsed URL instance.
     */
    public parseUrl(url: string): URL {
        url = url.replace(/^(sqlite3?):\/\//, '$1://null/');

        const parsedUrl = new URL(url);

        if (!parsedUrl) {
            throw new Error('The database configuration URL is malformed.');
        }

        return parsedUrl;
    }

    /**
     * Parse strings to native JSON types if applicable.
     *
     * @param value - Value to parse.
     * @returns Decoded value.
     */
    public parseStringsToNativeTypes(value: any): any {
        if (Array.isArray(value)) {
            return value.map(v => this.parseStringsToNativeTypes(v));
        }

        if (typeof value !== 'string') {
            return value;
        }

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }

    /**
     * Get driver aliases map.
     *
     * @returns Driver aliases.
     */
    public get$DriverAliases(): Record<string, string> {
        return this.$driverAliases;
    }

    /**
     * Add a custom driver alias.
     *
     * @param alias - Driver alias name.
     * @param driver - Target driver name.
     */
    public addDriverAlias(alias: string, driver: string): void {
        this.$driverAliases[alias] = driver;
    }
}

export default ConfigurationUrlParser;
