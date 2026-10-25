import Facade from './facade';
import { Macroable } from '../macro';
import type { IEncrypter } from '@ostro/contracts/encryption/encrypter';

/**
 * Class Crypt.
 */
class Crypt extends Facade {

    /**
     * getFacadeAccessor method.
     * @static
     * @returns {any}
     */
    static getFacadeAccessor() {
        return 'encrypter';
    }

    static encrypt(value: any, serialize?: boolean): string {
        return (this.getFacadeRoot() as IEncrypter).encrypt(value, serialize);
    }

    static encryptString(value: string): string {
        return (this.getFacadeRoot() as IEncrypter).encryptString(value);
    }

    static decrypt<T = any>(payload: any, unserialize?: boolean): T {
        return (this.getFacadeRoot() as IEncrypter).decrypt<T>(payload, unserialize);
    }

    static decryptString(payload: any): string {
        return (this.getFacadeRoot() as IEncrypter).decryptString(payload);
    }
}
export default Macroable(Crypt);