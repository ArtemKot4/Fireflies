/**
 * Decorator to do work with saving data and deleting by player world unload so simplier.
 * data will be serialized for {@link Saver.addSavesScope} and cleared for client by LevelLeft callback if it is not disabled
 * @example 
 * ```ts
 * \@SerializeableStorage({ scopeName: "mymod.storage" })
 * class MyStorage {
 *     public static data: Record<string, string> = {};
 * }
 * ```
 */
function SerializeableStorage(settings: SerializeableStorage.ISettings) {
    return function<T extends new (...args: any[]) => any>(target: T): T {        
		let keyName = settings.keyName != null && settings.keyName in target ? 
			settings.keyName : ("data" in target ? "data" : null);
		if(keyName == null) {
			throw `keyName is not optional parameter for @SerializeableStorage, add key for class "${target.name}"`;
		}
		const defaultValue = SerializeableStorage.copyDefault(target[keyName]);
		Saver.addSavesScope(
		settings.scopeName || target["scopeName"] || (keyName + "_scope"),
		settings.read || function read(savedRocketEntities: Object) {
			target[settings.keyName] = savedRocketEntities;
			return;
		},
		settings.save || function save() {
			return target[settings.keyName];
		});
		if(settings.clearOnUnload != false) {
			SerializeableStorage.clearOnUnloadList.push([target, settings.keyName, defaultValue]);
		}
		return target;
    }
}

namespace SerializeableStorage {
    export interface ISettings {
	    /**
         * Key name of static field of your class
         * @default data
         */
        keyName?: string;
        /**
         * Name of scope for save
         */
        scopeName?: string;
        /**
         * If true, data will be cleared by LevelLeft callback for client
         */
        clearOnUnload?: boolean
        /**
         * Your logic of read if standard is not need you
         * @default true
         */
        read?(saved: Object): void;
        /**
         * Your logic of save if standard is not need you
         */
        save?(): Object
    }
	export const clearOnUnloadList: [classLink: Function, keyName: string, defaultValue: unknown][] = [];

	export function copyDefault<T>(value: T): T {
		if(value != null && Object.getPrototypeOf(value) == Object.prototype) {
			return { ...value as Object } as T;
		}
		if(Array.isArray(value)) {
			return [...value] as T;
		}
		if(value instanceof Set) {
			return new Set(value) as T;
		}
		if(value instanceof Map) {
			return new Map(value) as T;
		}
		return value;
	}

    Callback.addCallback("LevelLeft", () => {
		for(const entry of clearOnUnloadList) {
			const [classLink, keyName, defaultValue] = entry;
			classLink[keyName] = defaultValue;
			alert("очищено: " + JSON.stringify(classLink[keyName]));
		}
	});
}