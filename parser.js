function executeCommand(workedOnWords, soundChanges)
	{
	let tempWords = [];
	for(let i = 0; i < Math.min(10, workedOnWords.length); i++)
		tempWords[i] = workedOnWords[i];
	if (workedOnWords.length > 10)
		tempWords[10] = "...";
	dolog('Start executing command on words: ' + JSON.stringify(tempWords));
	if (typeOf(soundChanges) != 'string') return 1;
	let soundChangesArray = soundChanges.split('\n');
	templateoutputfields = {};
	let workedOnWordsLength = workedOnWords.length;
	let soundChangesArrayLength = soundChangesArray.length;
	let startLine = 0;
	for(let i = 0; i < workedOnWordsLength; i++)
		{
		let word = workedOnWords[i];
		let origWord = word;
		let result = 
			{
			"word": word, 
			"startLine": startLine, 
			"jumpToStart": false,
			"skipNext": false,
			"repeatCounter": 0
			};
		for (let j = startLine; j < soundChangesArrayLength; j++)
			{
			result = executeLine(result, soundChangesArray[j], j, origWord);
			if (result.jumpToStart && i < workedOnWordsLength - 1)
				{
				j = soundChangesArrayLength;
				startLine = result.startLine;
				}
			}
		workedOnWords[i] = result.word;
		}
	return workedOnWords;
	}

