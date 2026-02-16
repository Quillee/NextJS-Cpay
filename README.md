## CPay App

This is the starter template from the Next.js App Router Course. It contains the starting code for the dashboard application modified for our take home exercise purposes.

## Overview

The P2P payment market is booming, with projections estimating it will surpass $5.2 trillion by 2028. 
As more consumers and businesses adopt these technologies, being a part of this space positions you at the forefront of financial innovation and growth. 
This is your chance to contribute to a sector that is reshaping how money is transferred and managed.

The goal of this assessment is to generate sample data and persist it in memory. Then create functionality using that data to query and mutate.

## Schema

See the schemas in `./lib/definitions.ts` as well as the data in `lib/data.ts`. Part of the exercise is to define a schema that encompasses p2p transactions in a concise and scalable way.

A majority of the UI has already been implemented, but there is room for addition depending on the models you implement.

```
interface Contact {
  id: number;
  name: string
  email: string
  image_url: string;
}

interface Pay {
  id: string;
  amount: number;
  // TODO: fill in 
}
```

# Required operations

1. Pays have been partially defined. Add fields you would feel relevant for querying purposes. Think of pays similar to any p2p you are familiar with. 
2. Generate random pays to and from the pre-populated contacts for the months of a single year. 
3. Incorporate into routes and pre-made UIs by building out the queries in memory.
4. Set up create and edit/action pay. (Remember, the UI will need updating per your `pay` model)
5. Commit and share! Feel free to leave notes in your thought process.

## Bonus operations

- Filtering UI
- Group pay UI

### Hints

Boot up the app. Navigate to the dashboard. Most of these cards will show empty data. 
After you generate your data, fill these in. Replace `Recent Activity` with your data.

Click to the other routes. 

`Pays` will have a table that should have more columns. `Create Pay` will probably require more fields.

`Contacts` will use the contacts we've provided but the aggregation of data you've created. 

There are `TODO`s. Try to get to them all.

## Requirements

- Node version - v18.18.0 or higher for this version of Next.js

# Candidate README
## Bootstrap instructions

You will have to generate pays and activity. This can be done with the commands:

`pnpm generate:pays`
`pnpm generate:activity`

Copy the activity.json contents under the /script folder into placeholder-data.ts

You can then use pnpm to run the dev server


`pnpm dev`

## Design considerations

- Wallets
- Amount
- Potential enhancements
- Miscellaneous

## Thoughts

## Pay Table

## Create Pays
- There had to be some persistance, so I simply used a json file. You can regenerate it by running generate commands [see more here](#bootstrap-instructions)
    - TODO: Right now activity has to be re-run manually for it to be accurate, but that's lower priority then completing the project
- added edit pay functionality and delete pay functionality
    - edit is only available if the pay is still pending

## Filtering
I ran into a problem where I couldn't get the query to update. The searchbar would update, but my console.log's wouldn't be called, so that was weird
I ran out of time, so unfortunately, I'll leave the project as is. 

I added support for a generic filtering system using the query params
The parseQuery function takes the full list of params and splits them by &. then associates them by name to the fields in either Contact or Pay. Its a bit of a generic approach, so a little less readable, but a little clever.
This parseQuery function generates an object that can be used to filter Pays or Contacts. I separated these two into separate functions since the generic approach felt like a bit much.
This would've supported a filter system where you can specify extactly which fields you want to filter with better type safety using dropdowns and sliders.

## Data generation

### Pays
generating Pays isn't too hard. I did have to copy over the type, so changes won't be synced

### Activity
Not sure what activity means.. the example had large numbers, so I'll just add the amounts of the Pay together

## What I would've wanted to do
A Wallet that you could add (arbitrary for this example) money too
Filtering system for Pays table
Request table where you could see who has requested money from you and accept or deny


