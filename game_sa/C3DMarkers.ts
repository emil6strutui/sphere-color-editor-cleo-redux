import { C3DMarker } from "./C3DMarker";

export class C3DMarkers {
    //https://github.com/gta-reversed/gta-reversed/blob/de0b162385a92e5545058671a787ea43423cfc4d/source/game_sa/3dMarkers.h#L60C92-L60C100
    private static readonly MARKER_ARRAY_ADDRESS = 0xC7DD58;
    private static readonly NUM_MARKERS = 32;
    //https://github.com/gta-reversed/gta-reversed/blob/de0b162385a92e5545058671a787ea43423cfc4d/source/game_sa/3dMarker.h#L96
    private static readonly MARKER_SIZE = 0xA0;

    
    static findByM_nIdentifier(targetId: number): C3DMarker | null {
        for (let i = 0; i < this.NUM_MARKERS; i++) {
            const markerAddr = this.MARKER_ARRAY_ADDRESS + i * this.MARKER_SIZE;
            const marker = new C3DMarker(markerAddr);

            if (!marker.isUsed) continue;
            if (marker.m_nIdentifier === targetId) return marker;
        }
        return null;
    }

    static *[Symbol.iterator](): Iterator<C3DMarker> {
        for (let i = 0; i < this.NUM_MARKERS; i++) {
            const markerAddr = this.MARKER_ARRAY_ADDRESS + i * this.MARKER_SIZE;
            const marker = new C3DMarker(markerAddr);
            if (marker.isUsed && marker.m_nIdentifier !== 0) {
                yield marker;
            }
        }
    }
}