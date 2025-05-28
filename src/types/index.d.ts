// MyModuleSettings defines the configuration options for the module.
/**
 * Configuration settings for MyModule.
 * @property setting1 - Enables or disables the primary feature.
 * @property setting2 - A string value for custom configuration.
 * @property setting3 - A numeric value for advanced tuning.
 */
export interface MyModuleSettings {
    setting1: boolean;
    setting2: string;
    setting3: number;
}

/**
 * Represents a data object used by MyModule.
 * @property id - Unique identifier for the data object.
 * @property name - Human-readable name for the data object.
 * @property description - Detailed description of the data object.
 */
export interface MyModuleData {
    id: string;
    name: string;
    description: string;
}

/**
 * Supported event types for MyModule.
 * - 'event1': Triggered on the first event.
 * - 'event2': Triggered on the second event.
 * - 'event3': Triggered on the third event.
 */
export type MyModuleEvent = 'event1' | 'event2' | 'event3';

// Types and interfaces relevant to the FoundryVTT Action Animations module

/**
 * Supported animation action types.
 * - 'attack': An attack action (melee, ranged, etc.)
 * - 'cantrip': A cantrip spell action
 */
export type AnimationActionType = 'attack' | 'cantrip';

/**
 * Represents the result of a dice roll relevant to an animation.
 * @property value - The numeric result of the roll.
 * @property isCritical - True if the roll is a critical success.
 * @property isFumble - True if the roll is a critical failure.
 */
export interface AnimationRollResult {
    value: number;
    isCritical: boolean;
    isFumble: boolean;
}

/**
 * Configuration options for the animation module.
 * @property enableAnimations - Whether to play animations when possible.
 * @property enableNotifications - Whether to show notifications for actions.
 */
export interface AnimationModuleSettings {
    enableAnimations: boolean;
    enableNotifications: boolean;
}

/**
 * Data passed to trigger an animation.
 * @property type - The type of action triggering the animation.
 * @property sourceName - The name of the source actor or token.
 * @property targetName - The name of the target actor, token, or object (optional).
 * @property rollResult - The result of the dice roll (optional).
 */
export interface AnimationTriggerData {
    type: AnimationActionType;
    sourceName: string;
    targetName?: string;
    rollResult?: AnimationRollResult;
}