function executeLine(wordInfo, line, lineNumber, origWord)
	{
	if (typeOf(line) != 'string')
		{
		dolog("Error: input line is not a string: ");
		dolog("" + line);
		return 1;
		}
	line = line.trim();
	if (line.length < 2)
		return wordInfo;
	if (line[0] == ';' && line[1] == ';')
		return wordInfo;
	if (line[0] == '/' && line[1] == '/')
		return wordInfo;
	if (wordInfo.skipNext)
		{
		wordInfo.skipNext = false;
		dolog("Skipping " + line + " for " + wordInfo.word + " because of a previous condition.");
		return wordInfo;
		}
	let rc = wordInfo.repeatCounter;
	while (rc > 1)
		{
		dolog("Repeating '" + line + "' " + rc + " more times");
		rc--;
		let wi = wordInfo;
		wi.repeatCounter = 0;
		wordInfo = executeLine(wi, line, lineNumber, origWord);
		}
	
	dolog("Parsing '" + line + "' for '" + wordInfo.word + "' at line number " + lineNumber + "; initial word: '" + origWord + "'");
	
	if ( (line[0] == '>' && line[1] == '>') || (line[0] == ';') )
		{
		if (line[0] == ';') 
			line = line.substring(1);
		else
			line = line.substring(2);
		let args = '';
		if (line.includes(':'))
			{
			line = line.split(':');
			args = line[1];
			line = line[0];
			}
		else if (line.includes(';'))
			{
			line = line.split(';');
			args = line[1];
			line = line[0];
			}
		line = nosp(line).toLowerCase();
		switch(line)
			{
			case 'g':
			case 'group':
			case 'addgroup': //>>add group: X = seg s C
				if (args.includes('='))
					{
					args = args.split('=');
					
					let groupName = nosp(args[0]);
					args = args[1].trim();
					
					let ratios = '';
					if (args.includes('/'))
						{
						args = args.split('/');
						ratios = args[1].trim();
						args = args[0].trim();
						}
					
					declareSegments(args,groupName,ratios);
					//wordInfo.word = wordToInner(wordInfo.word);
					//NOTE: better don't remove above comment
					}
				break;
			case 'cleargroup': //>>clear group: X
				if (args != '')
					{
					delete group[nosp(args)];
					delete groupRatios[nosp(args)];
					}
				break;
			case 'cleargroups': //>>clear groups
				groups = {};
				groupRatios = {};
				break;
			case 'new':
			case 'loadnew':
			case 'newword':
			case 'loadnewword': //>>load new (word)
				wordInfo.word = '';
				break;
			case 's':
			case 'seg':
			case 'segs':
			case 'segments':
			case 'addsegments': //>>add segments: seg s fds
				declareSegments(args.trim(),'','');
				//wordInfo.word = wordToInner(wordInfo.word);
				//NOTE: better don't remove above comment
				break;
			case 'clearsegments': //>>clear segments: seg s fsdfds
				if (args.trim() != '')
					{
					args = args.replace(/\t/g,' ').replaceAll(/  /,' ').trim();
					let res = '';
					let segs = args.split(' ');
					}
				break;
			case 'clearallsegments': //>>clear all segments
				//wordInfo.word = sca(wordInfo.word,innerToSeg);
				//NOTE: better don't remove above comment
				hexcounter = hexcounterinit;
				groups = {};
				groupRatios = {};
				segToInner = {};
				innerToSeg = {};
				break;
			case 'o':
			case 'out':
			case 'add':
			case 'output':
			case 'addtooutput':
			case 'addwordtooutput': //>>add to output(: on the same line) 
				if (nosp(args) == 'onthesameline')
					output(wordInfo.word, false);
				else
					output(wordInfo.word, true);
				break;
			case 'osl':
			case 'outsameline':
			case 'addsameline':
			case 'outputsameline':
			case 'addtooutputonthesameline': //>>add to output on the same line
				output(wordInfo.word, false);
				break;
			case 'ft':
			case 'filltemplate': //>>fill template
				if (nosp(args).length > 0)
					{
					args = args.split('>');
					let script = '';
					if (args.length > 1)
						script = args[1];
					args = args[0];
					filltemplate(args, wordInfo.word, script);
					}
					//filltemplate(args,sca(word,innerToSeg));
					//NOTE: better don't remove above comment
				break;
			case 'r':
			case 'rl':
			case 'reload':
			case 'reloadword':
				wordInfo.word = origWord;
				//wordInfo.word = wordToInner(wordInfo.word);
				//NOTE: better don't remove above comment
				break;
			case 'c':
			case 'clear':
			case 'clearoutput': //>>clear output
				clearoutput();
				break;
			case 'loadnext': 
			case 'loadnextfrominput':
			case 'loadnextfromwordlist': //>>load next (from input/word list)
				wordInfo.startLine = lineNumber;
				break;
			case 'afterloading': 
			case 'afterloadinginput':
			case 'afterloadingwordlist': //>>after loading
				wordInfo.jumpToStart = true;
				break;
			case 'exec':
			case 'execute':
			case 'executecommand':
			case 'executefunction': //>>execute (command/function):
				args = args.trim();
				let length = projects[currentProject].commands.length;
				for (let q = 0; q < length; q++)
					{
					if (projects[currentProject].commands[q].name.trim() == args)
						{
						wordInfo.word = executeCommand(
									[wordInfo.word], 
									projects[currentProject].commands[q].command
									)[0];
						q = length;
						}
					}
				break;
			case 'if':
			case 'ifregex':
			case 'ifwordmatchesregex': //>>if (word matches to) regex:
				wordInfo.skipNext = !testWordAgainstRegex(wordInfo.word, nosp(args));
				dolog('tested >' + wordInfo.word + '< against >' + nosp(args) + '<: ' + !wordInfo.skipNext);
				break;
			case 'repeat':
				args = nosp(args);
				if (args.length > 0 && !isNaN(args))
					wordInfo.repeatCounter = Number(args);
				break;
			case 'chance':
				args = nosp(args);
				if (args.length > 0 && !isNaN(args))
					wordInfo.skipNext = (Number(args) < Math.random()*100);
				break;
			case 'redup':
			case 'reduplicate':
				args = nosp(args);
				if (args == '_')
					wordInfo.word = wordInfo.word + ' ' + wordInfo.word;
				else
					wordInfo.word = wordInfo.word + args + wordInfo.word;
				break;
			default:
				break;
			}
		return wordInfo;
		}
	else
		{
		wordInfo.word = wordInfo.word.change(line);
		return wordInfo;
		}
	}
