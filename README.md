# Click-A-Mole

_A screenshot of click-a-mole inside Decentraland._

![screenshot](https://github.com/takJohn/click-a-mole/blob/master/screenshots/click-a-mole-screen.jpg)

Here's a quick gameplay [video](https://vimeo.com/314560404).

## Description

This is my entry for Decentraland's hackathon that was held over a one-week period at the end of January 2019. The only requirement was that we built an experience using the latest SDK5.0.

My aim was to create a game that can be played by anyone; in the end I settled with a simple variation of the classic game called Whack-A-Mole. It's something that should be familiar with people of all age groups but the difference is that this is played inside a virtual environment called Decentraland, which is a world that you can explore in a first-person view within your web browser.

There are features in this game that utilises many of the new practices introduced in Decentraland's recent SDK update so in that respect, it provided a great platform for learning and all whilst having fun in the process as well.

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

## Your objective

The Backstory - _"You've just returned home from holiday and to your utter despair, you find your garden has been infiltrated by a pesky gang of moles. So far, they have managed to avoid the attention of authorities under the guise of construction workers and the community is at a loss on how to tackle the problem; your neighbours are already complaining about the noise and how it might affect the price of their land. Your job is to pummel these moles into oblivion before they cause more havoc across Decentraland..."_

The game is a single player experience and your goal is to attack as many moles as you can in 30 seconds. You can compete with friends to see who can get the highest score.

## Step-by-step guide

The game is best played when you're in the garden i.e. within the confines of the fences. Use your mouse to look around and <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> keys on your keyboard to move forward, left, backward and right respectively. Point and click on the moles to attack but remember to get close to them before attacking or your attacks will miss.

1. Enter the garden via the front gate, it should have a warning sign hanging in front of it. Mouse button click to open and close the gate.
2. Click on the start button situated under the traffic lights to begin the game. The lights will transition to green to indicate that the game has started.
3. The moles will pop up randomly and each time you have successfully attacked a mole, you'll gain 10 points. The score is displayed on the construction sign.
4. The game ends after 30 seconds. To play again just hit the start button as you did before.

NOTE: You can stop the game by pressing the start button whilst the game is still in progress.

## Acknowledgements

- [Music](http://soundimage.org/) Music by Eric Matyas.
- All sound effects are taken from [freesound.org](https://freesound.org/).
- Nico Earnshaw and the rest of the Decentraland team, you can find Nico's tutorials [here](https://decentraland.org/blog/tutorials).

## Future improvements

- The game is too easy. To make it more challenging, will look into increasing the animation speed as the game goes on - meaning it the difficulty will ramp up over time.
- Add a combo system so that the more attacks you can string together without missing a mole will in turn give you bonus points.
- No background music as there's an issue with playing multiple audio files concurrently. This will be fixed in the next SDK update.
- The code is still very loose with "magic numbers" dotted around and a makeshift respawn system that needs an overhaul as it's a little convoluted, it could also do with a bit more randomness. 
- Overuse of timers, could probably get away with one or two. Future updates to the SDK will allow for animation event triggers, which should mean cleaner code.
- The stars that show up during the dizzy animation can appear disconnected to the mole. This is because the mole's up and down animations are baked into the file and therefore the transforms aren't registering correctly. The fix is to not include any animation that affects the mole's position in its exported file and do all position animation in code.
- Annoying bug that allows you to still hit the moles when they're already under the ground. As they're still considered in the alive state.
- Didn't get as far as adding blockchain interactions but I do have an interesting idea for a smart contract that I want to implement. However there's still a lot more work to be done with regards to the gameplay before anything else happens.

## Copyright info

This scene is protected with a standard Apache 2 licence. See the terms and conditions in the [LICENSE](/LICENSE) file.
