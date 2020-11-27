## This is not mine.
See the original [on gitlab](https://gitlab.com/sfpublic/conlangjugator)

The Conlangjugator
==================

The Conlangjugator is an all-purpose tool designed to aid conlanging.

## Usage

[Run it on your browser](https://liquidponiard.github.io/conlangjugator)

So far tested only with FF 63, but it should work with any modern browser.

## Use cases

The main use cases of the program are:

* **Word generation** - a broad pattern of word shapes can be generated randomly, with phonotactics applied in the process. Relative frequencies of phonemes are also configurable.
* **Applying sound changes** to word lists - the bog standard feature present in every SCA, but also there's support for reduplication, metathesis, irregular sound changes among other things.
* **Applying inflection templates** to words - that means entirely custom inflections are configurable, which then can be applied to each and every word in a wordlist.
* **Inspecting how inflections change over time** after predefined sound changes - same as above, but before final output, a list of soundchanges is applied to every wordform, adding for the possibility to study how morphology changes over time.

The Conlangjugator uses syntax that is very similar to the one used for writing sound changes in linguistics, allowing for quick learning.

## Documentation

Sound changes are entered and run in the *Commands & Output* tab. This is also where their result is shown.

### Segments

Instead of plain characters, the program works with segments. A segment is one or more characters and represents an indivisable unit.  
What this means in practice is that if you want to use digraphs or combining diacritics, you have to define them as segments. Characters that are not parts of either don't need to be defined as segments, but often implicitly are.  
Note that the orthography has to be unambiguously segmentable. If, for example, `<ng>` is `/ŋ/` and `<gh>` is `/ɣ/` and `<ngh>` can be either `/ŋh/` or `/nɣ/`, sound changes including either or both won't be executed correctly.

### Groups

For purpose of generalising sound changes, segments can be placed in groups. Note that everything put in a group is turned into a segment, even if it's a single character.
Groups (group names) always have to contain capital letters only. Otherwise, correct function is not guaranteed.  
Every capital letter in a sound change is assumed to be a group or a part of a group name. Capital letters in input words are temporarily converted to lower case during execution.  
The program doesn't support features (such as `[+front]` or `[-voice]`), although feature-oriented sound changes can be achieved using groups.

### Commands

A command is a basic unit that can be run by the program. It consists of sound changes, directives and comments on seperate lines.

### Sound changes

They consist of the following parts, those optional are in brackets:

`(source) > (result) (#order) (/condition) (/direction)`

Note that the greater than symbol - `>` - is used, and _not_ a right pointing arrow: `→`.

* **source**: a string of segments and groups to be replaced. If there's no _source_, the segments in _result_ are generated at the matching place.
* **result**: a string of segments to replace the source or be generated. If there is no _result_, the _source_ is deleted.
* **order**: a sequence of numbers dictating how to reorder the result groups. The initial order is e.g. _#12_ for two groups, _#123_ for three groups, so it wouldn't make much sense to use that; instead _#21_ or _#312_ might be of use.
* **condition**: the condition, which must be met for the sound change to occur. If there's no condition, the sound change always occurs. The condition has to contain `_`, designating the place of the _source_ in the word.
* **direction**: All segments in the word are tested simultaneously for the condition. This means that `l > r / _al` would change `lalala` to `rarala` and not `larala`. To get the sometimes more intuitive result, it should be specified if the sound change should affect only odd or only even matches and if it should be executed left-to-right or right-to-left. All this is done with one of `/ltr even`, `/ltr odd`, `/rtl even` and `/rtl odd`.

#### Sound changes syntax

The following syntax rules apply to the fiels _source_, _result_ and _condition_:

* Segments are written with their spelling and groups are written with their names.
* A segment or a group is a unit, denoted as `U` from now on.
* Brackets can be used to form a single unit out of several: `(example)`
* `U?` in the condition matches zero or one of `U`; it always matches the maximum possible number.
* `U*` in the condition matches zero or more of `U`; it always matches the maximum possible number.
* `U+` in the condition matches one or more of `U`; it always matches the maximum possible number.
* `U{n}` in the condition matches exactly *n* times `U`.
* `U{n,}` in the condition matches *n* or more of `U`; it always matches the maximum possible number.
* `U{n,m}` in the condition matches from *n* up to *m* times `U`; it always matches the maximum possible number.
* `.` in the condition matches any single segment.
* `_` in the condition matches the place of the source.
* `#` in the condition matches a word boundary.
* `(p|t|k)` in the condition matches one and only one of `p`, `t` and `k`.

The following specifics further apply:

* A sound change has to have at least a _source_ or a _result_.
* If there's no _source_ nor a _condition_, a condition of `_#` is assumed.
* If there's no _source_ and the _result_ has one or more groups, a random segment out of each group is chosen. The ratios in which each segment is chosen randomly can be defined (see below).
* If the change is unconditional, but direction still has to be specified, two slashes seperated with space should be used, e.g. `l > r / /rtl even`.

### Directives

Each directive begins with `>>` and optionally has arguments preceded by `:`, i.e. `>>directive(: arguments)`. Most directives also have abbreviated name variants.

`>>add word to output / add to output / output / add / out (: on the same line)`  
	Adds whatever is the current result, optionally on the same line.  

`>>add to output on the same line / output same line / add sameline / out sameline`  
	A variant of the previous directive.  

`>>add segments / segments / segs / seg : s e g m e n t s`  
	Adds the denoted segments, which should be seperated by whitespace.  

`>>clear all segments`  
	Removes all defined segments.  

`>>add group / group: NAME = s e g m e n t s (/ ratios)`  
	Defines a group containing the respective segments. Group names have to consist of capital letters only. If followed by a slash and equal number of numbers as segments, ratios during random segment generation can be defined.  

`>>clear group: NAME`  
	Removes the respective group.  
	
`>>clear groups`  
	Removes all defined groups.  

`>>load new word / new word / load new / new`  
	Discards the result so far and loads a new, empty word. Should be used for word generation.  

`>>fill template: template name (> command)`  
	Fills the respective template with the result so far and prints it out, optionally executing the command for each template field. For more on templates, see below.  
	
`>>reload word / reload`  
	Reloads the original word from the input.  
	
`>>clear output / clear`  
	Clears the output.  
	
`>>load next from word list / load next from input / load next`   
	If you don't want to execute everything for each word in the input, put this directive after the commands that are to be executed only once.  

`>>after loading word list / after loading input / after loading`   
	If you don't want to execute everything for each word in the input, put this directive before the commands that are to be executed only once.  

`>>execute function / execute command / execute / exec: command`  
	Calls the respective command from another command. Useful for nested sound changes or other scenarios that would otherwise be not possible to realise in a single command.  

`>>if word matches regex / if regex / if : condition`  
	The next command is executed only the word matches the respective condition. Don't use the underscore character, as there is no sound change to be localised in the word.  

`>>repeat: n`  
	Repeats the next command `n` number of times. Useful for generating new words. Don't set `n` too high.  

`>>chance: percent`  
	Executes the next command every `percent` out of 100 times. Useful for making irregular sound changes and generating new words with diverse structure.  

`>>reduplicate / redup(: seperator)`  
	Reduplicates the result so far fully, optionally placing `seperator` between them. To get a whitespace character, use `_`.  

### Comments

Comments are never executed and serve to clarify the commands. Comments on new lines start with `//`. Comments after sound changes start with `///`. Comments after directives start with `::`.

### Reserved characters

The following characters cannot be used as segments, parts of segments, names or anywhere out of their proper syntax:

`> \ / # _ ( ) + * ! ? [ ] { } ^ - . : ; $`

### Templates

Templates are used for when each output word has to be formatted or inflected in a certain way. Templates can be defined in the *Templates* tab.  

### Template fields

For each template field, the word executes that template field's command and then replaces it in the template. Template fields are marked with \*asterisks\*.
Template fields have unique names. If two fields have the same name, they're actually the same field that's just repeated in the template.  
You can write something in the `test word` field to see how the template would look like in the output.

### Tables

To get a table in a template, wrap it in curly brackets - `{}`. Then, for each table cell, use square brackets - `[]`. New lines in the template correspond to new rows in the table.  
Example:  
`{`  
`[][singular][plural]`  
`[1][*1sg*][*1pl*]`  
`[2][*2sg*][*2pl*]`  
`[3][*3sg*][*3pl*]`  
`}`  

## Limitations

The following limitations are present:

* When executing commands, there is no check for recursion. E.g. if you call command A from command B and command B from command A and execute either of them, you'll be stuck in an endless loop.
* Test words may not truly represent the output of the template if there are groups or segment definitions present in its parent command, or a further command is called for the template to execute.
* Conditions are not executed correctly for words that are too long (more than 32 characters).
* Ad-hoc groups are not allowed in the _source_ or _result_, e.g. `[ptk] > [bdg]` won't execute correctly. All groups have to be defined with a directive.
* There's no API yet, or possibility for console execution.

## License

MIT
