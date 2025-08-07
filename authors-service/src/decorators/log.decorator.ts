export function LogExecution() {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      console.log(`--> Entering ${String(propertyKey)} with args:`, args);

      const start = Date.now();
      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - start;
        console.log(
          `<-- Exiting ${String(propertyKey)}; Execution time: ${duration} ms`
        );
        return result;
      } catch (err) {
        console.error(`@@ Exception in ${String(propertyKey)}:`, err);
        throw err;
      }
    };

    return descriptor;
  };
}
