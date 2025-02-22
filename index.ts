import { KeyCode } from "../.config/sa.enums.js";
import { C3DMarkers } from "./game_sa/C3DMarkers";
import { ScriptSpheres } from "./game_sa/ScriptSpheres";

// Create player and get coordinates
const player = new Player(0);
const playerChar = player.getChar();
const playerCoords = playerChar.getCoordinates();

// Create sphere at player position
const sphere = Sphere.Create(playerCoords.x, playerCoords.y, playerCoords.z, 2.0);

function logMarkers() {
  for (const marker of C3DMarkers) {
    log(`Found marker:`);
    log(`  Type: ${marker.type} (${marker.type === 1 ? "CYLINDER" : marker.type === 0 ? "ARROW" : "OTHER"})`);
    log(`  m_nIdentifier: ${marker.m_nIdentifier.toString(16)}, Used: ${marker.isUsed}, MustRender: ${marker.mustRender}`);
    log(`  Position: ${marker.position.x.toFixed(2)}, ${marker.position.y.toFixed(2)}, ${marker.position.z.toFixed(2)}`);
    log(`  Color: R=${marker.color.r}, G=${marker.color.g}, B=${marker.color.b}, A=${marker.color.a}`);
    log(`  Size: ${marker.size.toFixed(2)} (std: ${marker.standardSize.toFixed(2)})`);
    log(`  Pulse Period: ${marker.pulsePeriod}`);
    log(`  Rotate Rate: ${marker.rotateRate}`);
  }
}

function logSpheres() {
  for (const sphere of ScriptSpheres) {
    log(`Sphere position: ${sphere.position.x}, ${sphere.position.y}, ${sphere.position.z}`);
    log(`Sphere m_nId: ${sphere.m_nId.toString(16)}`);
    log(`Sphere m_nUniqueId: ${sphere.m_nUniqueId.toString(16)}`);
  }
}

while (true) {
  wait(0);

  if (Pad.IsKeyJustPressed(KeyCode.F10)) {
    sphere.remove();
  }

  if (Pad.IsKeyJustPressed(KeyCode.Q)) {
    logMarkers();
    log("sphereId", (+sphere).toString(16));
    logSpheres();
  }

  if (Pad.IsKeyJustPressed(KeyCode.P)) {
    const scriptSphere = ScriptSpheres.fromHandle(+sphere);
    
    if (scriptSphere) {
      //find the marker with that m_nIdentifier
      const marker = C3DMarkers.findByM_nIdentifier(scriptSphere.m_nId);
      log("marker found:", marker !== null);
      
      if (marker) {
        // Modify the marker's color
        marker.color = {
          r: 100,
          g: 0,
          b: 100,
          a: marker.color.a
        };
      }
    }
  }
}


