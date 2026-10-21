/**
 * Class Env.
 */
class Env {
    /**
     * Get an environment variable with optional default.
     *
     * @typeParam T - The default value type.
     * @param key - The environment variable name.
     * @param defaultValue - The fallback value if variable is unset.
     * @returns The environment variable value or default.
     */
    public static get<T = any>(key: string, defaultValue: T | null = null): string | T | null {
        return process.env[key] || defaultValue;
    }

    /**
     * Set an environment variable.
     *
     * @param key - The environment variable name.
     * @param value - The value to assign.
     */
    public static set(key: string, value: any): void {
        process.env[key] = value;
    }
}

export default Env;