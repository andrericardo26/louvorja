import BasePlugin from "../BasePlugin";
import es from "./lang/es.json";
import pt from "./lang/pt.json";
import manifest from "./manifest.json";

export default class extends BasePlugin {
  constructor() {
    // Load translations
    manifest.translations = { pt, es };

    // Load manifest
    super(manifest);
  }

  onInstall() {
    console.log(`${this.manifest.name} installed successfully`);
  }
}
