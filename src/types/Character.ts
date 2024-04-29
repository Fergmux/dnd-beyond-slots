export interface Response {
  id: number
  success: boolean
  message: string
  data: Data
  pagination: null
}

export interface Data {
  id: number
  userId: number
  username: string
  isAssignedToPlayer: boolean
  readonlyUrl: string
  decorations: Decorations
  name: string
  socialName: null
  gender: string
  faith: string
  age: number
  hair: string
  eyes: string
  skin: string
  height: string
  weight: number
  inspiration: boolean
  baseHitPoints: number
  bonusHitPoints: null
  overrideHitPoints: null
  removedHitPoints: number
  temporaryHitPoints: number
  currentXp: number
  alignmentId: number
  lifestyleId: number
  stats: Stat[]
  bonusStats: Stat[]
  overrideStats: Stat[]
  background: DataBackground
  race: Race
  raceDefinitionId: null
  raceDefinitionTypeId: null
  notes: Notes
  traits: Traits
  preferences: Preferences
  configuration: Configuration
  lifestyle: null
  inventory: Inventory[]
  currencies: Currencies
  classes: DataClass[]
  feats: DataFeat[]
  features: any[]
  customDefenseAdjustments: any[]
  customSenses: any[]
  customSpeeds: any[]
  customProficiencies: any[]
  customActions: CustomAction[]
  characterValues: CharacterValue[]
  conditions: any[]
  deathSaves: DeathSaves
  adjustmentXp: null
  spellSlots: PactMagic[]
  pactMagic: PactMagic[]
  activeSourceCategories: number[]
  spells: Spells
  options: Options
  choices: Choices
  actions: Actions
  modifiers: Modifiers
  classSpells: ClassSpell[]
  customItems: CustomItem[]
  campaign: Campaign
  creatures: any[]
  optionalOrigins: any[]
  optionalClassFeatures: any[]
  dateModified: Date
  providedFrom: string
  canEdit: boolean
  status: number
  statusSlug: string
  campaignSetting: null
}

export interface Actions {
  race: any[]
  class: FeatElement[]
  background: null
  item: null
  feat: FeatElement[]
}

export interface FeatElement {
  componentId: number
  componentTypeId: number
  id: string
  entityTypeId: string
  limitedUse: ClassLimitedUse | null
  name: string
  description: null | string
  snippet: string
  abilityModifierStatId: null
  onMissDescription: null | string
  saveFailDescription: null | string
  saveSuccessDescription: null | string
  saveStatId: null
  fixedSaveDc: null
  attackTypeRange: null
  actionType: number
  attackSubtype: null
  dice: null
  value: null
  damageTypeId: null
  isMartialArts: boolean
  isProficient: boolean
  spellRangeType: null
  displayAsAttack: null
  range: PurpleRange
  activation: Activation
  numberOfTargets: null
  fixedToHit: null
  ammunition: null
}

export interface Activation {
  activationTime: number | null
  activationType: number | null
}

export interface ClassLimitedUse {
  name: null
  statModifierUsesId: null
  resetType: number | null
  numberUsed: number
  minNumberConsumed: number | null
  maxNumberConsumed: number
  maxUses: number
  operator: number | null
  useProficiencyBonus: boolean
  proficiencyBonusOperator: number | null
  resetDice: null
}

export interface PurpleRange {
  range: null
  longRange: null
  aoeType: null
  aoeSize: null
  hasAoeSpecialDescription: boolean
  minimumRange: null
}

export interface DataBackground {
  hasCustomBackground: boolean
  definition: BackgroundDefinition
  definitionId: null
  customBackground: CustomBackground
}

export interface CustomBackground {
  id: number
  entityTypeId: number
  name: null
  description: null
  featuresBackground: null
  characteristicsBackground: null
  featuresBackgroundDefinitionId: null
  characteristicsBackgroundDefinitionId: null
  backgroundType: null
}

