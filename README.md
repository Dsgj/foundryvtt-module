# FoundryVTT Action Animations

## Overview
This module enhances the Foundry Virtual Tabletop experience by making it extremely easy to trigger action animations and notifications for both players and the Game Master (DM). It integrates with Sequencer, JB2A, Weather Control, and Dice So Nice, and provides simple global functions for use in macros or the console.

## Features
- One-line animation triggers for attacks and cantrips
- Automatic fallback to notifications if animation modules are unavailable
- DM-only utilities for forcing animations and sending global notifications
- Works for both players and DM, with special DM powers
- Magical weather overlays and roll impact when Weather Control is active
- Sentient dice reactions with Dice So Nice
- Evolving NPC moods based on HP
- Custom overlay template and advanced styles
- Optional dependencies: Sequencer, JB2A, Weather Control, Dice So Nice

## Installation
1. Download the module from the repository.
2. Place the module folder in the `modules` directory of your Foundry VTT installation.
3. Start Foundry VTT and enable the module in your game settings.

## Usage Examples

### For Players
You can trigger an animation for your token using a macro or the console:

```js
// Play an attack animation from your token to a target
yourTokenId = canvas.tokens.controlled[0]?.id;
targetTokenId = Array.from(game.user.targets)[0]?.id;
playActionAnimation({
  type: 'attack',
  sourceTokenId: yourTokenId,
  targetTokenId: targetTokenId,
  rollResult: 15 // optional
});

// Play a cantrip animation
yourTokenId = canvas.tokens.controlled[0]?.id;
playActionAnimation({
  type: 'cantrip',
  sourceTokenId: yourTokenId
});
```

### For the DM (Game Master)
The DM can force animations for any token and send a global notification:

```js
// Force an attack animation between any two tokens, with a DM broadcast message
dmForceAnimation({
  type: 'attack',
  sourceTokenId: 'SOURCE_TOKEN_ID',
  targetTokenId: 'TARGET_TOKEN_ID',
  rollResult: 20,
  message: 'A critical hit shakes the battlefield!'
});

// Send a cantrip animation from any token, no target
dmForceAnimation({
  type: 'cantrip',
  sourceTokenId: 'SOURCE_TOKEN_ID',
  message: 'A mysterious energy pulses from the mage.'
});
```

> **Note:** Only the DM can use `dmForceAnimation`. Players will see a warning if they try.

## Weather Control Integration
If the Weather Control module is enabled, magical weather overlays will appear and can impact D&D5e rolls (e.g., arcane storms cause disadvantage on attacks).

## Dice So Nice Integration
If Dice So Nice is enabled, dice will react emotionally to critical successes and failures.

## Evolving NPC Moods
NPCs will have a mood flag that evolves based on their HP, affecting spell animation colors and notifications.

## Development
To contribute to the development of this module, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the module directory:
   ```
   cd foundryvtt-action-animations
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Build the project:
   ```
   npm run build
   ```

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments
Thanks to the Foundry VTT community and the creators of Sequencer, JB2A, Weather Control, and Dice So Nice for their amazing tools.