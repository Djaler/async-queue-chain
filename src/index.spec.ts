import { createPromiseMock } from 'simple-promise-mock';
import { expect, it, SpyInstanceFn, vitest } from 'vitest';

import { createAsyncQueue } from './index';

type VitestFn<T> = T extends ((...args: infer A) => infer R) ? SpyInstanceFn<A, R> : never;

type Task = (value: number) => Promise<number>;

it('should return tasks queue result', async () => {
    const first = (input: number) => Promise.resolve(input + 1);
    const second = (input: number) => Promise.resolve(input + 2);
    const third = (input: number) => Promise.resolve(input + 3);
    const queue = createAsyncQueue<number>();
    queue.add(first, second, third);

    const result = await queue.run(0);

    expect(result).toBe(6);
});

it('should work when tasks added to running queue', async () => {
    const first = vitest.fn();
    const firstPromise = createPromiseMock();
    first.mockReturnValueOnce(firstPromise);
    const second = (input: number) => Promise.resolve(input + 2);
    const queue = createAsyncQueue<number>();
    queue.add(first);

    const queuePromise = queue.run(0);
    queue.add(second);
    firstPromise.resolve(1);
    const result = await queuePromise;

    expect(result).toBe(3);
});

it('should remove tasks from queue', async () => {
    const first = vitest.fn();
    const second = vitest.fn();
    const queue = createAsyncQueue();
    queue.add(first, second);

    await queue.run(0);
    await queue.run(1);

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
});

it('should run tasks sequentially', async () => {
    const first = vitest.fn();
    const second = vitest.fn();
    const queue = createAsyncQueue();
    queue.add(first, second);

    await queue.run(0);

    expect(first.mock.invocationCallOrder[0]).toBeLessThan(second.mock.invocationCallOrder[0]);
});

it('should not run already running queue', () => {
    const first: VitestFn<Task> = vitest.fn();
    first.mockReturnValueOnce(createPromiseMock());
    const second: VitestFn<Task> = vitest.fn();
    const queue = createAsyncQueue<number>();
    queue.add(first, second);

    void queue.run(0);
    void queue.run(1);

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(0);
});
