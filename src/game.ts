// TODO: Restructure code to simplify the imports and exports
import { RotatorSystem, GateSlerpData } from "./modules/gate";
import { PushButton, ButtonState } from "./modules/buttons";
import { WaitSystem, TimeOut, paused } from "./modules/timer";
import { playAudio } from "./modules/audio";
import {
  MoleData,
  StarFlag,
  DazedDropSystem,
  OnHit,
  SquashLerpData,
  LookAnimSyncTimer,
  RespawnTime,
  DazedTimeOut,
  stars,
  moles
} from "./modules/mole";

// User information
const camera = Camera.instance;
let playerScore = 0;

/// --- Ground ---
let ground = new Entity();
ground.add(new GLTFShape("./models/ground.glb"));
ground.add(new Transform({ position: new Vector3(5, 0, 5) }));
engine.addEntity(ground);

/// --- Gate ---
engine.addSystem(new RotatorSystem());

let mainGate = new Entity();
mainGate.add(new GLTFShape("./models/gate.glb"));
mainGate.add(new Transform({ position: new Vector3(0.882, 0, -0.07) }));
engine.addEntity(mainGate);

// Define an entity to act as the pivot point for the mainGate.
const gatePivot = new Entity();
gatePivot.add(
  new Transform({
    position: new Vector3(4.118, 0, 0.294)
  })
);
gatePivot.add(new GateSlerpData());
engine.addEntity(gatePivot);

// Set the mainGate as a child of gatePivot
mainGate.setParent(gatePivot);

// Set the click behaviour for the gate
mainGate.add(
  new OnClick(e => {
    let state = mainGate.getParent().get(GateSlerpData);
    state.closed = !state.closed;
    playAudio("gate-latch.mp3");
  })
);

/// --- UI Elements ---
let scoreSign = new Entity();
scoreSign.add(new GLTFShape("./models/score-sign.glb"));
scoreSign.add(new Transform({ position: new Vector3(9.2, 0, 5) }));
engine.addEntity(scoreSign);

// Adding floating text
const floatingText = new Entity();
floatingText.add(
  new Transform({
    position: new Vector3(5, 1.78, 5)
  })
);

// Declare text messages
const getCloserText = new TextShape("GET CLOSER!");
const plusTenText = new TextShape("+10");

floatingText.set(plusTenText);
floatingText.get(TextShape).visible = false;
engine.addEntity(floatingText);

// Get closer text attributes
getCloserText.fontFamily = "Arial Black, Arial, Helvetica, sans-serif";
getCloserText.fontSize = 65;
getCloserText.textWrapping = true;
getCloserText.color = Color3.Red();
getCloserText.outlineWidth = 8;
getCloserText.outlineColor = Color3.Yellow();

// Plus ten text attributes
plusTenText.fontFamily = "Arial Black, Arial, Helvetica, sans-serif";
plusTenText.fontSize = 70;
plusTenText.color = Color3.Green();
plusTenText.outlineWidth = 8;
plusTenText.outlineColor = Color3.Black();

// Adding current / total score
const currentScoreText = new Entity();

currentScoreText.setParent(scoreSign);
currentScoreText.add(
  new Transform({
    position: new Vector3(0, 1.23, -0.11)
  })
);
engine.addEntity(currentScoreText);

/// --- Score System ---

// Display current score
function displayCurrentScore() {
  let scoreText = new TextShape(playerScore + " pts");

  // Score text attributes
  scoreText.fontFamily = "Arial Black, Arial, Helvetica, sans-serif";
  scoreText.textWrapping = true;
  scoreText.paddingLeft = 20;
  scoreText.fontSize = 80;
  scoreText.color = Color3.FromHexString("#292929");

  currentScoreText.set(scoreText);
  let textShape = currentScoreText.get(TextShape);

  textShape.visible = true;
}

// TODO: Make these systems more generic
// System to keep the text facing the user
class TextToUserSystem {
  update() {
    let floatingTransformText = floatingText.get(Transform);
    floatingTransformText.lookAt(camera.position);
    floatingTransformText.rotate(Vector3.Up(), 180);

    // Score board
    scoreSign.get(Transform).lookAt(camera.position);
    scoreSign.get(Transform).rotate(Vector3.Up(), 180);

    // Keep sign grounded when camera is in fly mode
    scoreSign.get(Transform).rotation.x = 0;
    scoreSign.get(Transform).rotation.z = 0;
    displayCurrentScore();
  }
}

