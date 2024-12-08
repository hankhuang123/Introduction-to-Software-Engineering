# <span style="color:#ADD8E6">Creating your First React Native App</span>

<div align="right"> </div>

## <span style="color:#ADD8E6">Table of Contents </span> 
  - [Description](#desc)
  - [Prerequisites](#pre)
  - [Designing the App](#design)
    - [`Counter.js`](#counter)
    - [`AddCounterForm.js`](#add)
    - [`App.js`](#app)
  - [Task](#task)


<a id="desc"></a>
### <span style="color:#ADD8E6"> Description </span> 

In this lab, you will learn how to build a simple React Native application and you will recreate a version of your own.

React Native is a framework for building native apps for IOS/Android using JavaScript.

There are two ways of building a React Native app: Expo CLI and React Native CLI.
We will be using Expo CLI for simplicity and ease of use.

Please refer to React Native documentation for its Core Components and APIs: https://reactnative.dev/docs/components-and-apis

If there are any issues or inaccuracies, please contribute by raising issues, making pull requests, or asking on Piazza. Thanks!

<a id="pre"></a>
### <span style="color:#ADD8E6"> Prerequisites </span> 
1. Make sure you have Node.js installed.
You can install from the official website: https://nodejs.org/en/download/
2. An IDE. We will use VS Code.
3. Expo Go installed on your mobile device. Available both on IOS and Android: https://expo.dev/client

<a id="step1"></a>
### <span style="color:#ADD8E6">Step 1: Setting up the new app </span> 
Open a terminal in VS Code and install Expo CLI with the following command:
```shell
npm install -g expo-cli
```

Now, create a new expo project
```shell
npx create-expo-app CounterApp
cd CounterApp
```
Replace CounterApp with your own app name.

Once complete, run the following command to start the server:
```shell
npm start
```
</p>
In case you face a loading problem, run the following commands:

```shell
npm install -g expo-cli
expo-cli start --tunnel
```
which globally installs the expo client in our application.


Note: UofT network blocks the live-previewing on ExpoGo.
To test on the web, please run the following commands:

```shell
npx expo install react-dom react-native-web @expo/webpack-config
npx expo start --web
```
<a id="task"></a>
### <span style="color:#ADD8E6"> Your Task </span> 
- Check the lab handout instructions on Quercus.
- You are required to create a similar app, a To-Do List application.
- There are two components `ToDoList.js` and `AddTask.js`
- You are given the styles, so you don't have to implement them.
- All instructions are in the handout, and it should be very similar to this demo.
- Refer to https://reactnative.dev/docs/components-and-apis on how to use the React Native components and props they take.