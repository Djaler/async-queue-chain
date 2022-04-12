type ChainTask<T> = (previousResult: T) => Promise<T>;

export function createAsyncQueue<T>() {
    const queue: Array<ChainTask<T>> = [];

    let queuePromise: Promise<T> | null = null;

    return {
        add(...tasks: Array<ChainTask<T>>) {
            queue.push(...tasks);
            return this;
        },
        async run(input: T) {
            if (queuePromise) {
                return queuePromise;
            }

            let resolvePromise: (value: T) => void;
            let rejectPromise: (reason?: any) => void;
            queuePromise = new Promise<T>((resolve, reject) => {
                resolvePromise = resolve;
                rejectPromise = reject;
            });

            let currentValue = input;

            try {
                while (queue.length > 0) {
                    const task = queue.shift()!;

                    // eslint-disable-next-line no-await-in-loop
                    currentValue = await task(currentValue);
                }
                resolvePromise!(currentValue);

                return currentValue;
            } catch (e) {
                rejectPromise!(e);
                throw e;
            } finally {
                queuePromise = null;
            }
        },
    };
}
