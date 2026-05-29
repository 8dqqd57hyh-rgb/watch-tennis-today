# Homepage empty player card fix

- Filters homepage cards using the same player extraction that the card renderer uses.
- Removes matches where either side has no displayable player name.
- Falls back to cleaned raw player names only when they are real names.
- Stops rendering blank player sections with only `VS` visible.
- Uses stable keys for player links in match cards.