engine.addSystem(new TextToUserSystem());

// System to fade out the floating text
class FadingTextSystem {
  update(dt: number) {
    let transform = floatingText.get(Transform);
    let textShape = floatingText.get(TextShape);
    let increment = Vector3.Up().scale(dt * 0.33);
    textShape.opacity -= dt;
    transform.translate(increment);

    if (transform.position.y > 2.1) {
      textShape.visible = false;
      textShape.opacity = 1;
      transform.position.y = 1.78; // Reset text transform so that it doesn't go out of bounds
    }
  }
}

engine.addSystem(new FadingTextSystem());

// TODO: Check whether a for loop works for this...
/// --- Mole 1 ---
let mole1 = new Entity();
mole1.add(new GLTFShape("./models/mole.glb"));
mole1.add(new Transform({ position: new Vector3(5, 0, 5) }));
engine.addEntity(mole1);

// Add mole1 custom components
mole1.add(new MoleData());
mole1.add(new SquashLerpData());

// Add mole1 animations
let stars1 = new Entity();
stars1.add(new StarFlag());
stars1.add(new GLTFShape("./models/stars.glb"));
stars1.add(new Transform({ position: new Vector3(0, 1.8, 0.125) }));
stars1.setParent(mole1);
stars1.get(GLTFShape).visible = false;
engine.addEntity(stars1);

const lookClip1 = new AnimationClip("look");
mole1.get(GLTFShape).addClip(lookClip1);
lookClip1.loop = false;

const dazedClip1 = new AnimationClip("dazed");
mole1.get(GLTFShape).addClip(dazedClip1);
dazedClip1.loop = true;

const dizzyClip1 = new AnimationClip("dizzy");
stars1.get(GLTFShape).addClip(dizzyClip1);

/// --- Mole 2 ---
let mole2 = new Entity();
mole2.add(new GLTFShape("./models/mole.glb"));
mole2.add(new Transform({ position: new Vector3(2, 0, 2) }));
engine.addEntity(mole2);

// Add mole2 custom components
mole2.add(new MoleData());
mole2.add(new SquashLerpData());

// Add mole2 animations
let stars2 = new Entity();
stars2.add(new StarFlag());
stars2.add(new GLTFShape("./models/stars.glb"));
stars2.add(new Transform({ position: new Vector3(0, 1.8, 0.125) }));
stars2.setParent(mole2);
stars2.get(GLTFShape).visible = false;
engine.addEntity(stars2);

const lookClip2 = new AnimationClip("look");
mole2.get(GLTFShape).addClip(lookClip2);
lookClip2.loop = false;

const dazedClip2 = new AnimationClip("dazed");
mole2.get(GLTFShape).addClip(dazedClip2);
dazedClip2.loop = true;

const dizzyClip2 = new AnimationClip("dizzy");
stars2.get(GLTFShape).addClip(dizzyClip2);

/// --- Mole 3 ---
let mole3 = new Entity();
mole3.add(new GLTFShape("./models/mole.glb"));
mole3.add(new Transform({ position: new Vector3(2, 0, 8) }));
engine.addEntity(mole3);

// Add mole3 custom components
mole3.add(new MoleData());
mole3.add(new SquashLerpData());

// Add mole3 animations
let stars3 = new Entity();
stars3.add(new StarFlag());
stars3.add(new GLTFShape("./models/stars.glb"));
stars3.add(new Transform({ position: new Vector3(0, 1.8, 0.125) }));
stars3.setParent(mole3);
stars3.get(GLTFShape).visible = false;
engine.addEntity(stars3);

const lookClip3 = new AnimationClip("look");
mole3.get(GLTFShape).addClip(lookClip3);
lookClip3.loop = false;

const dazedClip3 = new AnimationClip("dazed");
mole3.get(GLTFShape).addClip(dazedClip3);
dazedClip3.loop = true;

const dizzyClip3 = new AnimationClip("dizzy");
stars3.get(GLTFShape).addClip(dizzyClip3);

