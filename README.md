# Click-A-Mole

_A screenshot of click-a-mole inside Decentraland._

![screenshot](https://github.com/takJohn/click-a-mole/blob/master/screenshots/click-a-mole-sreen.jpg)

## Description

This is my entry for Decentraland's hackathon held over a one-week period at the end of January 2019.

My aim was to create a game that can be played by anyone; in the end I settled with a simple variation of the classic game called Whack-A-Mole. It's something that should be familiar with people of all age groups but the difference is that this is played inside a virtual environment called Decentraland, which is a world that you can explore in a first-person view within your web browser.

There are features in this game that utilises many of the new practices introduced in Decentraland's recent SDK update so in that respect, it provided a great platform for learning and all whilst having fun in the process as well.

## Your objective

The Backstory - _"You've just returned home from holiday and to your utter despair, you find your garden has been infiltrated by a pesky gang of moles. So far, they have managed to avoid the attention of authorities under the guise of construction workers and the community is at a loss on how to tackle the problem; your neighbours are already complaining about the noise and how it might affect the price of their land. Your job is to pummel these moles into oblivion before they cause more havoc across Decentraland..."_

The game is a single player experience and your goal is to attack as many moles as you can in 30 seconds. You can compete with friends to see who can get the highest score.

## Previewing the scene

Download and install the Decentraland CLI - please read this [installation guide](https://docs.decentraland.org/getting-started/installation-guide/) for further details.

```
npm i -g decentraland
```

Clone this repository.

```
$ git clone https://github.com/takJohn/click-a-mole.git
```

Change to the directory of the cloned repository.

```
$ cd click-a-mole
```

Install the required dependencies and preview the scene.

```
$ dcl start
```

This will automatically open up your browser and direct it to <http://127.0.0.1:8000>. You may need to refresh the page if you're not seeing the correct preview.

## Interacting with the scene

Use the mouse to look around and <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> keys on your keyboard to move. Point and click on the moles to attack, remember to get close to them before attacking otherwise your attacks will miss.

## Acknowledgements

- Music by Eric Matyas
- All sound effects are taken from Freesound.org
- Nico Earnshaw and the rest of the Decentraland team

## Issues

- The game is too easy.
- No background music as there's an issue with playing multiple audio files at the same time. This will be fixed in the next SDK update.
- The code is very rushed and needs to be cleaned up especially the way the respawning is handled.
- The stars that show up during the dizzy animation can appear disconnected to the mole. This is because the mole's up and down animations are baked into the file and therefore the transforms aren't registering correctly. The fix is to not include any animation that affects the mole's position in its exported file and do all position animation in code.