export interface BackgroundDefinition {
  id: number
  entityTypeId: number
  definitionKey: string
  name: string
  description: string
  snippet: string
  shortDescription: string
  skillProficienciesDescription: string
  toolProficienciesDescription: string
  languagesDescription: string
  equipmentDescription: string
  featureName: string
  featureDescription: string
  avatarUrl: null
  largeAvatarUrl: null
  suggestedCharacteristicsDescription: string
  suggestedProficiencies: null
  suggestedLanguages: null
  organization: null
  contractsDescription: string
  spellsPreDescription: string
  spellsPostDescription: string
  personalityTraits: Bond[]
  ideals: Bond[]
  bonds: Bond[]
  flaws: Bond[]
  isHomebrew: boolean
  sources: Source[]
  spellListIds: any[]
  featList: null
}

export interface Bond {
  id: number
  description: string
  diceRoll: number
}

export interface Source {
  sourceId: number
  pageNumber: number | null
  sourceType: number
}

export interface Stat {
  id: number
  name: null
  value: number | null
}

export interface Campaign {
  id: number
  name: string
  description: string
  link: string
  publicNotes: string
  dmUserId: number
  dmUsername: string
  characters: Character[]
}

export interface Character {
  userId: number
  username: string
  characterId: number
  characterName: string
  characterUrl: string
  avatarUrl: null | string
  privacyType: number
  campaignId: null
  isAssigned: boolean
}

export interface CharacterValue {
  typeId: number
  value: number | string
  notes: null
  valueId: null | string
  valueTypeId: null | string
  contextId: null
  contextTypeId: null
}

export interface Choices {
  race: any[]
  class: ChoicesBackground[]
  background: ChoicesBackground[]
  item: null
  feat: ChoicesBackground[]
  choiceDefinitions: ChoiceDefinition[]
  definitionKeyNameMap: DefinitionKeyNameMap
}

export interface ChoicesBackground {
  componentId: number
  componentTypeId: number
  id: string
  parentChoiceId: null | string
  type: number
  subType: number | null
  optionValue: number
  label: null | string
  isOptional: boolean
  isInfinite: boolean
  defaultSubtypes: string[]
  displayOrder: null
  options: any[]
  optionIds: number[]
}

export interface ChoiceDefinition {
  id: string
  options: Option[]
}

export interface Option {
  id: number
  label: string
  description: null | string
}

export interface DefinitionKeyNameMap {}

export interface ClassSpell {
  entityTypeId: number
  characterClassId: number
  spells: Spell[]
}

export interface Spell {
  overrideSaveDc: null
  limitedUse: null
  id: number
  entityTypeId: number
  definition: SpellDefinition
  definitionId: number
  prepared: boolean
  countsAsKnownSpell: boolean
  usesSpellSlot: boolean
  castAtLevel: null
  alwaysPrepared: boolean
  restriction: null
  spellCastingAbilityId: null
  displayAsAttack: null
  additionalDescription: null
  castOnlyAsRitual: boolean
  ritualCastingType: null
  range: DefinitionRange
  activation: Activation
  baseLevelAtWill: boolean
  atWillLimitedUseLevel: null
  isSignatureSpell: null
  componentId: number
  componentTypeId: number
  spellListId: null
}

export interface SpellDefinition {
  id: number
  definitionKey: string
  name: string
  level: number
  school: string
  duration: Duration
  activation: Activation
  range: DefinitionRange
  asPartOfWeaponAttack: boolean
  description: string
  snippet: string
  concentration: boolean
  ritual: boolean
  rangeArea: null
  damageEffect: null
  components: number[]
  componentsDescription: string
  saveDcAbilityId: number | null
  healing: null
  healingDice: any[]
  tempHpDice: any[]
  attackType: number | null
  canCastAtHigherLevel: boolean
  isHomebrew: boolean
  version: null | string
  sourceId: null
  sourcePageNumber: number | null
  requiresSavingThrow: boolean
  requiresAttackRoll: boolean
  atHigherLevels: AtHigherLevels
  modifiers: RaceElement[]
  conditions: Condition[]
  tags: string[]
  castingTimeDescription: string
  scaleType: ScaleType | null
  sources: Source[]
  spellGroups: number[]
}

