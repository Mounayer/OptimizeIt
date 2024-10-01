/**
 * Handle the temperature flag and return the temperature value
 *
 * @param { string[] } args - The arguments passed to the CLI.
 * @param { number } tempConfig - The temperature value from the config file.
 * @returns { number } The temperature value.
 */
function handleTemperatureFlag(
  args: string[],
  tempConfig: number = 0.5,
): number {
  let temperature = tempConfig;

  const temperatureFlagIndex = args.findIndex(
    (arg) => arg === '-t' || arg === '--temperature',
  );

  if (temperatureFlagIndex !== -1 && temperatureFlagIndex + 1 < args.length) {
    temperature =
      args[temperatureFlagIndex + 1][0] !== '-'
        ? parseFloat(args[temperatureFlagIndex + 1])
        : temperature;

    if (isNaN(temperature)) {
      console.error('Temperature value provided is invalid.');
      process.exit(1);
    }
  }
  console.log('temperature:', temperature);
  return temperature;
}

export default handleTemperatureFlag;
