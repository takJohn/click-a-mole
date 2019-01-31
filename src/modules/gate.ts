/// --- Modified from the open-door scene ---
/// link: https://github.com/decentraland-scenes/Open-door/blob/master/src/game.ts

// Custom component to handle opening and closing of the gate
@Component("gateSlerpData")
export class GateSlerpData {
  closed: boolean = true;
  fraction: number = 0;
  openPos: Quaternion = Quaternion.Euler(0, -90, 0);
  closedPos: Quaternion = Quaternion.Euler(0, 0, 0);
}

// A group to keep track of all entities with a GateState component
const gates = engine.getComponentGroup(GateSlerpData);

// A system to carry out the rotation
export class RotatorSystem {
  update(dt: number) {
    // Iterate over the doors in the component group
    for (let gate of gates.entities) {
      // get some handy shortcuts
      let slerp = gate.get(GateSlerpData);
      let transform = gate.get(Transform);

      // Check if the rotation needs to be adjusted
      if (slerp.closed == false && slerp.fraction < 1) {
        slerp.fraction += dt * 1.5;
        let rot = Quaternion.Slerp(
          slerp.closedPos,
          slerp.openPos,
          slerp.fraction
        );
        transform.rotation = rot;
      } else if (slerp.closed == true && slerp.fraction > 0) {
        slerp.fraction -= dt * 1.5;
        let rot = Quaternion.Slerp(
          slerp.closedPos,
          slerp.openPos,
          slerp.fraction
        );
        transform.rotation = rot;
      }
    }
  }
}
