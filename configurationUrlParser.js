const url = require('url');
const querystring = require('querystring');

class ConfigurationUrlParser {
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

    parseConfiguration(config) {
        if (typeof config === 'string') {
            config = { url: config };
        }
       const $url = config['url'];

        if (! $url) {
            return config;
        }
        const urlParts = this.parseUrl(config.url);
        const decodedComponents = this.parseStringsToNativeTypes(urlParts);

        return {
            ...config,
            ...this.getPrimaryOptions(decodedComponents),
            ...this.getQueryOptions(urlParts),
        };
    }

    getPrimaryOptions(url) {
        return {
            driver: this.getDriver(url),
            database: this.getDatabase(url),
            host: url.host || null,
            port: url.port || null,
            username: url.user || null,
            password: url.pass || null,
        };
    }


    getDriver(url) {
        const alias = url.protocol && url.protocol.replace(':', '');

        if (!alias) {
            return null;
        }

        return this.$driverAliases[alias] || alias;
    }

    getDatabase(url) {
        const path = url.pathname || '';

        return path !== '/' ? path.slice(1) : null;
    }

    getQueryOptions(url) {
        const queryString = url.query || '';

        if (!queryString) {
            return {};
        }

        const query = querystring.parse(queryString);

        return this.parseStringsToNativeTypes(query);
    }

    parseUrl(url) {
        url = url.replace(/^(sqlite3?):\/\//, '$1://null/');

        const parsedUrl = new URL(url);

        if (!parsedUrl) {
            throw new Error('The database configuration URL is malformed.');
        }

        return parsedUrl;
    }

    parseStringsToNativeTypes(value) {
        if (Array.isArray(value)) {
            return value.map(v => this.parseStringsToNativeTypes(v));
        }

        if (typeof value !== 'string') {
            return value;
        }

        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }
    }

    get$DriverAliases() {
        return this.$driverAliases;
    }

    addDriverAlias(alias, driver) {
        this.$driverAliases[alias] = driver;
    }
}

module.exports = ConfigurationUrlParser;
