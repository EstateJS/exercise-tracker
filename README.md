# EstateJS

## Introduction
In a world where bespoke backend software is easily generated, Estate is here to let you write backends more efficiently, and faster than it may take you to prompt GPT to write it for you using traditional backend tooling.

Estate is a fully open-source* TypeScript transactional key-value database and no-api virtual-actor AppServer that might be all you need to write powerful, data-driven, real-time SaaS backends and efficient Line-of-Business app backends for the enterprise.

Estate is extremely simple to learn, yet lightning fast: most backend requests complete in under _200μs._ (Not including network round-trip)

Estate is self-hostable and provides a free-to-use cloud cluster.

*The framework (Tools SDK, Client runtime) is MIT licensed and the platform (rusty/modern C++ cloud-native Kuberneters cluster) is Apache-2 licensed.

## Quick Walkthrough: Exercise Tracker Demo App
This demo is an example full-stack SaaS app that allows users to track the exercises they do in a shared real-time list. The backend runs in Google Cloud (us-central) and the front-end client (React+Vite) is running in this StackBlitz sandbox.

The backend code for this demo is uncomplicated, yet staggeringly powerful. See for yourself: Check out `service\index.ts`. It's 115 lines of regular TS with zero annotations or unfamiliar keywords.

## Setup (2 minutes ⏱️)

1. Login to the default Estate cluster (aka "Sandbox")
```
$ estate login
```
This opens a new browser tab. Click "Continue as Guest" to login anonymously.

2. Initialize the backend service code directory:
```
$ cd service
$ estate init .
```
Enter `exercise-tracker` when it asks for a name.
This makes the service code directory a Service that can be deployed and connected to by clients/front-ends.

3. Deploy the backend service:
```
$ estate deploy .
```
Each time you make changes to your service backend code, you'll need to rerun this command.

4. Generate code to connect to the service in the front-end/client NPM project:
```
$ cd ..
$ estate connect . exercise-tracker
```
Select "pnpm" (press enter) when asked to update node_modules. It will only ask you to do this the first time you make a service connection.
This command must be rerun each time the backend service is deployed.

6. Start Exercise Tracker demo
```
$ npm run dev
```

## Tour the Demo / Key takeaways (8 minutes ⏱️)
1. Open the Exercise Tracker browser tab two or three times. 
   * Click "Open in new Tab" in the top-right. 
   * Right-click the new Tab and click "Duplicate" once or twice.
   * Detach the tabs and arrange the windows, so you can see all of them at the same time.
2. On any window, click "Add user" and add a user (any name will do).
3. It will ask you to create a new exercise. Fill in the fields and hit "Create Exercise Log"
   * **(Key takeaway: _Messages are SSE_)** See how the new exercise was created on all the other windows?
   * The backend worker sends the message at `service/index.ts` line 85.
   * The front-end client handles the message at `src/pages/exercises-list.tsx` line 71.
4. Close all the windows and then press `q` in the terminal to stop `npm run dev`
5. Re-run `npm run dev` to restart the client
6. Click what looks like an electric plug on the left navbar
7. Click Port 5173 to re-open a new Exercise Tracker tab
   * **(Key takeaway: _Stateful Backend, Zero JSON_)** See how the exercises still exist? They're not stored in the browser (see for yourself, check Local Storage, etc.)
   * A new `Exercise` data instance is created client-side and then passed to the worker at `src/pages/create-exercise.tsx` line 47.
   * In the service backend, the `Exercise` instance is passed to the `addExercise` method at `service/index.ts` line 76.
   * The `Exercise` data instance is saved at `service/index.ts` line 83.
8. From the list of exercises, edit an exercise and delete an exercise.
   * **(Key takeaway: _Data is Observable/Reactive_)** See how the change shows up in the other windows?

# Our Friendly Community

Please check out our GitHub https://github.com/EstateJS
(Stars would be very helpful, thanks!)

We're active on Discord! https://discord.gg/ahHffbBkNQ

# More Reading

## Technical Details
Estate is written in TypeScript and (Rust-like) modern C++ and is built like a real-time trading platform: event-drive, fully asynchronous. The front-end/client framework is written in TypeScript. The platform ("System") is a 6-workload Kubernetes deployment.

## Mental Model
With Estate you write and deploy backends called Services that contain TypeScript classes that extend three fundamental types. Which type you choose, depends on what you want to use it for.

1. Worker = API-less, stateful Micro-services
   * Workers can be thought of as Internet-addressable/callable TypeScript objects that can be shared among any number of front-ends/clients.
   * Workers are great for managing Data with business logic.

2. Data = Business domain data, what you'd normally store in a database.
   * Data objects can be thought of as a table or a spreadsheet, with each TypeScript property coinciding with a column.
   * You can pass Data objects to Workers just like any other TypeScript object. Data objects are transparently versioned and strongly consistent.

3. Message = When you want to send stuff from the backend to the front-end.
   * Real-time Messages can be thought of as a TypeScript object you can send from inside a Worker to any number of front-ends/clients.

## Feature Rundown
- Fast, stateful App Service Workers for writing data-driven business logic
- Single TypeScript Client/Server type system that just works.
- First-class TypeScript, transactional, ACID-compliant Key-Value database.
- Reactive/Observable in-built SSE: All Data is remotely observable/sharable.
- Extremely simple client-side interface: clients are auto-generated based on backend TypeScript implementation.
- Very, very small learning curve
- Plays nice with existing frontend and backend frameworks like Next.js, Nuxt, React, SolidJS, and Angular.