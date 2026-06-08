---
title: What is cortexerr
description: Explanation of what cortexerr does
---
Give the arr stack a lobotomy. Cortexerr is a (very early alpha) brain replacement for Sonarr / Radarr's ranking and selection logic.
A highly opinionated ranking algorithm for people who want deterministic, aggressive, goal-oriented selections. When good enough is not enough.

Cortexerr acts as a middleman between Sonarr/Radarr and your indexers/download clients. When the arrs search for content, they hit Cortexerr's indexer 
which feeds back generated data that satisfies the arr's while encoding the real request into a torrent blob. That blob gets handed to Cortexerr's
downloader, which does the actual work. Full control, full bypass of the arr's ranking.

## Who is this for

This is for someone who is not satisfied with the non absolute nature of sonarr's and radarr's decision engine. It's aim is to both give complete control
to the user via a highly set of configurable options, stats and data tracking, and most importantly a decision engine that can fully use all of the data it has
to influence how the decisions get made resulting in very conditional and human like choices much like one meticulously building a collection would make.

When quality and specific desired attributes are something you don't just want a good enough selection for but to know exactly that the selection it made was
the best possible given your provided (indexers quality, custom config options, and or even unforeseen network issues). What this means is you will know exactly
why a release got picked if it was because of bad indexer data, config not aligning with what you want and or a fluke error you will know.

Core to its design is a fail fast model of trying potential downloads, exhaustive retries starting with highest ranked releases and working its way down, and
large indexer datasets to ensure every possible option gets compared ensuring the best quality always gets found.

## The tradeoffs

This is not for everyone. Cortexerr directly replaces Sonarr/Radarr's decision logic meaning profiles, custom formats, and anything else ranking-related will 
not apply. All indexers and downloaders must go through Cortexerr. Mixing Cortexerr-managed and non-Cortexerr clients will break things.

Why the tight scope? Cortexerr is designed around a fail fast approach and downloads that are inconsistent like p2p torrent based connections make this 
extremely tricky at least for now. 

Limiting the Indexers and Downloaders helps massively reduce the scope and helps shift more of the development efforts stability and reducing bugs as well as
bigger features. The choice of the supported indexers / downloaders was not taken lightly many options were tested with the goal of picking ones that provide
the widest support of features important to the goal of cortexerr.

- Supported Indexers
    - NZBHydra2
    - Jackett

- Supported Downloaders
    - Sabnzbd
    - RdtClient

Limited or unsupported features
- Interactive Search (not planned)
- RSS Sync (planned feature)

As to its fail fast approach its exhaustive meaning even though it will move fast though bad releases if there are more bad releases than good it can take 
awhile there are config options to help fine-tune this but its always a trade off of availability vs quality, by default its focus is quality at the cost of 
time and is expected be set and forget not something likely to be used as a instant release finder but an exhaustive best quality finder.

## How does it work

Cortexer works by acting as both an torznab indexer and a qbittorrent downloader. What this simply means is cortexerr is a middleman between the real supported
downloader / indexer clients and sonarr / radarr. 

### Request + Indexer Response
Cortexer will wait for a request from either or arr service, the receiving a request will go to cortexerrs indexer which responds with a generated torznab response
only to satisfy the arrs into accepting the request, part of this torznab response includes a download link which is also part of cortexerrs indexer this link
will generate a torrent blob that meets the bare minimum required information for the arrs to accept it as well as a bunch of extra encoded information for what
was requested.

### Processing the request
The arrs will send the torrent blob over to cortexerrs downloader which then only decodes the known fields that were stuffed into the torrent blob. At this stage
cortexerr adds this request to its internal ingest state, this state is then accessed from the arrs when checking on the status of download via an endpoint it
polls about every minute. Once the first valid read of this state is done on the arrs the item is now a valid item in the arr what they call the queue (seperate)
from cortexerrs own queue, this now fully allows cortexerr to fully be independent and do whatever logic it needs to do only ever needing to update its ingest for
the arrs to know the current state.

### Scheduling
Now both the arrs and cortexers internal state have the request tracked in there own internal systems. Cortexerr adds the request to it scheduler and it waits
to add to the internal queue of 2 active processing requests by default. Once its added to this queue state it starts processing the request.

### Sequencer
The request is not in the sequencer which processes the indexer searches, decision logic (matching, filtering, sorting) and downloaders. The request will wait
in here until it successfully downloads a requested item, upon a sucessful download the files get moved to a temporary location and the file locations along with
the completed status get marked in the ingest which then allows the arrs upon their next check to finish importing and finishing the request.
