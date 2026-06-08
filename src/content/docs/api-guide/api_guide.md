---
title: Api Guide
description: Explanation of how the api works
---
Understanding and writing custom code for cortexerr. A basic understanding of c# is recommended or programming in general.

## Architecture
Key aspects to understand, cortexerr itself is split into 4 parts:
- App (The cortexerr framework & webservers & consumer)
- libraries
    - Core (The most primitive dependencies as unopinionated as reasonably possible)
    - Extended (Based of Core extends primitive methods into more opinionated featurefull versions)
    - Decisions (Based on Core & Extended, contains all decision level logic)

Custom plugins should be compiled as dlls placed & loaded via the `api_path` config option as well as the `api_mode` option must be set.
the 3 libraries never should be included as a dll however all and any external libraries must be included.

When building a plugin It's recommended to use at least the core library for better interoperability between the Cortexerr App. 
Actually hooking into the api is split into 2 different ways the hook type you use must match the `api_mode` option in the config.

## Full Bypass Mode
This mode fully replaces all of the decision logic and leaves a full blank slate, the plugin is fully having to rebuild a very big chunk of cortexerr.

Implementing the `IIngestConsumer` interface `RequestHandler` method will give you the entire hook to any request.

## Extension Mode
This mode is extremely flexible it exposes a hook via `DecisionLogic` a class containing only virtual methods which you must extend. All the methods in this
class correspond to all of the methods within the Decision/Logic folder. What this allows you to do is extend any of "matching/filtering/sorting", disable any,
or use the methods as a hook passing in the original decision logic method and add behavior around it.