export interface AtHigherLevels {
  higherLevelDefinitions: HigherLevelDefinition[]
  additionalAttacks: any[]
  additionalTargets: any[]
  areaOfEffect: any[]
  duration: any[]
  creatures: any[]
  special: any[]
  points: any[]
  range: any[]
}

export interface HigherLevelDefinition {
  level: number | null
  typeId: number
  dice: Die | null
  value: number | null
  details: string
}

export interface Die {
  diceCount: number | null
  diceValue: number | null
  diceMultiplier: number | null
  fixedValue: number | null
  diceString: null | string
}

export interface Condition {
  type: number
  conditionId: number
  conditionDuration: number
  durationUnit: DurationUnit
  exception: string
}

export enum DurationUnit {
  Day = 'Day',
  Hour = 'Hour',
  Minute = 'Minute',
  Round = 'Round',
  Special = 'Special'
}

export interface Duration {
  durationInterval: number
  durationUnit: DurationUnit | null
  durationType: DurationType
}

export enum DurationType {
  Concentration = 'Concentration',
  Instantaneous = 'Instantaneous',
  Time = 'Time'
}

export interface RaceElement {
  fixedValue: number | null
  id: string
  entityId: number | null
  entityTypeId: number | null
  type: Type
  subType: string
  dice: Die | null
  restriction: null | string
  statId: null
  requiresAttunement: boolean
  duration: null
  friendlyTypeName: FriendlyTypeName
  friendlySubtypeName: string
  isGranted: boolean
  bonusTypes: any[]
  value: number | null
  availableToMulticlass: boolean | null
  modifierTypeId: number
  modifierSubTypeId: number
  componentId: number
  componentTypeId: number
  die?: Die
  count?: number
  durationUnit?: null
  usePrimaryStat?: boolean
  atHigherLevels?: AtHigherLevels
}

export enum FriendlyTypeName {
  Advantage = 'Advantage',
  Bonus = 'Bonus',
  Damage = 'Damage',
  Disadvantage = 'Disadvantage',
  Language = 'Language',
  Proficiency = 'Proficiency',
  Resistance = 'Resistance',
  Set = 'Set',
  SetBase = 'Set Base'
}

export enum Type {
  Advantage = 'advantage',
  Bonus = 'bonus',
  Damage = 'damage',
  Disadvantage = 'disadvantage',
  Language = 'language',
  Proficiency = 'proficiency',
  Resistance = 'resistance',
  Set = 'set',
  SetBase = 'set-base'
}

export interface DefinitionRange {
  origin: Origin
  rangeValue: number
  aoeType: AoeType | null
  aoeValue: number | null
}

export enum AoeType {
  Cone = 'Cone',
  Cube = 'Cube',
  Sphere = 'Sphere',
  Square = 'Square'
}

export enum Origin {
  Ranged = 'Ranged',
  Self = 'Self',
  Touch = 'Touch'
}

export enum ScaleType {
  Characterlevel = 'characterlevel',
  Spelllevel = 'spelllevel',
  Spellscale = 'spellscale'
}

export interface DataClass {
  id: number
  entityTypeId: number
  level: number
  isStartingClass: boolean
  hitDiceUsed: number
  definitionId: number
  subclassDefinitionId: null
  definition: SubclassDefinitionClass
  subclassDefinition: SubclassDefinitionClass
  classFeatures: ClassClassFeature[]
}

export interface ClassClassFeature {
  definition: ClassFeatureDefinition
  levelScale: null
}

export interface ClassFeatureDefinition {
  id: number
  definitionKey: string
  entityTypeId: number
  displayOrder: number
  name: string
  description: string
  snippet: string
  activation: null
  multiClassDescription: string
  requiredLevel: number
  isSubClassFeature: boolean
  limitedUse: LimitedUseElement[]
  hideInBuilder: boolean
  hideInSheet: boolean
  sourceId: number
  sourcePageNumber: number
  creatureRules: any[]
  levelScales: any[]
  infusionRules: any[]
  spellListIds: any[]
  classId: number
  featureType: number
  sources: Source[]
  affectedFeatureDefinitionKeys: any[]
  entityType: PurpleEntityType
  entityID: string
}

export enum PurpleEntityType {
  ClassFeature = 'class-feature'
}

