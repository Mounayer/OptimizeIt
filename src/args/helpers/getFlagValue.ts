/**
 * A utility function to handle CLI flags that take a value.
 *
 * @param { string[] } args - The arguments passed to the CLI
 * @param { string[] } flagVariants - The flag variants (e.g., ['-a', '--api-key'])
 * @param { string | null } defaultValue - The default value to return if no flag is provided
 * @returns { string | null } The value of the flag if given, otherwise the default value
 */
function getFlagValue(
  args: string[],
  flagVariants: string[],
  defaultValue: string | null,
): string | null {
  const flagIndex = args.findIndex((arg) => flagVariants.includes(arg));

  if (flagIndex !== -1 && flagIndex + 1 < args.length) {
    return args[flagIndex + 1][0] !== '-' ? args[flagIndex + 1] : defaultValue;
  }

  return defaultValue;
}

export default getFlagValue;
