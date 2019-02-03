// User information
const playerCamera = Camera.instance;

/// --- Mole ---
// Component for storing state data for each mole
@Component("moleData")
export class MoleData {
  isAlive: boolean = true;
  isDazed: boolean = false;
  isHit: boolean = false;
}

// Component group
export const moles = engine.getComponentGroup(MoleData);

/// --- Squash Sequence ---
@Component("squashLerpData")
export class SquashLerpData {
  normalScale: Vector3 = new Vector3(1, 1, 1);
  squashScale: Vector3 = new Vector3(1.2, 0.8, 1.2);
  weight: number = 0;
}

// When mole gets hit (squash animation)
export class OnHit {
  update(dt: number) {
    for (let mole of moles.entities) {
      let transform = mole.get(Transform);
      let moleData = mole.get(MoleData);
      let lerp = mole.get(SquashLerpData);

      if (moleData.isHit) {
        if (lerp.weight < 1 && !moleData.isDazed) {
          lerp.weight += dt * 4;
          transform.scale = Vector3.Lerp(
            lerp.normalScale,
            lerp.squashScale,
            lerp.weight
          );
        } else {
          moleData.isDazed = true;
        }
        if (lerp.weight > 0 && moleData.isDazed) {
          lerp.weight -= dt * 4;
          transform.scale = Vector3.Lerp(
            lerp.normalScale,
            lerp.squashScale,
            lerp.weight
          );
        }
      }
    }
  }
}

// Caused the moles to drop down back into their holes after they've been dazed
export class DazedDropSystem {
  update(dt: number) {
    for (let mole of moles.entities) {
      let dazed = mole.get(MoleData).isDazed;
      let transform = mole.get(Transform);
      let increment = Vector3.Down().scale(dt * 1.25);
      if (dazed) {
        transform.translate(increment);
      }
    }
  }
}

// Dazed system
@Component("dazedTimeOut")
export class DazedTimeOut {
  dazedTimeLeft: number;
  constructor(seconds: number) {
    this.dazedTimeLeft = seconds;
  }
}

export const dazedMoles = engine.getComponentGroup(DazedTimeOut);

export class DazedWaitSystem {
  update(dt: number) {
    for (let mole of dazedMoles.entities) {
      let time = mole.getOrNull(DazedTimeOut);
      if (time) {
        if (time.dazedTimeLeft > 0) {
          time.dazedTimeLeft -= dt;
        } else {
          resetClip(mole);
          mole.remove(DazedTimeOut);
        }
      }
    }
  }
}

// Respawn system
@Component("respawnTime")
export class RespawnTime {
  respawnTimeLeft: number;
  constructor(seconds: number) {
    this.respawnTimeLeft = seconds;
  }
}
export const respawns = engine.getComponentGroup(RespawnTime);

export class RandomRespawnSystem {
  update(dt: number) {
    for (let mole of respawns.entities) {
      let respawnTime = mole.getOrNull(RespawnTime);
      let moleData = mole.get(MoleData);

      if (respawnTime) {
        if (respawnTime.respawnTimeLeft > 0) {
          respawnTime.respawnTimeLeft -= dt;
        } else {
          moleData.isAlive = true;
          moleData.isDazed = false;
          moleData.isHit = false;
          hideStars(mole);
          mole.set(new DazedTimeOut(Math.floor(Math.random() * 5 + 1)));
          mole.remove(RespawnTime);
          fastForwardClip(mole);
        }
      }
    }
  }
}

// Stars component for tagging stars
@Component("starFlag")
export class StarFlag {}
export const stars = engine.getComponentGroup(StarFlag);

function hideStars(mole: Entity) {
  for (let star of stars.entities) {
    if (mole == star.getParent()) {
      star.get(GLTFShape).visible = false;
    }
  }
}

// NOTE: Animations that are paused will resume where they've left off once they are played again
function fastForwardClip(mole: Entity) {
  mole.get(GLTFShape).getClip("look").speed = 10;
  mole
    .get(GLTFShape)
    .getClip("look")
    .play();
  mole
    .get(GLTFShape)
    .getClip("dazed")
    .pause();
  mole.get(GLTFShape).visible = false;
  mole.get(Transform).position.y = 0;
}

function resetClip(mole: Entity) {
  mole.get(GLTFShape).getClip("look").speed = 1;
  mole
    .get(GLTFShape)
    .getClip("look")
    .play();
  mole.get(GLTFShape).visible = true;
  mole.get(Transform).lookAt(playerCamera.position);

  // Rotate 180 to compensate for models z-axis facing the other way
  mole.get(Transform).rotate(Vector3.Up(), 180);

  // Set off LookAnimSyncTimer
  mole.set(new LookAnimSyncTimer(3));
}

engine.addSystem(new DazedWaitSystem());
engine.addSystem(new RandomRespawnSystem());

/// --- Look Animation Run Through ---
/// (Detect if the "look" animation clip has ran its course)
@Component("lookAnimSyncTimer")
export class LookAnimSyncTimer {
  animTimeLeft: number;
  constructor(seconds: number) {
    this.animTimeLeft = seconds;
  }
}

// Actual animation is ~3 seconds (100 frames)
// New simplified alive respawn system for the moles that didn't die
export class AliveRespawnSystem {
  update(dt: number) {
    for (let mole of moles.entities) {
      let animTime = mole.getOrNull(LookAnimSyncTimer);
      if (animTime) {
        if (animTime.animTimeLeft > 0) {
          animTime.animTimeLeft -= dt;
        } else {
          mole.remove(LookAnimSyncTimer);
          mole.get(MoleData).isAlive = false;
          mole.set(new RespawnTime(2));
        }
      }
    }
  }
}

engine.addSystem(new AliveRespawnSystem());
