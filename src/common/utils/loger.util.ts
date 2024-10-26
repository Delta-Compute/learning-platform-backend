export function logError(...args: any[]) {
  try {
    console.error(
      JSON.stringify({
        time: new Date().toISOString(),
        message: "Expected error",
        metadata: args,
      }),
    );
  } catch (e) {}
}
