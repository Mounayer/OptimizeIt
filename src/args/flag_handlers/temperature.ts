import getFlagValue from '../helpers/getFlagValue';

/**
 * Handle the temperature flag and return the temperature value.
 *
 * @param { string[] } args - The arguments passed to the CLI.
 * @param { number } tempConfig - The temperature value from the config file.
 * @returns { number } The temperature value.
 */
function handleTemperatureFlag(
  args: string[],
  tempConfig: number = 0.5,
): number {
  const tempString =
    getFlagValue(args, ['-t', '--temperature'], tempConfig.toString()) ??
    tempConfig.toString();

  let temperature = parseFloat(tempString);

  if (isNaN(temperature)) {
    console.error('Temperature value provided is invalid.');
    process.exit(1);
  }

  console.log('temperature:', temperature);
  return temperature;
}

export default handleTemperatureFlag;
