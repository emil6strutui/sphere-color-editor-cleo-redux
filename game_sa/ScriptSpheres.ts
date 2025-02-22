import { ScriptSphere } from "./ScriptSphere";

export class ScriptSpheres {
    private static readonly SPHERE_ARRAY_ADDRESS = 0xA91268;
    private static readonly SPHERE_SIZE = 0x18;
    private static readonly MAX_SPHERES = 16;

    /**
     * Get the index of the sphere within the Spheres array from the handle
     * The handle has the following format:
     * 00010000 -  a sphere created first time in the first slot.
     * 00020000 -  a sphere created second time in the first slot.
     * 00010001 -  a sphere created first time in the second slot.
     * 00020001 -  a sphere created second time in the second slot. 
     * 
     * @param handle 
     * @returns 
     */
    static getSphereIndexFromHandle(handle: number): number {
        return handle & 0xFFFF;
    }

    /**
     * Get the sphere from the handle
     * @param handle 
     * @returns 
     */
    static fromHandle(handle: number): ScriptSphere | null {
        const index = this.getSphereIndexFromHandle(handle);
        if (index >= this.MAX_SPHERES) return null;
        
        const sphereAddr = this.SPHERE_ARRAY_ADDRESS + index * this.SPHERE_SIZE;
        const sphere = new ScriptSphere(sphereAddr);
        
        return sphere.isUsed ? sphere : null;
    }

    static findByM_nId(targetId: number): ScriptSphere | null {
        for (let i = 0; i < this.MAX_SPHERES; i++) {
            const sphereAddr = this.SPHERE_ARRAY_ADDRESS + i * this.SPHERE_SIZE;
            const sphere = new ScriptSphere(sphereAddr);

            if (!sphere.isUsed) continue;
            if (sphere.m_nId === targetId) return sphere;
        }
        return null;
    }

    static findFreeSlot(): number | null {
        for (let i = 0; i < this.MAX_SPHERES; i++) {
            const sphereAddr = this.SPHERE_ARRAY_ADDRESS + i * this.SPHERE_SIZE;
            const sphere = new ScriptSphere(sphereAddr);

            if (!sphere.isUsed) {
                return sphereAddr;
            }
        }
        return null;
    }

    static findSphereByCoords(x: number, y: number, z: number): ScriptSphere | null {
        const tolerance = 0.1;
        for (const sphere of ScriptSpheres) {
          const pos = sphere.position;
          if (Math.abs(x - pos.x) < tolerance && 
              Math.abs(y - pos.y) < tolerance && 
              Math.abs(z - pos.z) < tolerance) {
            return sphere;
          }
        }
        return null;
      }

    static *[Symbol.iterator](): Iterator<ScriptSphere> {
        for (let i = 0; i < this.MAX_SPHERES; i++) {
            const sphereAddr = this.SPHERE_ARRAY_ADDRESS + i * this.SPHERE_SIZE;
            const sphere = new ScriptSphere(sphereAddr);
            if (sphere.isUsed) {
                yield sphere;
            }
        }
    }
}