/// --- Mole 4 ---
let mole4 = new Entity();
mole4.add(new GLTFShape("./models/mole.glb"));
mole4.add(new Transform({ position: new Vector3(8, 0, 8) }));
engine.addEntity(mole4);

// Add mole4 custom components
mole4.add(new MoleData());
mole4.add(new SquashLerpData());

// Add mole4 animations
let stars4 = new Entity();
stars4.add(new StarFlag());
stars4.add(new GLTFShape("./models/stars.glb"));
stars4.add(new Transform({ position: new Vector3(0, 1.8, 0.125) }));
stars4.setParent(mole4);
stars4.get(GLTFShape).visible = false;
engine.addEntity(stars4);

const lookClip4 = new AnimationClip("look");
mole4.get(GLTFShape).addClip(lookClip4);
lookClip4.loop = false;

const dazedClip4 = new AnimationClip("dazed");
mole4.get(GLTFShape).addClip(dazedClip4);
dazedClip4.loop = true;

const dizzyClip4 = new AnimationClip("dizzy");
stars4.get(GLTFShape).addClip(dizzyClip4);

/// --- Mole 5 ---
let mole5 = new Entity();
mole5.add(new GLTFShape("./models/mole.glb"));
mole5.add(new Transform({ position: new Vector3(8, 0, 2) }));
engine.addEntity(mole5);

// Add mole5 custom components
mole5.add(new MoleData());
mole5.add(new SquashLerpData());

// Add mole5 animations
let stars5 = new Entity();
stars5.add(new StarFlag());
stars5.add(new GLTFShape("./models/stars.glb"));
stars5.add(new Transform({ position: new Vector3(0, 1.8, 0.125) }));
stars5.setParent(mole5);
stars5.get(GLTFShape).visible = false;
engine.addEntity(stars5);

const lookClip5 = new AnimationClip("look");
mole5.get(GLTFShape).addClip(lookClip5);
lookClip5.loop = false;

const dazedClip5 = new AnimationClip("dazed");
mole5.get(GLTFShape).addClip(dazedClip5);
dazedClip5.loop = true;

const dizzyClip5 = new AnimationClip("dizzy");
stars5.get(GLTFShape).addClip(dizzyClip5);

/// --- Mole Click Events ---
mole1.add(
  new OnClick(e => {
    attackMole(mole1);
  })
);

mole2.add(
  new OnClick(e => {
    attackMole(mole2);
  })
);

mole3.add(
  new OnClick(e => {
    attackMole(mole3);
  })
);

mole4.add(
  new OnClick(e => {
    attackMole(mole4);
  })
);

mole5.add(
  new OnClick(e => {
    attackMole(mole5);
  })
);

function attackMole(mole: Entity) {
  // Grab mole's position and state data
  let moleTransform = mole.get(Transform);
  let moleData = mole.get(MoleData);

  // Only display floating UI elements when the mole is alive
  let textTransform = floatingText.get(Transform);
  let textShape = floatingText.get(TextShape);

  if (moleData.isAlive) {
    textShape.visible = true;
    textTransform.position = new Vector3(
      moleTransform.position.x,
      1.78,
      moleTransform.position.z
    );
    textShape.opacity = 1;
  }

  // User has to be within ~2.8m before they can attack a mole
  let distance = calculateDistance(moleTransform.position, camera.position);

  if (distance < 8 && moleData.isAlive) {
    dazedSequence(mole);
    floatingText.set(plusTenText);
    playerScore += 10;
    log(`Score: ${playerScore}`);
  } else {
    if (moleData.isAlive) {
      floatingText.set(getCloserText);
      log("Get Closer!");
    }
  }
}

// Calculating distance between two points
function calculateDistance(point1: Vector3, point2: Vector3): number {
  const a = point1.x - point2.x;
  const b = point1.z - point2.z;
  return a * a + b * b;
}

/// --- Dazed Sequence ---
engine.addSystem(new DazedDropSystem());

