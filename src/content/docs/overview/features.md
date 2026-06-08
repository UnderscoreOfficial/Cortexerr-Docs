---
title: Features
description: Currently supported features
---

## Matching
All items get matched from the indexer search release name. All attributes are matched via regex except "Release Name" uses
a combination of regex and multiple fuzzy scores. Matching only builds this data set and does not do anything with it.

- Video / Audio Codec
- Dolby Vision / High Dynamic Range
- Language
- Release Group
- Release Name
- Resolution
- RipType
- Series (seasons/episodes)

## Filtering
Uses matched data and config options to remove results before sorting.

- Request (Release Names and Series that do not match requested item)
- Dolby Vision / High Dynamic Range
- RipType
- Resolution
- Size
- Keyword (custom optional filters can be anything)

## Sorting
Note: Sorting is still in very early stages and might go though intensive rewrites all things considered though even in its current basic state it has proven
to work surprisingly well.

Sorting follows a somewhat layered approach the design is around bitrate in relation to a balance of file size, however many config options can drastically 
change this, weighting user preferred attributes over what the default targets as bitrate. How this works in practice is sorting starts with higher weighted targets
such as a normalized file size and riptype it only uses smaller tie breaker deciders such as hdr/dv/etc if there is not a clear winner within a size range.

All sizes are normalized to encode quality the default weight of of 1 and \*2.0 (H265), \*2.3 (AV1)

Part of the TieBreaker logic is defining a range of when tiebreaker cases happen this is a range of file size applied as a logarithmic range multiplier on 1 side
only triggering the TieBreaker logic if its within the range of the multiplier.

normalized = (log(size) - log(min_size)) / (log(max_size) - log(min_size))
multiplier = min(normalized ^ power + 1, 1.5)

Ordered highest to lowest in order of weighted non tiebreaker value:
- Normalized Size
- RipType

Ordered highest to lowest in order of weighted tiebreaker value:
- RipType
- Date (newer releases better (note: this is very early and might only be used for usenet its not 100% decided on if it will stay ranked this high))
- Release Group
- High Dynamic Range
- Dolby Vision
- Audio Codec
- Resolution
- Normalized Size (this is the final fall back prefer bigger size or they are tied)

## Scheduler
This is where request go by default it does 2 things it stores all total requests and then queues by default 2 to run at a time this is to ensure not over 
saturating a networks bandwidth and to ensure the requested items don't overly drag on. All items are added to the queue on a first come first serve basis

## Sequence
Contains the control flow for how active working in queue requests run here is an example loop of processes

- Indexer searching & merging
- Matching
- Filtering
- Sorting
- Download Loop (goes though sorted results until successful download)
- Moving files to expected paths
- Updates state so arrs can now see job is finished

The only difference on these is with series it takes this sequence loop and adds another loop around the indexer stage this is because series
can target specific episodes when this is done it has to preform separate indexer searches per each episode and doing them all at once would be slow and 
potentially wasteful so it just loops back on the sequence and only finishes when all the expected episodes are found but again this is only in the specific 
case of a series thats targeting episodes such example would be predominately seen in usenet sonarr release requests.

## Indexer
This is what actually talks back to the real supported indexer clients (NzbHydra2 / Jackett). However it does quite a bit more it handels the optional config 
extra searches you can add as well as merging and normalizing the data results across both newznab and torznab to allow easier eventual matching, filtering, 
and sorting.

## Downloader
This talks directly to the real supported download clients (Sabnzbd / RdtClient). This is also the stage that controls the download retry loop per a specific
requested item. How this works is it uses the sorted data from the Indexer and goes though this data until a successful download starting at the highest
quality top ranked release and working its way down, what this ends up ensuring is an absolute probability of the highest quality download that was available
without hanging on error states but dropping them and moving on to the next option.

## What works today?
- Usenet (sonarr) works very good and is the most stable alpha feature currently with really only 1 major bug relating to some failed downloads not being removed
- Usenet (radarr) similar to sonarr but has some much bigger problems with auto importing issues along with the same potential stale failed downloads backing up

## Disabled / Unsupported core features

Currently disabled
- Language sorting/filtering/matching
- Various few config options
- Rdtclient (extremely more complicated so usenet only works right now requires much more sorting normalization for series specifically long story short usenet
    can just use episodes and its the best option on usenet rdtclient torrents goes Season packs, series packs, and then episodes are rare meaning I need to 
    accurately normalize size values across if its a episode, series or season pack correctly since the system is so dependant on size a 60Gb season pack without
    knowing its a season pack would look vastly better if were say comparing it so like a 8gb episode its just complicated.

    Rdtclient also introduces splits into generally how extra systems work and other options that need to be accounted for which further delays why its not working
    just yet. This includes thing such as systems for how to auto switch between usenet and torrent both retry / download failure count based and or the type of
    error, generally the system will be designed around preferring usenet if configured with it by default tho like nearlly everything can be changed to prefer
    rdtclient but also adds complexity to it not being supported yet.
    )
- stat tracking is a huge one and probably even bigger than rdtclient support tho its equally not implemented yet tho it will be exhaustive
