import { Documents, IPFSAccessController } from "@orbitdb/core";
import { orbitdb } from "../database/Database.js";

async function openDatabase(name) {
    const db = await orbitdb.open(name, {
        AccessController: IPFSAccessController({ write: ["*"] }),
        Database: Documents({ indexBy: "id" }),
    });
    return await db;
}

async function add(obj, name) {
    const db = await openDatabase(name);
    try {
        const entity = await db.put(obj);
        return entity;
    } catch (error) {
        throw new Error(`Error when creating entity: ${error.message}`);
    } finally {
        await db.close();
    }
}

async function getOne(id, name) {
    const db = await openDatabase(name);
    try {
        const entity = await db.get(id);
        return entity;
    } catch (error) {
        throw new Error(`Error when fetching entity: ${error.message}`);
    } finally {
        await db.close();
    }
}

async function get(ids, name) {
    const db = await openDatabase(name);
    try {
        const entities =
            ids == null
                ? await db.all()
                : await Promise.all(
                      ids.map(async (entity) => {
                          const result = await db.get(entity);
                          return await result;
                      })
                  );
        return entities.filter((entity) => {
            return !(entity == null);
        });
    } catch (error) {
        throw new Error(`Error when fetching entities: ${error.message}`);
    } finally {
        await db.close();
    }
}

async function remove(id, name) {
    const db = await openDatabase(name);
    try {
        const deleted = await db.del(id);
        return deleted;
    } catch (error) {
        throw new Error(`Error when deleting entitiy: ${error.message}`);
    } finally {
        await db.close();
    }
}

export { add, get, remove, getOne, openDatabase };
