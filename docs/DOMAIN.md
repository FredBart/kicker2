# domain

# Player
- name: String
- teams: String[]
- matches: Guid[]
- (functions to add and remove matches and teams)

# Team
- name: String
- players: String[]
- matches: Guid[]
- (functions to add and remove matches and players)

# Match
- id: Guid
- team1: String
- team2: String
- goals1: Int
- goals2: Int
- (functions to return winner, goals and general result)