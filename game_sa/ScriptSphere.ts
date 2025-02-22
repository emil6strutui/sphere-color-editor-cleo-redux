import { ScriptSpheres } from "./ScriptSpheres";

/**
 * struct tScriptSphere {
    bool    m_bUsed; // 0x00
    char    m_f1; // 0x01
    int16   m_nUniqueId; // 0x02
    uint32  m_nId; // 0x04
    CVector m_vCoords; // 0x08
    float   m_fRadius; // 0x14

    tScriptSphere() { // 0x469060
        m_vCoords   = CVector();
        m_bUsed     = false;
        m_nUniqueId = 1;
        m_nId       = 0;
        m_fRadius   = 0.0f;
    }

    //! Get script thing ID
    auto GetId()    const { return m_nUniqueId; }

    //! If `*this` is currently in use
    auto IsActive() const { return m_bUsed; }
    
    };
    VALIDATE_SIZE(tScriptSphere, 0x18);
 */
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