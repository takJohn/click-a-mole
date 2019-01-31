/// --- Modified from the jukebox scene ---
/// link: https://github.com/decentraland-scenes/Jukebox/blob/master/src/modules/buttons.ts

// Custom button component
@Component("buttonState")
export class ButtonState {
  pressed: boolean = false;
  zUp: number = 0;
  zDown: number = 0;
  fraction: number = 0;
  constructor(zUp: number, zDown: number) {
    this.zUp = zUp;
    this.zDown = zDown;
  }
}

// Component group
export const buttons = engine.getComponentGroup(Transform, ButtonState);

// Push button system (buttons remains pressed)
export class PushButton {
  update(dt: number) {
    for (let button of buttons.entities) {
      let transform = button.get(Transform);

      let state = button.get(ButtonState);
      if (state.pressed == true && state.fraction < 1) {
        transform.position.z = Scalar.Lerp(
          state.zUp,
          state.zDown,
          state.fraction
        );
        state.fraction += dt * 7.5;
      } else if (state.pressed == false && state.fraction > 0) {
        transform.position.z = Scalar.Lerp(
          state.zUp,
          state.zDown,
          state.fraction
        );
        state.fraction -= dt * 5;
      }
    }
  }
}