export interface LimitedUseElement {
  level: null
  uses: number
}

export interface SubclassDefinitionClass {
  id: number
  definitionKey: string
  name: string
  description: string
  equipmentDescription: null | string
  parentClassId: number | null
  avatarUrl: null | string
  largeAvatarUrl: null | string
  portraitAvatarUrl: null | string
  moreDetailsUrl: string
  spellCastingAbilityId: number
  sources: Source[]
  classFeatures: DefinitionClassFeature[]
  hitDice: number
  wealthDice: Die | null
  canCastSpells: boolean
  knowsAllSpells: boolean
  spellPrepareType: number
  spellContainerName: null | string
  sourcePageNumber: number
  subclassDefinition: null
  isHomebrew: boolean
  primaryAbilities: number[] | null
  spellRules: SpellRules | null
  prerequisites: Prerequisite[] | null
}

export interface DefinitionClassFeature {
  id: number
  name: string
  prerequisite: null
  description: string
  requiredLevel: number
  displayOrder: number
}

export interface Prerequisite {
  description: string
  prerequisiteMappings: PrerequisiteMapping[]
}

export interface PrerequisiteMapping {
  id: number
  entityId: number | null
  entityTypeId: number | null
  type: string
  subType: string
  value: number | null
  friendlyTypeName: string
  friendlySubTypeName: string
}

export interface SpellRules {
  multiClassSpellSlotDivisor: number
  isRitualSpellCaster: boolean
  levelCantripsKnownMaxes: number[]
  levelSpellKnownMaxes: any[]
  levelSpellSlots: Array<number[]>
  multiClassSpellSlotRounding: number
}

export interface Configuration {
  startingEquipmentType: number
  abilityScoreType: number
  showHelpText: boolean
}

export interface Currencies {
  cp: number
  sp: number
  gp: number
  ep: number
  pp: number
}

export interface CustomAction {
  id: string
  entityTypeId: string
  name: string
  toHitBonus: null
  description: string
  snippet: string
  isProficient: boolean
  isOffhand: boolean
  statId: null
  rangeId: null
  diceCount: null
  diceType: null
  fixedValue: null
  damageTypeId: null
  onMissDescription: null
  saveFailDescription: null
  saveSuccessDescription: null
  saveStatId: null
  fixedSaveDc: null
  actionType: number
  attackSubtype: null
  range: null
  longRange: null
  aoeType: null
  aoeSize: null
  activationTime: null
  activationType: number
  isSilvered: boolean
  damageBonus: null
  isMartialArts: boolean
  spellRangeType: null
  displayAsAttack: boolean
}

export interface CustomItem {
  id: number
  name: string
  description: null | string
  weight: number
  cost: null
  quantity: number
  notes: null
}

export interface DeathSaves {
  failCount: number
  successCount: number
  isStabilized: boolean
}

export interface Decorations {
  avatarUrl: string
  frameAvatarUrl: string
  backdropAvatarUrl: string
  smallBackdropAvatarUrl: string
  largeBackdropAvatarUrl: string
  thumbnailBackdropAvatarUrl: string
  defaultBackdrop: DefaultBackdrop
  avatarId: number
  portraitDecorationKey: null
  frameAvatarDecorationKey: string
  frameAvatarId: number
  backdropAvatarDecorationKey: string
  backdropAvatarId: number
  smallBackdropAvatarDecorationKey: string
  smallBackdropAvatarId: number
  largeBackdropAvatarDecorationKey: string
  largeBackdropAvatarId: number
  thumbnailBackdropAvatarDecorationKey: string
  thumbnailBackdropAvatarId: number
  themeColor: ThemeColor
}

export interface DefaultBackdrop {
  backdropAvatarUrl: string
  smallBackdropAvatarUrl: string
  largeBackdropAvatarUrl: string
  thumbnailBackdropAvatarUrl: string
}

export interface ThemeColor {
  themeColorId: number
  themeColor: string
  backgroundColor: string
  name: string
  raceId: null
  subRaceId: null
  classId: number
  tags: string[]
  decorationKey: string
}

