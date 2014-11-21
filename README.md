# SeasonLink


## Planning Documents

- [Initial project outline](https://projectworldwide-my.sharepoint.com/personal/ivan_mayes_goshoptology_com/_layouts/15/guestaccess.aspx?guestaccesstoken=JTidCrlfsFcX139E30kMRWNWpYEKdBc9L7ErpDoUikw%3d&docid=13127f97af8d94e879b8d41ce0d8c44c7)
- [MoSCoW-style business requirements](https://projectworldwide-my.sharepoint.com/personal/michael_may_goshoptology_com/_layouts/15/guestaccess.aspx?guestaccesstoken=qPmnraHTp790DsHl%2fLCGLMudh4V6sazbbypobyejsdI%3d&docid=1e715576595814db8aae56801fd74896a)
- [Dev planning worksheet](https://projectworldwide-my.sharepoint.com/personal/rob_marscher_goshoptology_com/_layouts/15/guestaccess.aspx?guestaccesstoken=I8fKGw4tRpVEuENy3hSZ8TH4I9jzGC%2fgkDzj%2fMeb6oY%3d&docid=10b1b81aa42e544369036a2a0697b64a3) - 
  the idea here is to map out everything that the dev team will need to do to get the app launched. Tasks should be moved
  from here to AtTask for the actual assignments.
- [Project in AtTask](https://shoptology.attask-ondemand.com/project/view?ID=54247e43004f26d12128bc0af7250379)
- [Data schema](https://projectworldwide-my.sharepoint.com/personal/ivan_mayes_goshoptology_com/_layouts/15/guestaccess.aspx?guestaccesstoken=XJx3jMRFNU%2fQb%2fpr%2b%2fshpBkwkMl7vI7YYyEt3mtWI90%3d&docid=1ca02af5db3d24d6a964fee22eb86e7fe) -
  this could probably be moved into a markdown doc in the repo here.


## Design / Wireframes

Omnigraffle wireframes for the app and cms are in the design folder.

## API

The API is documented using Swagger 2.0. `/api/public/swagger-api.yaml` is the
working doc. `/api/public/api.json` is the generated JSON version (would love to
find a CLI tool to do this, did the current one via Swagger editor). Swagger 2.0 is
still a bit buggy in both the Swagger UI and Swagger Editor... but under active
development so hopefull the kinks will be resolved soon.

Our API uses a separate express instance from the CMS presentation layer (based on
Mongorilla) and the front-end web and native app views. However, they will all
always be consistently deployed via this repository, so it could be possible
to have shared files that are used by multiple projects.

## Data Flow

We should create some type of event queue that can effectively source control our
documents. A log of which user made a change, what time, and what was changed.
We can log our API calls that modify data with their responses and put them into
a queryable database. To be complete though, we would need to leverage our api
for all data changes - and alter or swap out mongorilla. Maybe a more longer
term goal.

With the api requests, there is theauth overhead to consider. We could have a
key/value cache by access token that contains user object for /me responses.

```
save api request ->

    actor,action,target,object
    retrieve existing user object for log? or not necessary? can replay from log. maybe during certain points of inactivity, an entire object would be saved to the log, so if replaying state afterwards, can start from there.

    record request
    transform/validate request
    record validated/transformed request
        > actions picked up and performed:
            save to system of record (mongodb)
            save to caches (this becomes less realistic in large systems, because one small write wouldn't warrant a huge number of fanout cache updates)
            send to worker queue (if applicable)

    prepare response
    send response
```

## Measurement

We're going to need to have a measurement system in place for watching performance and seeing effects of updates.

Recommend Google Analytics and Snowplow Analytics -- would be fun to try using snowplow for everything custom.

## Schema

All models have the auto-assigned MongoDB _id as their primary key.

### Users
- firstName
- lastName
- email <-- we should require double opt-in confirmation
- password
- accounts (array of connected accounts)
    ```
        [
            { type: 'facebook', id: '123123123123'}
        ]
    ```
- devices (array of mobile platform concatenated with device IDs). i.e. `'ios_A4D23C754', 'android_A4D23C754'`
- roles (array of role names - most roles will have a particular school or team included)
    - `'scoreReporter_[school id]_[team id]'`: can report a score for a team
    - `'coach_[school id]_[team id]'`: can manage assigned team
    - `'manage_[school id]'`: can manage school settings and all teams
    - `'manageUsers_[school id]'`: can add/edit admin and coach logins
    - `'manage'`: can manage all schools
    - `'admin'`: can manage all logins, add schools to the system
    - `'adminAds'`: can manage ads
- createdTime
- lastVisitTime
- birthday ??
- followedTeams (array of team ids you follow as a fan / non-member)
- preferences (tbd - should this be in the user document or as separate documents in it's own collection?
    is it better for this to be an array or an object with the scope as the keys?)
    ```
        [
            { scope: 'global', group: player, email: true, push: true, sms: false },
            { scope: 'school_12345', school: 12345, group: player, email: true, push: false, sms: false },
            { scope: 'team_123', school: 12345, group: player, email: true, push: true, sms: false },
            { scope: 'team_124', school: 12345, group: fan, email: true, push: false, sms: false }
        ]
    ```

^^^ Need to test we can query this the way we want. What are the queries we want to be able to do?

Confirmed fine with this schema:
- lookup by email
- lookup by device id 

Need testing
- lookup by facebook id:
    - `db.users.findOne({'accounts.type': 'facebook', 'accounts.id: '123123123123'})
    - Not sure the above will work. It may match someone who has a facebook account,
        but the id matches their twitter account. Need to test.
    - Alternative will be to use an object with a key that concats the account type and id:
        - `accounts: { facebook_123123123123: { added: ISODate('2014-10-28T14:23:15Z') } }
    - But with this, it becomes much more difficult to find the number of people that have
        connected a facebook account unless we have another field called accountTypes
        that could be like `accountTypes: [ 'facebook', 'twitter' ]`
- find users to send notification to about upcoming practice:
    - `db.users.findOne({'preferences.scope': 'team_123', 'preferences.group': {$ne: 'fan' });`
    - again, same question as with facebook id
- find users that are a player for the school

### School
- fullName
- shortName
- initials
- city
- state
- zip
- division
- mascot
- logoColorDark
- logoColorLight
- storeLink

### Team
- schoolId
- sport
- season
- level (varsity, jv, freshman)
- gender
- mascot (if different from school's)

### Players (Roster)

- firstName
- lastName
- fullName
- teamId
- userId <-- mechanism should exist to find by email
- number
- positions
- stats (@todo yunderstand different stats)
- dateAdded
- dateModified

### Events

- name
- schoolId
- teamId
- type - game, practice, others (define own types)
- description
- date
- startTime (empty for all-day events)
- endTime (optional)
- calendar
- rescheduled (Boolean)
- dateAdded
- homeTeam
- locationId
- opponentTeamIds
- score
- stats

^^^ So is the idea we would have multiple documents for the same match? We need a way to deduplicate then. Seems we should have a single document.

- name
- schoolIds
- teamIds
- homeSchoolId
- homeTeamId
- type - game, practice, others (define own types)
- description -- maybe we have a separate document collection for teams to write internal notes
- date
- startTime (empty for all-day events)
- endTime (optional)
- calendar
- rescheduled (Boolean)
- dateAdded
- locationId
- opponentTeamIds
- score
- stats

### Locations

- name
- address1
- address2
- city
- state
- zip
- latitude
- longitude
- schoolId (optional)
- homeTeams (array of ids)


### Messages

- type (RM: what are the types?)
- eventId (empty for not event associated)
- schoolId (empty for all following event)
- teamIds (empty for school-wide)
- creator (user id or null if system generated)
- source (tbd)
- content
- channels (email, push, sms, social, etc)
- channelContent (might be necessary to modify content for channel)
- publishTime - can set in the future to avoid publishing
- expireTime - can set to automatically remove
- status - unpublished, published, expired, deleted

Inappropriate (This phase?)

