Hub.js
------
*A paradigm looking for a purpose*

This is a thought experiment, I'm not sure where I'm going with it or what it *should* do. But everything seems to be going well.

**What is it**

The idea is that all values (entities) are stored in a central object/controller `Hub()` by settting and getting. All entities have (or don't have) Getter's and Setter's that are either used for retrieving their values or processing their values when they're updated/set.

Entities my have dependents or requirements (ie they are dependents of other entities), and if their value is changed then all dependents are notified/updated accordingly.

The key paradigm is that Setter's and Getter's are independantly coded (self contained) and can be worked on in isolation. Obviously if a given entity requires other entities then they aren't strictly self contained. But they needn't be aware or even care *how* their requirements are met, only that they will be.