function dazedSequence(dyingMole: Entity) {
  let moleData = dyingMole.get(MoleData);
  moleData.isHit = true;

  for (let star of stars.entities) {
    if (dyingMole == star.getParent()) {
      star.get(GLTFShape).visible = true;
      star
        .get(GLTFShape)
        .getClip("dizzy")
        .play();
    }
  }

  playAudio("hit-squeak.mp3");
  dyingMole
    .get(GLTFShape)
    .getClip("dazed")
    .play();
  dyingMole
    .get(GLTFShape)
    .getClip("look")
    .pause();

  moleData.isAlive = false;
  if (dyingMole.has(LookAnimSyncTimer)) {
    dyingMole.remove(LookAnimSyncTimer);
  }

  dyingMole.set(new RespawnTime(2));
}

engine.addSystem(new OnHit());

/// --- Traffic Lights ---

engine.addSystem(new WaitSystem());

// Adding the traffic lights
let trafficLights = new Entity();
trafficLights.add(new GLTFShape("./models/traffic-lights.glb"));
trafficLights.add(new Transform({ position: new Vector3(5, 0, 5) }));
engine.addEntity(trafficLights);

@Component("lightData")
class LightData {
  startColor: Color3 = Color3.Black();
  endColor: Color3 = Color3.White();
  colorRatio: number = 0;
  playedAudio: boolean = false;
  constructor(endColor: Color3) {
    this.endColor = endColor;
  }
}

// Red light material setup
const redLightMaterial = new Material();
redLightMaterial.albedoColor = Color3.FromHexString("#CC0000");
redLightMaterial.metallic = 0.8;
redLightMaterial.roughness = 0.1;

// Red light
let redLight = new Entity();
redLight.add(new CylinderShape());
redLight.add(
  new Transform({
    position: new Vector3(5, 3.8, 9.15),
    rotation: Quaternion.Euler(90, 0, 0),
    scale: new Vector3(0.225, 0.05, 0.225)
  })
);
redLight.add(new LightData(Color3.Red()));
redLight.add(redLightMaterial);
engine.addEntity(redLight);

// Amber light material setup
const amberLightMaterial = new Material();
amberLightMaterial.albedoColor = Color3.FromHexString("#DD3300");
amberLightMaterial.metallic = 0.8;
amberLightMaterial.roughness = 0.1;

// Amber light
let amberLight = new Entity();
amberLight.add(new CylinderShape());
amberLight.add(
  new Transform({
    position: new Vector3(5, 3.2, 9.15),
    rotation: Quaternion.Euler(90, 0, 0),
    scale: new Vector3(0.225, 0.05, 0.225)
  })
);
amberLight.add(new LightData(Color3.FromHexString("#DD3300")));
amberLight.add(amberLightMaterial);
engine.addEntity(amberLight);

// Green light material setup
const greenLightMaterial = new Material();
greenLightMaterial.albedoColor = Color3.FromHexString("#113300");
greenLightMaterial.metallic = 0.8;
greenLightMaterial.roughness = 0.1;

// Green light
let greenLight = new Entity();
greenLight.add(new CylinderShape());
greenLight.add(
  new Transform({
    position: new Vector3(5, 2.6, 9.15),
    rotation: Quaternion.Euler(90, 0, 0),
    scale: new Vector3(0.225, 0.05, 0.225)
  })
);
greenLight.add(new LightData(Color3.Green()));
greenLight.add(greenLightMaterial);
engine.addEntity(greenLight);

const lights = engine.getComponentGroup(LightData);

