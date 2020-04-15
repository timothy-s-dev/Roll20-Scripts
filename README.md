# Roll20 Scripts

I set up this repository to hold any custom Roll20 scripts I have made/modified for my own games, both so that I can update them as I get the chance, and so that others can provide suggestions or pull requests when I'm too busy to do so.


## Dancing Lights

An updated/modified version of shdwjk's fantastic [Torch](https://gist.github.com/shdwjk/342cb67457936702fd8a) script, adjusted to work with the new dynamic lighting system the Roll20 team added in early 2020.  The commands have changed to reflect some of the new features, and are detailed below.

> **!add-vision** - Accepts no arguments, adds bright-light vision to selected tokens.

> **!remove-vision** - Accepts no arguments, removes bright-light vision for selected tokens.

&nbsp;

> **!add-darkvision [range]** - Accepts one argument, which specifies the range of the night vision. Adds night vision to selected tokens.

> **!remove-darkvision** - Accepts no arguments, removes night vision for selected tokens.

&nbsp;

> **!add-light [bright-radius] [dim-radius]** - Accepts two arguments, the first specifies the range bright light is cast to, and the second the range *past that* dim light is cast to. The total range of the light is the sum of the two arguments (E.G. 20ft bright and 10ft dim will reach a total of 30ft).  If dim-radius is left out, it will default to half of the bright-radius.  If bright-radius is left out, it will default to 40ft.

> **!remove-light** - Accepts no arguments, removes all lights for selected tokens.

I have not yet had a chance to implement the flickering lights from shdwjk's Torch script, but may try to do so in the future.


## Roll Initiative

A fairly straightforward script that performs d20 initiative rolls for either all valid tokens on the current page, or all valid selected tokens.  Tokens are considered "valid" for turn order if they represent a character sheet that has an initiative bonus.  The script supports optionally grouping all tokens that represent the same character sheet under a single roll.

> **!roll-initiative [group?]** - Accepts one argument, the word group; if present it groups tokens that represent the same character sheet, if the argument is left off it does not.  Automatically rolls initiative for all selected tokens.  If no tokens are selected it instead rolls initiative for all tokens on the current page.

> **!roll-initiative-all [group?]** - Uses the same argument logic as the `roll-initiative` command, but always rolls for all tokens on the current page, even if some are selected.


## Character Roster

This script is intended to be paired with [this](https://docs.google.com/spreadsheets/d/1hOzKv5cn9RUt0cxVIGB_T0ymf4IrweSiOtHzNsgVoWc/edit?usp=sharing) Google Sheets document.  To use, install ths script, create a new Character Sheet with the name "Roster" and copy paste the Full JSON value from the filled out sheet into the GM Notes for the new Character.  From there, anyone can execute the command `!roster` to show a list of categories.  Clicking any of the categories will show a list of the characters in that category, and clicking any of those characters will display their information.  All lists and info are sent as a whisper only to the individual who executed the command / clicked on the button.