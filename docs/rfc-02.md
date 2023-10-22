# CheckRoute implementation details

To detect if a route is valid. They'll be added progressively to a state object. That said, a first route is always valid. Then the subsequent routes only will be added after it passes a validation. 

The validation consists of: 
1- Calculating the fastest route. 
2- Checking if in all future `ticks` until it reaches the destination this particular `ActiveTrain`

## StationMap
A tree-node interface to loop through and find the shortest routes.

## ActiveTrain
Consists of the combination of train + route. It has the ability to find the shortest Path if given a `StationMap`.

## InterlockCoordinator
This represents a projection of allowed routes for a specific `StationMap`. This class holds all current `ActiveTrain` and verifies if a new one can be added.
