import { createOrbitDB } from "@orbitdb/core";
import { create } from "ipfs-core";

const ipfs = await create({ repo: "repo1" });

const orbitdb = await createOrbitDB({ ipfs });

export { ipfs, orbitdb };