// This system changes the value of colorRatio every frame, and sets a new color on the material
class TrafficLightSystem {
  update(dt: number) {
    let state = startButton.get(ButtonState);
    let lerpRed = redLight.get(LightData);
    let lerpAmber = amberLight.get(LightData);
    let lerpGreen = greenLight.get(LightData);
    let lerpMult = 8;

    if (state.pressed) {
      lerpRed.colorRatio += dt * lerpMult;

      if (lerpRed.colorRatio < 1) {
        lightTransition(redLightMaterial, lerpRed, "countdown-ready-set.mp3");
        redLight.set(new TimeOut(1)); // 1 second timeout for amber light
        log("READY");
      } else {
        if (!redLight.has(TimeOut)) {
          redLightMaterial.emissiveColor = lerpRed.startColor;
          lerpAmber.colorRatio += dt * lerpMult;

          if (lerpAmber.colorRatio < 1) {
            lightTransition(
              amberLightMaterial,
              lerpAmber,
              "countdown-ready-set.mp3"
            );
            amberLight.set(new TimeOut(1)); // 1 second timeout for amber light
            log("SET");
          } else {
            if (!amberLight.has(TimeOut)) {
              amberLightMaterial.emissiveColor = lerpAmber.startColor;
              lerpGreen.colorRatio += dt * lerpMult;

              if (lerpGreen.colorRatio < 1) {
                lightTransition(
                  greenLightMaterial,
                  lerpGreen,
                  "countdown-go.mp3"
                );
                greenLight.set(new TimeOut(60)); // 60 second timeout for the green light
                log("GO!!!");

                startGame();
              } else {
                if (!greenLight.has(TimeOut)) {
                  playAudio("game-end-horn.mp3");
                  state.pressed = false;

                  endGame();
                }
              }
            }
          }
        }
      }
    } else {
      // Remove all timeouts even when button is manually toggled off
      for (let ent of paused.entities) {
        let time = ent.getOrNull(TimeOut);
        if (time) {
          ent.remove(TimeOut);
        }
      }

      // Reset all lights
      for (let light of lights.entities) {
        light.get(LightData).colorRatio = 0;
        light.get(Material).emissiveColor = light.get(LightData).startColor;
        light.get(LightData).playedAudio = false;
      }

      endGame();
    }
  }
}

function lightTransition(
  material: Material,
  lerpLight: LightData,
  sound: string
) {
  if (!lerpLight.playedAudio) {
    playAudio(sound);
    lerpLight.playedAudio = true;
  }

  material.emissiveColor = Color3.Lerp(
    lerpLight.startColor,
    lerpLight.endColor,
    lerpLight.colorRatio
  );
}

// Add the system to the engine
engine.addSystem(new TrafficLightSystem());

/// --- Start Button ---

// Adding the start button
let startButton = new Entity();
startButton.add(new GLTFShape("./models/start-button.glb"));
startButton.add(new Transform({ position: new Vector3(5, 0, 5) }));
engine.addEntity(startButton);

// Start button system
engine.addSystem(new PushButton());

let startButtonPosition = startButton.get(Transform).position.z;
startButton.add(
  new ButtonState(startButtonPosition, startButtonPosition + 0.1)
);

startButton.add(
  new OnClick(e => {
    let state = startButton.get(ButtonState);
    state.pressed = !state.pressed;
    state.pressed ? log("Game started") : log("Game stopped");
  })
);

/// --- Start / End Game ---
for (let mole of moles.entities) {
  mole.get(GLTFShape).visible = false;
}

function startGame() {
  for (let mole of moles.entities) {
    playerScore = 0;
    mole.set(new RespawnTime(0));
  }
}

function endGame() {
  for (let mole of moles.entities) {
    if (mole.has(RespawnTime)) {
      mole.remove(RespawnTime);
    }
    if (mole.has(LookAnimSyncTimer)) {
      mole.remove(LookAnimSyncTimer);
    }
    if (mole.has(DazedTimeOut)) {
      mole.remove(DazedTimeOut);
    }
    // Disable all attacks on moles
    mole.get(MoleData).isAlive = false;
  }
}

/// --- BUG FIX ---
/// Force screen redraw for the traffic lights to avoid emission intensity variances in the materials
let invisibleCube = new Entity();
invisibleCube.add(new Transform({ position: new Vector3(5, 0, 5) }));
invisibleCube.add(new BoxShape());
invisibleCube.get(BoxShape).visible = false;
engine.addEntity(invisibleCube);

@Component("bugLerpData")
class BugLerpData {
  origin: Vector3 = new Vector3(5, 0, 5);
  target: Vector3 = new Vector3(5, 1, 5);
  fraction: number = 0;
  time: number = 0;
}

invisibleCube.add(new BugLerpData());

class SinLerpMove {
  update(dt: number) {
    let transform = invisibleCube.get(Transform);
    let lerp = invisibleCube.get(BugLerpData);
    lerp.time += dt / 6;
    lerp.fraction = Math.sin(lerp.time);
    transform.position = Vector3.Lerp(lerp.origin, lerp.target, lerp.fraction);
  }
}

engine.addSystem(new SinLerpMove());
