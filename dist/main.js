export class MyModule {
    constructor() {
        console.log('MyModule initialized');
    }
    init() {
        this.setupHooks();
    }
    setupHooks() {
        Hooks.on('init', () => {
            console.log('Foundry VTT is initializing MyModule');
            // Register a module setting to enable/disable action animations
            game.settings.register('foundryvtt-module', 'enableAnimations', {
                name: 'Enable Action Animations',
                hint: 'Toggle to enable or disable action animations for this module.',
                scope: 'world',
                config: true,
                type: Boolean,
                default: true
            });
        });
    }
}
// Check if Sequencer and JB2A are active
function isSequencerActive() {
    return typeof window.Sequencer !== "undefined" && game.modules.get("sequencer")?.active;
}
function isJB2AActive() {
    return game.modules.get("jb2a_patreon")?.active;
}
// Play JB2A animation via Sequencer
async function playSequencerAnimation({ type, source, target, rollResult }) {
    if (!isSequencerActive() || !isJB2AActive()) {
        ui.notifications?.warn("Sequencer and/or JB2A are not enabled! Animation cannot be played.");
        return;
    }
    let file = "";
    // Choose animation based on type and result
    if (type === "attack") {
        if (rollResult === 1)
            file = "jb2a.miss.blue.01";
        else if (rollResult === 20)
            file = "jb2a.magic_missile.purple";
        else
            file = "jb2a.sword_slash.blue";
    }
    else if (type === "cantrip") {
        file = "jb2a.fire_bolt.orange";
    }
    if (!file)
        return;
    // Play the animation
    new window.Sequencer.Effect()
        .file(`modules/jb2a_patreon/Library/3rd_Level/${file}.webm`)
        .atLocation(source)
        .stretchTo(target)
        .play();
}
// Animation utility (placeholder)
function playAnimation(type, source, target, rollResult) {
    // Check if the module setting is enabled
    if (!game.settings.get('foundryvtt-module', 'enableAnimations')) {
        return;
    }
    if (isSequencerActive() && isJB2AActive()) {
        playSequencerAnimation({ type, source, target, rollResult });
        return;
    }
    // Fallback: show only notification
    if (type === 'cantrip' && target instanceof DoorControl) {
        ui.notifications.info(`${source.name} conjures a cantrip, sending magical energy surging towards the door, seeking to unlock or disrupt its mechanism!`);
    }
    else if (type === 'attack' && target instanceof Token) {
        if (rollResult === 1) {
            ui.notifications.warn(`${source.name} attempts a daring attack on ${target.name}, but fumbles disastrously, leaving themselves wide open!`);
        }
        else if (rollResult === 20) {
            ui.notifications.info(`${source.name} strikes with flawless precision, landing a critical blow on ${target.name} that echoes with heroic might!`);
        }
        else {
            ui.notifications.info(`${source.name} launches a determined assault against ${target.name}, their weapon arcing through the air in a display of skill and resolve.`);
        }
    }
}
Hooks.on('createChatMessage', async (msg) => {
    // Check if the message is a dice roll related to an action
    const roll = msg.rolls?.[0];
    if (!roll)
        return;
    const rollResult = roll.total;
    const flags = msg.flags;
    // Example: identify action type and target
    const actionType = flags?.dnd5e?.roll?.type; // e.g. 'attack', 'spell', etc.
    const sourceToken = canvas.tokens?.get(msg.speaker.token);
    let targetToken;
    if (game.user?.targets.size) {
        targetToken = Array.from(game.user.targets)[0];
    }
    // Door targeting (placeholder)
    let doorTarget;
    // Here you can add logic to identify doors as targets
    if (actionType === 'spell' && flags?.dnd5e?.roll?.cantrip && doorTarget) {
        playAnimation('cantrip', sourceToken, doorTarget);
    }
    else if (actionType === 'attack' && targetToken) {
        playAnimation('attack', sourceToken, targetToken, rollResult);
    }
});
// Utility: Play an action animation (for players and DM)
window.playActionAnimation = function ({ type, sourceTokenId, targetTokenId, rollResult }) {
    const source = canvas.tokens?.get(sourceTokenId);
    const target = targetTokenId ? canvas.tokens?.get(targetTokenId) : undefined;
    playAnimation(type, source, target, rollResult);
};
globalThis.playActionAnimation = window.playActionAnimation;
// DM-Only Utility: Force animation for any token and send global notification
window.dmForceAnimation = function ({ type, sourceTokenId, targetTokenId, rollResult, message }) {
    if (!game.user?.isGM) {
        ui.notifications.warn('Only the Game Master can use this feature.');
        return;
    }
    const source = canvas.tokens?.get(sourceTokenId);
    const target = targetTokenId ? canvas.tokens?.get(targetTokenId) : undefined;
    playAnimation(type, source, target, rollResult);
    if (message) {
        ui.notifications.info(`[DM Broadcast] ${message}`);
    }
};
globalThis.dmForceAnimation = window.dmForceAnimation;
// --- Wild Magic Weather Integration ---
// If Weather Control module is present, add magical weather effects that impact D&D5e gameplay
function isWeatherControlActive() {
    return game.modules.get("weather-control")?.active;
}
// Register a magical weather effect compendium if not present
Hooks.once('ready', async () => {
    if (isWeatherControlActive()) {
        console.log("Weather Control detected! Integrating magical weather effects.");
        // Example: Add a magical weather overlay and impact rolls
        Hooks.on('dnd5e.preRollAttack', (item, config, options) => {
            const weather = game.settings.get('weather-control', 'currentWeather');
            if (weather && weather.includes('arcane storm')) {
                ui.notifications.info("Arcane storm rages! All attack rolls are made with disadvantage.");
                config.disadvantage = true;
            }
        });
        // Show a magical weather overlay using our template
        const overlayData = {
            title: "Arcane Storm!",
            description: "Wild magic surges through the air. Spells may go awry, and attacks are harder to land!"
        };
        window.renderTemplate("modules/foundryvtt-module/templates/effect.html", overlayData).then((html) => {
            const div = document.createElement('div');
            div.innerHTML = html;
            div.style.position = 'absolute';
            div.style.top = '10px';
            div.style.left = '50%';
            div.style.transform = 'translateX(-50%)';
            div.style.zIndex = '10000';
            document.body.appendChild(div);
            setTimeout(() => div.remove(), 8000);
        });
    }
});
// --- Sentient Dice Integration ---
// If Dice So Nice is present, make dice react emotionally to criticals/fumbles
function isDiceSoNiceActive() {
    return game.modules.get("dice-so-nice")?.active;
}
Hooks.on('diceSoNiceRollComplete', (message) => {
    if (!isDiceSoNiceActive())
        return;
    const roll = message?.rolls?.[0];
    if (!roll)
        return;
    const total = roll.total;
    if (total === 1) {
        ui.notifications.warn("Your dice shudder in shame at the critical failure!");
        // Optionally, trigger a sad dice animation
    }
    else if (total === 20) {
        ui.notifications.info("Your dice leap with joy at the critical success!");
        // Optionally, trigger a happy dice animation
    }
});
// --- Evolving NPCs: Add a flag to track NPC mood and evolve over time ---
Hooks.on('updateActor', (actor, changes, options, userId) => {
    if (actor.type !== 'npc')
        return;
    let mood = actor.getFlag('foundryvtt-module', 'mood') || 'neutral';
    if (changes.data?.attributes?.hp?.value !== undefined) {
        const hp = changes.data.attributes.hp.value;
        if (hp < 5)
            mood = 'desperate';
        else if (hp < 15)
            mood = 'angry';
        else
            mood = 'confident';
        actor.setFlag('foundryvtt-module', 'mood', mood);
        ui.notifications.info(`${actor.name}'s mood is now ${mood}.`);
    }
});
// --- Animate Spell Effects with Emotions (Sequencer + JB2A) ---
Hooks.on('dnd5e.useItem', async (item, config, options) => {
    if (!isSequencerActive() || !isJB2AActive())
        return;
    if (item.type === 'spell') {
        const mood = item.actor?.getFlag('foundryvtt-module', 'mood') || 'neutral';
        let color = 'blue';
        if (mood === 'angry')
            color = 'red';
        else if (mood === 'desperate')
            color = 'purple';
        else if (mood === 'confident')
            color = 'gold';
        new window.Sequencer.Effect()
            .file(`modules/jb2a_patreon/Library/1st_Level/magic_missile/magic_missile_${color}_30ft.webm`)
            .atLocation(item.actor?.token)
            .play();
    }
});
// --- Handlebars Helpers for Advanced UI ---
Hooks.once('init', () => {
    // Register Handlebars helpers for use in templates
    const handlebars = window.Handlebars;
    if (typeof handlebars !== 'undefined') {
        handlebars.registerHelper('range', function (start, end) {
            let arr = [];
            for (let i = start; i < end; i++)
                arr.push(i);
            return arr;
        });
        handlebars.registerHelper('random', function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        });
    }
});
const myModule = new MyModule();
myModule.init();
