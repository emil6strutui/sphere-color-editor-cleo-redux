import { ScriptSpheres } from "./ScriptSpheres";

export class ScriptSphere {
    private address: number;

    constructor(address: number) {
        this.address = address;
    }

    get isUsed(): boolean {
        return Memory.ReadU8(this.address + 0x0, true) !== 0;
    }

    set isUsed(value: boolean) {
        Memory.WriteU8(this.address + 0x0, value ? 1 : 0, true);
    }

    get m_nId(): number {
        return Memory.ReadU32(this.address + 0x4, true);
    }

    set m_nId(value: number) {
        Memory.WriteU32(this.address + 0x4, value, true);
    }

    get m_nUniqueId(): number {
        return Memory.ReadU32(this.address + 0x2, true);
    }

    set m_nUniqueId(value: number) {
        Memory.WriteU32(this.address + 0x2, value, true);
    }

    get position(): { x: number, y: number, z: number } {
        return {
            x: Memory.ReadFloat(this.address + 0x8, true),
            y: Memory.ReadFloat(this.address + 0xc, true),
            z: Memory.ReadFloat(this.address + 0x10, true)
        };
    }

    set position(value: { x: number, y: number, z: number }) {
        Memory.WriteFloat(this.address + 0x8, value.x, true);
        Memory.WriteFloat(this.address + 0xc, value.y, true);
        Memory.WriteFloat(this.address + 0x10, value.z, true);
    }

    get radius(): number {
        return Memory.ReadFloat(this.address + 0x14, true);
    }

    set radius(value: number) {
        Memory.WriteFloat(this.address + 0x14, value, true);
    }
}