export interface DataFeat {
  componentTypeId: number | null
  componentId: number | null
  definition: PurpleDefinition
  definitionId: number
}

export interface PurpleDefinition {
  id: number
  entityTypeId: number
  definitionKey: string
  name: string
  description: string
  snippet: string
  activation: Activation
  sourceId: null
  sourcePageNumber: null
  creatureRules: any[]
  prerequisites: Prerequisite[]
  isHomebrew: boolean
  sources: Source[]
  spellListIds: any[]
}

export interface Inventory {
  id: number
  entityTypeId: number
  definition: InventoryDefinition
  definitionId: number
  definitionTypeId: number
  displayAsAttack: null
  quantity: number
  isAttuned: boolean
  equipped: boolean
  equippedEntityTypeId: number | null
  equippedEntityId: number | null
  chargesUsed: number
  limitedUse: InventoryLimitedUse | null
  containerEntityId: number
  containerEntityTypeId: number
  containerDefinitionKey: ContainerDefinitionKey
  currency: null
}

export enum ContainerDefinitionKey {
  The1439493548782433792 = '1439493548:782433792',
  The158111142371321377 = '1581111423:71321377'
}

export interface InventoryDefinition {
  id: number
  baseTypeId: number
  entityTypeId: number
  definitionKey: string
  canEquip: boolean
  magic: boolean
  name: string
  snippet: null | string
  weight: number
  weightMultiplier: number
  capacity: null | string
  capacityWeight: number
  type: null | string
  description: null | string
  canAttune: boolean
  attunementDescription: null | string
  rarity: Rarity | null
  isHomebrew: boolean
  version: null | string
  sourceId: null
  sourcePageNumber: null
  stackable: boolean
  bundleSize: number
  avatarUrl: null | string
  largeAvatarUrl: null | string
  filterType: null | string
  cost: number | null
  isPack: boolean
  tags: string[]
  grantedModifiers: RaceElement[]
  subType: SubType | null
  isConsumable: boolean
  weaponBehaviors: any[]
  baseItemId: number | null
  baseArmorName: null
  strengthRequirement: null
  armorClass: null
  stealthCheck: null
  damage: Die | null
  damageType: null | string
  fixedDamage: null
  properties: Property[] | null
  attackType: number | null
  categoryId: number | null
  range: number | null
  longRange: number | null
  isMonkWeapon: boolean
  levelInfusionGranted: number | null
  sources: Source[]
  armorTypeId: null
  gearTypeId: number | null
  groupedId: number | null
  canBeAddedToInventory: boolean
  isContainer: boolean
  isCustomItem: boolean
}

export interface Property {
  id: number
  name: string
  description: string
  notes: null
}

export enum Rarity {
  Common = 'Common',
  Rare = 'Rare',
  Uncommon = 'Uncommon'
}

export enum SubType {
  AdventuringGear = 'Adventuring Gear',
  ArcaneFocus = 'Arcane Focus'
}

export interface InventoryLimitedUse {
  maxUses: number
  numberUsed: number
  resetType: string
  resetTypeDescription: string
}

export interface Modifiers {
  race: RaceElement[]
  class: RaceElement[]
  background: RaceElement[]
  item: RaceElement[]
  feat: RaceElement[]
  condition: any[]
}

export interface Notes {
  allies: string
  personalPossessions: string
  otherHoldings: null
  organizations: string
  enemies: string
  backstory: string
  otherNotes: string
}

export interface Options {
  race: any[]
  class: any[]
  background: null
  item: null
  feat: OptionsFeat[]
}

export interface OptionsFeat {
  componentId: number
  componentTypeId: number
  definition: FluffyDefinition
}

export interface FluffyDefinition {
  id: number
  entityTypeId: number
  name: string
  description: string
  snippet: string
  activation: null
  sourceId: number | null
  sourcePageNumber: null
  creatureRules: any[]
  spellListIds: any[]
}

export interface PactMagic {
  level: number
  used: number
  available: number
}

