export default class BasePlugin {
  constructor(manifest) {
    this.manifest = {
      active: manifest.active ?? true,
      id: manifest.id,
      name: manifest.name,
      version: manifest.version,
      description: manifest.description,
      author: manifest.author,
      category: manifest.category,
      icon: manifest.icon,
      showInMainMenu: manifest.showInMainMenu || false,
      development: manifest.development || false,
      language: manifest.language || null,
      minAppVersion: manifest.minAppVersion,
      dependencies: manifest.dependencies || [],
      permissions: manifest.permissions || [],
      translations: manifest.translations || {},
      system: manifest.system ?? false,
    };
  }

  onInstall() {
    console.log(`${this.manifest.name} installed successfully`);
  }

  getManifest() {
    return this.manifest;
  }

  getTranslations() {
    return this.manifest.translations;
  }

  getComponents() {
    return this.manifest.components;
  }

  getEntryComponent() {
    return this.manifest.componentsEntry;
  }

  getDependencies() {
    return this.manifest.dependencies;
  }

  getPermissions() {
    return this.manifest.permissions;
  }
}
