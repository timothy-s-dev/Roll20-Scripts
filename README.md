# Roll20 Scripts

I set up this repository to hold any custom Roll20 scripts I have made/modified for my own games, both so that I can update them as I get the chance, and so that others can provide suggestions or pull requests when I'm too busy to do so.

## Dancing Lights

An updated/modified version of shdwjk's fantastic [Torch](https://gist.github.com/shdwjk/342cb67457936702fd8a) script, adjusted to work with the new dynamic lighting system the Roll20 team added in early 2020.  The commands have changed to reflect some of the new features, and are detailed below.

> **add-vision** - Accepts no arguments, adds bright-light vision to selected tokens.

> **remove-vision** - Accepts no arguments, removes bright-light vision for selected tokens.

&nbsp;

> **add-darkvision [range]** - Accepts one argument, which specifies the range of the night vision. Adds night vision to selected tokens.

> **remove-darkvision** - Accepts no arguments, removes night vision for selected tokens.

&nbsp;

> **add-light [bright-radius] [dim-radius]** - Accepts two arguments, the first specifies the range bright light is cast to, and the second the range *past that* dim light is cast to. The total range of the light is the sum of the two arguments (E.G. 20ft bright and 10ft dim will reach a total of 30ft).  If dim-radius is left out, it will default to half of the bright-radius.  If bright-radius is left out, it will default to 40ft.

> **remove-light** - Accepts no arguments, removes all lights for selected tokens.

I have not yet had a chance to implement the flickering lights from shdwjk's Torch script, but may try to do so in the future.