export interface Preferences {
  useHomebrewContent: boolean
  progressionType: number
  encumbranceType: number
  ignoreCoinWeight: boolean
  hitPointType: number
  showUnarmedStrike: boolean
  showScaledSpells: boolean
  primarySense: number
  primaryMovement: number
  privacyType: number
  sharingType: number
  abilityScoreDisplayType: number
  enforceFeatRules: boolean
  enforceMulticlassRules: boolean
  enableOptionalClassFeatures: boolean
  enableOptionalOrigins: boolean
  enableDarkMode: boolean
  enableContainerCurrency: boolean
}

export interface Race {
  isSubRace: boolean
  baseRaceName: string
  entityRaceId: number
  entityRaceTypeId: number
  definitionKey: string
  fullName: string
  baseRaceId: number
  baseRaceTypeId: number
  description: string
  avatarUrl: null
  largeAvatarUrl: null
  portraitAvatarUrl: string
  moreDetailsUrl: string
  isHomebrew: boolean
  isLegacy: boolean
  groupIds: number[]
  type: number
  supportsSubrace: null
  subRaceShortName: string
  baseName: string
  racialTraits: RacialTrait[]
  weightSpeeds: WeightSpeeds
  featIds: any[]
  size: null
  sizeId: number
  sources: Source[]
}

export interface RacialTrait {
  definition: RacialTraitDefinition
}

export interface RacialTraitDefinition {
  id: number
  definitionKey: string
  entityTypeId: number
  displayOrder: number
  name: string
  description: string
  snippet: null | string
  hideInBuilder: boolean
  hideInSheet: boolean
  activation: null
  sourceId: number
  sourcePageNumber: number | null
  creatureRules: any[]
  spellListIds: any[]
  featureType: number
  sources: Source[]
  affectedFeatureDefinitionKeys: any[]
  isCalledOut: boolean
  entityType: FluffyEntityType
  entityID: string
  entityRaceId: number
  entityRaceTypeId: number
  displayConfiguration: DisplayConfiguration
  requiredLevel: null
}

export interface DisplayConfiguration {
  RACIALTRAIT: number
  ABILITYSCORE: number
  LANGUAGE: number
  CLASSFEATURE: number
}

export enum FluffyEntityType {
  RacialTrait = 'racial-trait'
}

export interface WeightSpeeds {
  normal: Normal
  encumbered: null
  heavilyEncumbered: null
  pushDragLift: null
  override: null
}

export interface Normal {
  walk: number
  fly: number
  burrow: number
  swim: number
  climb: number
}

export interface Spells {
  race: any[]
  class: ItemElement[]
  background: null
  item: ItemElement[]
  feat: SpellsFeat[]
}

export interface ItemElement {
  overrideSaveDc: null
  limitedUse: ClassLimitedUse | null
  id: number
  entityTypeId: number
  definition: SpellDefinition
  definitionId: number
  prepared: boolean
  countsAsKnownSpell: boolean | null
  usesSpellSlot: boolean
  castAtLevel: null
  alwaysPrepared: boolean
  restriction: null | string
  spellCastingAbilityId: null
  displayAsAttack: boolean | null
  additionalDescription: null | string
  castOnlyAsRitual: boolean
  ritualCastingType: null
  range: DefinitionRange
  activation: Activation
  baseLevelAtWill: boolean
  atWillLimitedUseLevel: null
  isSignatureSpell: null
  componentId: number
  componentTypeId: number
  spellListId: null
}

export interface SpellsFeat {
  overrideSaveDc: null
  limitedUse: ClassLimitedUse | null
  id: number
  entityTypeId: number
  definition: SpellDefinition
  definitionId: number
  prepared: boolean
  countsAsKnownSpell: boolean
  usesSpellSlot: boolean
  castAtLevel: number | null
  alwaysPrepared: boolean
  restriction: string
  spellCastingAbilityId: number
  displayAsAttack: null
  additionalDescription: null | string
  castOnlyAsRitual: boolean
  ritualCastingType: null
  range: DefinitionRange
  activation: Activation
  baseLevelAtWill: boolean
  atWillLimitedUseLevel: null
  isSignatureSpell: null
  componentId: number
  componentTypeId: number
  spellListId: null
}

export interface Traits {
  personalityTraits: string
  ideals: string
  bonds: string
  flaws: string
  appearance: string
}
