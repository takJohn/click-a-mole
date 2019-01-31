/// --- Taken from gnark-patrol scene ---
/// link: https://github.com/decentraland-scenes/Gnark-patrol/blob/master/src/game.ts

// Timer system
@Component("timeOut")
export class TimeOut {
  timeLeft: number;
  constructor(time: number) {
    this.timeLeft = time;
  }
}

// Component group
export const paused = engine.getComponentGroup(TimeOut);

export class WaitSystem {
  update(dt: number) {
    for (let ent of paused.entities) {
      let time = ent.getOrNull(TimeOut);
      if (time) {
        if (time.timeLeft > 0) {
          time.timeLeft -= dt;
        } else {
          ent.remove(TimeOut);
        }
      }
    }
  }
}
