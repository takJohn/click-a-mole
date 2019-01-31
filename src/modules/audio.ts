import { playSound } from "@decentraland/SoundController";

// =======================================================//
// === Playing multiple sound files at the same time   ===//
// === will be supported in future versions of the SDK ===//
// =======================================================//

/// --- Background Music ---
// playBackgroundMusic();

// function playBackgroundMusic() {
//   executeTask(async () => {
//     try {
//       await playSound("sounds/pet-antics_looping.mp3", {
//         loop: true,
//         volume: 2
//       });
//     } catch {
//       log("failed to play sound");
//     }
//   });
// }

// Play sound effect file
export function playAudio(playAudio: string) {
  executeTask(async () => {
    try {
      await playSound("sounds/" + playAudio, {
        loop: false,
        volume: 2
      });
    } catch {
      log("failed to play sound");
    }
  });
}
