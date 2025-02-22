import { KeyCode } from "../.config/sa.enums.js";

const player = new Player(0);
const playerChar = player.getChar();

const playerCoords = playerChar.getCoordinates();

const sphere = Sphere.Create(playerCoords.x, playerCoords.y, playerCoords.z, 2.0);

//static inline std::array<C3dMarker, 32>& m_aMarkerArray = *(std::array<C3dMarker, 32>*)0xC7DD58;
const MARKER_ARRAY_ADDRESS = 0xC7DD58;
const MARKER_SIZE = 0xA0; // Size of C3dMarker structure
const NUM_MARKERS = 32;

const SPHERE_ARRAY_ADDRESS = 0xA91268;
const SPHERE_SIZE = 0x18;
const MAX_SPHERES = 16;

function findMarkers() {
  log("MARKER_ARRAY_ADDRESS:", MARKER_ARRAY_ADDRESS.toString(16));

  for (let i = 0; i < NUM_MARKERS; i++) {
    const markerAddr = MARKER_ARRAY_ADDRESS + i * MARKER_SIZE;

    try {
      // Matrix is at offset 0x0 (size 0x48)
      // RpAtomic* at 0x48 (size 0x4)
      // RpMaterial* at 0x4C (size 0x4)

      // Read marker type and state
      const type = Memory.ReadU16(markerAddr + 0x50, false); // m_nType (e3dMarkerType)
      const isUsed = Memory.ReadU8(markerAddr + 0x52, false); // m_bIsUsed
      const mustRender = Memory.ReadU8(markerAddr + 0x53, false); // m_bMustBeRenderedThisFrame

      //if (!isUsed) continue;

      const id = Memory.ReadU32(markerAddr + 0x54, false); // m_nIdentifier

      if (id == 0) continue;

      // Read color (RGBA)
      const red = Memory.ReadU8(markerAddr + 0x58, false); // m_colour.r
      const green = Memory.ReadU8(markerAddr + 0x59, false); // m_colour.g
      const blue = Memory.ReadU8(markerAddr + 0x5a, false); // m_colour.b
      const alpha = Memory.ReadU8(markerAddr + 0x5b, false); // m_colour.a

      // Read other properties
      const pulsePeriod = Memory.ReadU16(markerAddr + 0x5c, false); // m_nPulsePeriod
      const rotateRate = Memory.ReadI16(markerAddr + 0x5e, false); // m_nRotateRate
      const startTime = Memory.ReadU32(markerAddr + 0x60, false); // m_nStartTime
      const pulseFraction = Memory.ReadFloat(markerAddr + 0x64, false); // m_fPulseFraction
      const stdSize = Memory.ReadFloat(markerAddr + 0x68, false); // m_fStdSize
      const size = Memory.ReadFloat(markerAddr + 0x6c, false); // m_fSize

      // Get position from matrix (fourth row is position)
      const pos = {
        x: Memory.ReadFloat(markerAddr + 0x30, false),
        y: Memory.ReadFloat(markerAddr + 0x34, false),
        z: Memory.ReadFloat(markerAddr + 0x38, false),
      };

      log(`Found marker ${i}:`);
      log(`  Type: ${type} (${type === 1 ? "CYLINDER" : type === 0 ? "ARROW" : "OTHER"})`);
      log(`  ID: ${id.toString(16)}, Used: ${isUsed}, MustRender: ${mustRender}`);
      log(`  Position: ${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}`);
      log(`  Color: R=${red}, G=${green}, B=${blue}, A=${alpha}`);
      log(`  Size: ${size.toFixed(2)} (std: ${stdSize.toFixed(2)})`);
      log(`  Pulse: Period=${pulsePeriod}, Fraction=${pulseFraction.toFixed(2)}`);
      log(`  Rotate Rate: ${rotateRate}`);
    } catch (e) {
      log("Error reading marker", i, ":", e);
    }
  }
}

