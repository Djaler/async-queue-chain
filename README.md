[![npm](https://img.shields.io/npm/v/async-queue-chain?style=for-the-badge)](https://www.npmjs.com/package/async-queue-chain)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/async-queue-chain?style=for-the-badge)](https://bundlephobia.com/result?p=async-queue-chain)

# Async Queue Chain

> A tiny utility to chain async functions in queue and run them sequentially.

## Install

```sh
npm install --save async-queue-chain
```
or
```sh
yarn add async-queue-chain
```
or
```sh
pnpm install async-queue-chain
```

## Usage

Simply create a queue with fixed number of tasks and run them sequentially.

```js
await createAsyncQueue()
    .add(async () => {
        // do something
    })
    .add(async () => {
        // do something
    })
    .run();
```

Or create a queue, then dynamically add a task from event handler and run queue.

```js
const queue = createAsyncQueue();

document.addEventListener('click', () => {
    queue.add(async () => {
        // do something
    });
    queue.run();
});
```

No matter how fast you'll add tasks, how long it will take to run a task, the queue will run them sequentially.
Also, queue will simply skip a "run" call if it's already running.

If a task returns a value, it will be passed to the next task. In such case, you'll need to provide initial value for
the first task in run method.

```js
const queue = createAsyncQueue();
for (let i = 0; i < 10; i++) {
    queue.add(async (value) => {
        // do something

        return value + 1;
    });
}
const result = await queue.run(0);
console.log(result); // 10
```
