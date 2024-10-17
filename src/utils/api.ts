const defaultErrorFallback = async (response: Response) => {
  const errorText = await response.text();
  return `${response.status}, ${errorText}`;
};

export const validateResponse = async (
  response: Response,
  errorFallback:
    | string
    | ((res: Response) => string | Promise<string>) = defaultErrorFallback,
): Promise<void> => {
  if (response.ok) return;

  const errorText =
    typeof errorFallback === "function"
      ? await errorFallback(response)
      : errorFallback;

  throw new Error(errorText);
};