function printScriptSphereArray() {
    for (let i = 0; i < MAX_SPHERES; i++) {
        const sphereAddr = SPHERE_ARRAY_ADDRESS + i * SPHERE_SIZE;
        const isUsed = Memory.ReadU8(sphereAddr, true);

        const sphereX = Memory.ReadFloat(sphereAddr + 0x8, true);
        const sphereY = Memory.ReadFloat(sphereAddr + 0xc, true);
        const sphereZ = Memory.ReadFloat(sphereAddr + 0x10, true);

        log(`Sphere ${i}: ${sphereX}, ${sphereY}, ${sphereZ}`);
        const sphereId = Memory.ReadU32(sphereAddr + 0x4, true);
        const sphereOtherId = Memory.ReadU32(sphereAddr + 0x2, true);
        log(`Sphere ID: ${sphereId.toString(16)}`);
        log(`Sphere otherId: ${sphereOtherId.toString(16)}`);


    }
}   

function findMarkerById(targetId: number) {
  for (let i = 0; i < NUM_MARKERS; i++) {
    const possibleMarkerAddr = MARKER_ARRAY_ADDRESS + i * MARKER_SIZE;

    try {
      const isUsed = Memory.ReadU8(possibleMarkerAddr + 0x52, false);
      if (!isUsed) continue;

      const id = Memory.ReadU32(possibleMarkerAddr + 0x54, false);

      if (id === targetId) {
        return {
          index: i,
          address: possibleMarkerAddr,
          type: Memory.ReadU16(possibleMarkerAddr + 0x50, false),
          position: {
            x: Memory.ReadFloat(possibleMarkerAddr + 0x30, false),
            y: Memory.ReadFloat(possibleMarkerAddr + 0x34, false),
            z: Memory.ReadFloat(possibleMarkerAddr + 0x38, false),
          },
          color: {
            r: Memory.ReadU8(possibleMarkerAddr + 0x58, false),
            g: Memory.ReadU8(possibleMarkerAddr + 0x59, false),
            b: Memory.ReadU8(possibleMarkerAddr + 0x5a, false),
            a: Memory.ReadU8(possibleMarkerAddr + 0x5b, false),
          },
        };
      }
    } catch (e) {
      log("Error reading marker", i, ":", e);
    }
  }
  return null;
}

function findSphereId(x: number, y: number, z: number): number | null {
  for (let i = 0; i < MAX_SPHERES; i++) {
    const sphereAddr = SPHERE_ARRAY_ADDRESS + i * SPHERE_SIZE;
    const isUsed = Memory.ReadU8(sphereAddr + 0x0, true);

    if (!isUsed) continue;

    const sphereX = Memory.ReadFloat(sphereAddr + 0x8, true);
    const sphereY = Memory.ReadFloat(sphereAddr + 0xc, true);
    const sphereZ = Memory.ReadFloat(sphereAddr + 0x10, true);

    const tolerance = 0.1;
    if (Math.abs(x - sphereX) < tolerance && Math.abs(y - sphereY) < tolerance && Math.abs(z - sphereZ) < tolerance) {
      return Memory.ReadU32(sphereAddr + 0x4, true);
    }
  }
  return null;
}

log("Sphere coords", playerCoords.x, playerCoords.y, playerCoords.z);


while (true) {
  wait(0);

  if (Pad.IsKeyJustPressed(KeyCode.F10)) {
    sphere.remove();
  }

  if (Pad.IsKeyJustPressed(KeyCode.Q)) {
    findMarkers();
    log("sphereId", (+sphere).toString(16));
    printScriptSphereArray();
  }

  if (Pad.IsKeyJustPressed(KeyCode.P)) {
    findMarkers();
    // First get the sphere's ID based on coordinates
    const sphereId = findSphereId(playerCoords.x, playerCoords.y, playerCoords.z);
    log("sphereId", (+sphere).toString(16));
    if (sphereId !== null) {
      // Then find the marker with that ID
      const marker = findMarkerById(+sphere);
      log("marker", marker);
      if (marker) {
        // Modify the marker's color
        Memory.WriteU8(marker.address + 0x58, 100, true); // Red
        Memory.WriteU8(marker.address + 0x59, 0, true); // Green
        Memory.WriteU8(marker.address + 0x5a, 100, true); // Blue
      }
    }
  }
}


