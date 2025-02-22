/**
 * class C3dMarker {
public:
    CMatrix       m_mat; // 0x00
    RpAtomic* m_pAtomic; // 0x48
    RpMaterial* m_pMaterial; // 0x4C
    e3dMarkerType m_nType; // 0x50
    bool          m_bIsUsed; // 0x52
    bool          m_bMustBeRenderedThisFrame; // 0x53
    uint32        m_nIdentifier; // 0x54
    CRGBA         m_colour; // 0x58
    uint16        m_nPulsePeriod; // 0x5C
    int16         m_nRotateRate; // 0x5E
    uint32        m_nStartTime; // 0x60
    float         m_fPulseFraction; // 0x64
    float         m_fStdSize; // 0x68
    float         m_fSize; // 0x6C
    float         m_fBrightness; // 0x70
    float         m_fCameraRange; // 0x74
    CVector       m_vecNormal; // 0x78
    uint16        m_nLastMapReadX; // float casted to uint16 // 0x84
    uint16        m_nLastMapReadY; // float casted to uint16 // 0x86
    float         m_fLastMapReadResultZ; // 0x88
    float         m_fRoofHeight; // 0x8C
    CVector       m_vecLastPosition; // 0x90
    uint32        m_nOnScreenTestTime; // 0xA0
 */
export class C3DMarker {
    private address: number;

    constructor(address: number) {
        this.address = address;
    }

    get type(): number {
        return Memory.ReadU16(this.address + 0x50, false);
    }

    get isUsed(): boolean {
        return Memory.ReadU8(this.address + 0x52, false) !== 0;
    }

    get mustRender(): boolean {
        return Memory.ReadU8(this.address + 0x53, false) !== 0;
    }

    get m_nIdentifier(): number {
        return Memory.ReadU32(this.address + 0x54, false);
    }

    get color(): { r: number, g: number, b: number, a: number } {
        return {
            r: Memory.ReadU8(this.address + 0x58, false),
            g: Memory.ReadU8(this.address + 0x59, false),
            b: Memory.ReadU8(this.address + 0x5a, false),
            a: Memory.ReadU8(this.address + 0x5b, false)
        };
    }

    set color(value: { r: number, g: number, b: number, a: number }) {
        Memory.WriteU8(this.address + 0x58, value.r, false);
        Memory.WriteU8(this.address + 0x59, value.g, false);
        Memory.WriteU8(this.address + 0x5a, value.b, false);
        Memory.WriteU8(this.address + 0x5b, value.a, false);
    }

    get position(): { x: number, y: number, z: number } {
        return {
            x: Memory.ReadFloat(this.address + 0x30, false),
            y: Memory.ReadFloat(this.address + 0x34, false),
            z: Memory.ReadFloat(this.address + 0x38, false)
        };
    }

    get pulsePeriod(): number {
        return Memory.ReadU16(this.address + 0x5c, false);
    }

    get rotateRate(): number {
        return Memory.ReadI16(this.address + 0x5e, false);
    }

    get size(): number {
        return Memory.ReadFloat(this.address + 0x6c, false);
    }

    get standardSize(): number {
        return Memory.ReadFloat(this.address + 0x68, false);
    }

    get brightness(): number {
        return Memory.ReadFloat(this.address + 0x70, false);
    }

    set brightness(value: number) {
        Memory.WriteFloat(this.address + 0x70, value, false);
    }
    
}
