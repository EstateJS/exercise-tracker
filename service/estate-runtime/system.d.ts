import {Data, Message, Worker} from "./model-types";

/**
 * Saves one or more Data to the service.
 * - All changes made to Data must be saved or reverted by the end of the transaction. Otherwise, the worker call will fail with an Engine_UnsavedChanges error.
 * @see Data
 * @param {Data[]} data - One or more Data to save.
 * @returns {boolean} True if there were any changes to save, False otherwise.
 * */
export function saveData(...data: Data[]): boolean;

/**
 * Saves one or more Data and all the Data they reference (the entire tree) to their datastore's.
 * @param {Data[]} dataRoots - One or more Data, along with all the Data they reference, to save.
 * @returns {boolean} True if there were any changes to save, False otherwise.
 * */
export function saveDataGraphs(...dataRoots: Data[]): boolean;

/**
 * Undoes any changes made since the last time a Data or Worker was saved in the current transaction.
 * - Only changes made since the last saveData/saveDataGraphs call are reverted.
 * - Only undoes changes made as part of the save transaction, that is, the same worker call.
 * - If there hasn't been a saveData/saveDataGraphs call then all changes made since the beginning of the
 * transaction will be reverted. This is always the case for Workers since they cannot be saved manually.
 * - This function does not revert any changes made to referenced Data/Workers (I.e. It leaves the rest of the object graph alone).
 * @param {T} workerOrData - The Worker or Data to revert.
 * */
export function revertObject<T extends Worker | Data>(workerOrData: T): void;

/**
 * Gets an existing Worker instance from the service or creates a new one if it does not exist.
 * @param {new(primaryKey: string) => T} workerType - The class type that extends Worker. (E.g. MyWorker)
 * @param {string} primaryKey - The primary key used to uniquely identify the Worker instance.
 * @returns {T} The Worker instance.
 * */
export function getWorker<T extends Worker>(workerType: new (primaryKey: string) => T, primaryKey: string): T;

/**
 * Gets an existing Data instance from the service.
 * - New Data instances are not created automatically with this call. You can create new Data instances just like you would any other JavaScript object: E.g. `let player = new Player("Scott")` where `Player` is a service class that extends the Data base class.
 * @param {new(...args: any[]) => T} dataType - The class type that extends Data. (E.g. `Player` that extends Data)
 * @param {string} primaryKey - A string that uniquely identifies the Data instance.
 * @returns {T} The Data instance.
 * */
export function getData<T extends Data>(dataType: new (...args: any[]) => T, primaryKey: string): T;

/**
 * Permanently deletes a Data or Worker instance from the service. Once it has been deleted it cannot be retrieved.
 * @param {T} workerOrData - The Worker or Data to permanently delete.
 * @param {boolean} purge - (Optional, default = false) Normal deletion leaves behind a very small marker that prevents deleted worker and data instances from being re-created accidentally. Passing true to this argument prevents this marker from being written.
 * For worker deletions specifically, careful consideration should be made when setting this to true because it could result in accidental re-creation because workers are created-on-first-use.
 * */
export function deleteObject<T extends Worker | Data>(workerOrData: T, purge?: boolean): void;

/**
 * Fires a Message instance to all clients that are subscribed.
 * - Any Data or Workers referred to by properties on the Message that have had changes during the current worker method call must be manually saved before calling sendMessage. Otherwise, an exception is thrown. This ensures a consistent state for client-side message subscribers.
 * - Messages will not be fired when a worker call returns an error or an exception is unhandled by your code.
 * @see saveDataGraphs
 * @param {TS} source - A reference to a Worker or Data which will be used as the source of this message.
 * @param {TE} message - The Message object to send to all subscribed clients.
 * */
export function sendMessage<TS extends Worker | Data, TM extends Message>(source: TS, message: TM): void;
