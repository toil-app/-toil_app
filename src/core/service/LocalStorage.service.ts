import AsyncStorage from '@react-native-async-storage/async-storage';
import _ from 'lodash';
import { createLogger } from '../util/AppUtil';

const Logger = createLogger('[LocalStorage][Service]');

export class LocalStorage {
  async appendList(storageId: string, data: any): Promise<any> {
    try {
      let list;
      const item = await AsyncStorage.getItem(storageId);
      Logger.log(storageId, item);

      if (_.isNil(item)) {
        list = [];
      } else {
        list = JSON.parse(item);
      }

      if (!list.push) {
        list = [];
      }

      list.push(data);
      const result = await this.setAsyncStorage(
        storageId,
        JSON.stringify(list),
      );
      return result;
    } catch (e) {
      Logger.log(e);
      return e;
    }
  }

  async remove(id: string): Promise<void> {
    await AsyncStorage.removeItem(id);
    Logger.log(id, 'removed');
  }

  async get(id: string): Promise<string | null> {
    const item = await AsyncStorage.getItem(id);
    Logger.log(id, item);
    return item;
  }

  async set(id: string, data: any): Promise<void> {
    const result = await this.setAsyncStorage(id, JSON.stringify(data));
    return result;
  }

  async setMappedItem(mapId: string, dataId: string, data: any): Promise<void> {
    let mapData = JSON.parse((await this.get(mapId)) as string);
    if (mapData === null) {
      mapData = {};
    }
    mapData[dataId] = data;
    await this.set(mapId, mapData);
  }

  setAsyncStorage(key: string, data: string): Promise<void> {
    if (key && data) {
      return AsyncStorage.setItem(key, data);
    } else {
      return Promise.resolve();
    }
  }

  clearAll = async (): Promise<void> => {
    return await AsyncStorage.clear();
  };
}

export default new LocalStorage();
