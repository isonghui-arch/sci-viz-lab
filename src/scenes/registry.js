// 场景注册表：所有场景在此注册
// 场景接口：{ id, name, icon?, init(container), update(params), dispose(), getDefaultParams() }
const sceneRegistry = new Map();

export function registerScene(config) {
  sceneRegistry.set(config.id, config);
}

export function getScene(id) {
  return sceneRegistry.get(id);
}

export function getAllScenes() {
  return [...sceneRegistry.values()];
}

export { sceneRegistry };
