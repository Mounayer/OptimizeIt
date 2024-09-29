import { parse, TomlPrimitive } from 'smol-toml'; // you can import stringify from 'smol-toml' as well if you want to stringify TOML objects

/**
 * Function to parse the TOML file.
 * @param config - The TOML configuration.
 * @returns The parsed TOML configuration.
 */
function tomlParser(config: string): Record<string, TomlPrimitive> {
  try {
    const parsedConfig = parse(config);
    return parsedConfig;
  } catch (err: any) {
    const message = err.message.split('\n')[0];
    console.error(`${message}`);
    process.exit(1);
  }
}

export default tomlParser;
