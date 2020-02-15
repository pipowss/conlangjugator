String.prototype.replace2 = function(s1, s2, r1, r2)
	{
	let r = this.replace(s1, r1).replace(s2, r2);
	return r == this ? r : r.replace2(s1, s2, r1, r2);
	};
	
String.prototype.change = function(expression)
	{
	//for now all changes to and from inner represantation will happen here
	//for simplicity's sake, and ease of rapid prototyping
	//but when optimisations need to be done, this is one of the first things to consider
	if (!expression.includes('>')) return this;//ignore comments
	let changeable = ' ' + wordToInner(this.toLowerCase())+' ';
	
	let isCaps = false;
	let isCapitalised = false;
	if (this.length > 1 && this.toUpperCase() == this)
		isCaps = true;
	if (this.length > 0 && this[0].toUpperCase() == this[0])
		isCapitalised = true;
		
	// begin parsing expression
	
	let ex = expression.split('>');
	let from = ex[0].trim();
	if (ex[1] === undefined) 
		ex[1] ='';
	let to = ex[1].trim();
	to = to.split('/');
	let condition = '';
	let i = 1;
	
	if (to[1] !== undefined) 
		condition+=to[i];
	flag = '';
	if (to[2] !== undefined) 
		flag = to[2].trim();
	let toGroupName = to[0].trim(); 
	to = to[0].trim();
	if (from == '' && to == '') 
		return this;//ignore comments
	condition = wordToInner(condition.trim());
	
	to = to.split('#');
	let order = '';
	if (to[1] !== undefined)
		order = nosp(to[1]);
	
	to = to[0];
	
	let fromWithGroups = wordToInnerLeaveGroups(from);
	let toWithGroups = wordToInnerLeaveGroups(to);
	
	from = wordToInner(from);
	to = wordToInner(to);
	if (from == '' && condition == '')
		condition = '_#'; //ensure we aren't adding the new stuff in between every segment
	
	let precondition = '';
	let postcondition = '';
	let carr = [];
	carr = condition.split('_');
	if (carr.length != 2 && condition != '') 
		{
		dolog("Error: Illdefined condition: " + condition);
		return "illdefined condition: " + condition;
		}
	else if (carr.length == 2)
		{
		precondition = wordToInner(carr[0]).replace(/#/g,'[\\s,.]');
		postcondition = wordToInner(carr[1]).replace(/#/g,'[\\s,.]');
		}
	
	let fromIsEmpty = (from.length==0);
	// end parsing expression

	let prematches = [];
	let postmatches = [];
	let fromb = [];
	let frome = [];
	let match = [];
	let pre = 0;
	let post = 0;
	let froms = 0;
	let fromre = RegExp(from,'gm');
	let prere = RegExp(precondition,'gm');
	let postre = RegExp(postcondition,'gm');
	if (from.length > 0) 
		while ((match = fromre.exec(changeable)) !== null)
			{
			fromb[froms] = fromre.lastIndex - match[0].length;
			frome[froms] = fromre.lastIndex - 1;
			froms++;
			}
	else for (let i = 0; i < changeable.length; i++)
		{
		fromb[froms] =
		frome[froms] = i;
		froms++;
		}
	if (precondition != '')
		while ((match = prere.exec(changeable)) !== null)
			{
			prematches[pre++] = prere.lastIndex;
			if (fromIsEmpty && prematches[pre - 1] < changeable.length)
				prematches[pre - 1] = Math.max(prematches[pre - 1] - 1, 0);
			}
	if (postcondition != '')
		while ((match = postre.exec(changeable)) !== null)
			if (postre.lastIndex-match[0].length - 1 >= 0)
				postmatches[post++] = postre.lastIndex-match[0].length - 1;

	let preres = '', postres = '', fbres = '', feres = '';
	let matchflagb = 0, matchflage = 0, matchflag = 0;
	if (precondition != '')
		{
		let l = changeable.length;
		let j = 0;
		let mi = 0;
		for(i = 0; i < l; i++)
			if (i == prematches[j]) 
				{
				preres+='!';
				if (mi < froms) 
					while (fromb[mi] < i) //there are still things left to match
						{
						if (mi++ >= froms)
							break;
						}
				if (fromb[mi] == i) 
					matchflagb |= (1 << mi);
				j++;
				}
		else 
			preres += changeable[i];
		}
	if (postcondition != '')
		{
		let l = changeable.length;
		let j = 0;
		let mi = 0;
		for(i = 0; i < l; i++)
			if (i == postmatches[j]) 
				{
				postres += '!';
				if (mi < froms) 
					while (frome[mi] < i) 
						if (mi++ >= froms)
							break;
				if (frome[mi] == i) 
					matchflage |= (1 << mi);
				j++;
				}
		else postres += changeable[i];
		}
	
	preres += prematches.length;
	postres += postmatches.length;
	
	let matchedfromb = [], matchedfrome = [];
	for(i = 0; i < froms; i++)
		if ( ( precondition==''  || ( matchflagb & (1 << i) ) != 0 ) 
		  && ( postcondition=='' || ( matchflage & (1 << i) ) != 0 ) )
			{
			matchedfromb[i] = fromb[i];
			matchedfrome[i] = frome[i];
			}
	
	let endres = '';
	let zi = 0;

	flag = nosp(flag);
	let parity = flag.substring(3);
	flag = flag.substring(0, 3);
	if (parity == 'odd') 
		parity = 1; 
	else 
		parity = 0;
	zi = 0;
	let dict = {};
	let logmsg = 'executing \'' + from + ' > ' + to + ' / ' + condition + '\' for \'';
	let jj = 0;
	let alternation = 0;
	let mlength = 0;
	
	let toGroupless = to.replace(/\[/g,'').replace(/\]/g,'');
	for(i = 0; i < matchedfromb.length; i++) 
		if (matchedfromb[i] !== null && matchedfromb[i] !== undefined) 
			mlength++;
	for(i = 0; i < matchedfromb.length; i++) //the actual applying of the sound change happens in here
		{
		let l = changeable.length;
		if (matchedfromb[i] !== null && matchedfromb[i] !== undefined) 
			for(j = jj; j < l; j++)
				{
				if (j == matchedfromb[i]) 
					alternation++;
				let evenAndOddConditions = 
						   (flag == '')
						|| (flag == 'rtl' && (mlength - alternation) % 2 == parity)
						|| (flag == 'ltr' && ((alternation % 2) == parity))
						|| mlength == 1;
				if (fromIsEmpty) // if we are just generating new segments
					{
					logmsg += changeable[j];
					if (j <= matchedfromb[i] || j > matchedfrome[i] || !evenAndOddConditions) 
						endres += changeable[j];
					}
				if (evenAndOddConditions)
					{
					if (j == matchedfromb[i]) 
						{
						logmsg += '<';
						endres += generateOutputSegments(
										 fromWithGroups, 
										 toWithGroups, 
										 changeable.substring(matchedfromb[i], matchedfrome[i] + 1),
										 order
										);
						}
					}
				if (!fromIsEmpty) // if we are replacing existing segments
					{
					logmsg += changeable[j];
					if (j < matchedfromb[i] || j > matchedfrome[i] || !evenAndOddConditions) 
						endres += changeable[j];
					}
				zi = i;
				if (j == matchedfrome[i]) 
					{
					jj = j + 1;
					if (evenAndOddConditions)
						logmsg += '>';
					break;
					}
				}
		}
	logmsg += changeable.substring(matchedfrome[zi] + 1);
	logmsg += '\' with parity ' + parity + '; rtl?: ' + flag + '; length ' + changeable.length;
	endres += changeable.substring(matchedfrome[zi] + 1);
	
	logmsg += ' resulting in \'' + endres + '\' from input \'' + changeable + '\'';
	dolog('' + sca(logmsg, innerToSeg));
	dolog('		' + sca(preres, innerToSeg) + ' <- precondition matches');
	dolog('		' + sca(postres, innerToSeg) + ' <- postcondition matches');
	
	if (isCaps)
		return sca(endres.trim(), innerToSeg).toUpperCase();
	else if (isCapitalised)
		{
		let returnable = sca(endres.trim(), innerToSeg);
		return returnable[0].toUpperCase() + returnable.substring(1);
		}
	else
		return sca(endres.trim(), innerToSeg);
	};

function testWordAgainstRegex(word, regex)
	{
	word = ' ' + wordToInner(word) + ' ';
	regex = wordToInner(regex).replace(/#/g,'[\\s,.]');
	regex = RegExp(regex, 'gm');
	return (regex.exec(word) !== null);
	}

function sca(ww, rm)
	{
	if (ww === undefined) return '';
	if (ww === null) return '';
	if (rm === undefined) return ww;
	if (rm === null) return ww;
	if (Object.keys(rm).length === undefined) return ww;
	if (Object.keys(rm).length == 0) return ww;
	return ww.replace(
			new RegExp("(" + Object.keys(rm).map(function(i){return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")}).join("|") + ")", "g"), 
			function(s){return rm[s];}
			);
	}

function nosp (arg){return arg.replace(/[\r\n\t\f\v]/g, ' ').replaceAll(/ /, '').trim();}
function typeOf (obj) { return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase(); }

function output(op, newline)
	{
	if (mode != 1) return;
	if (newline && document.getElementById('output').innerHTML != '') document.getElementById('output').innerHTML += '<br>';
	switch(typeOf(op))
		{
		case "string":
			document.getElementById('output').innerHTML += sca(op, innerToSeg).replaceAll('\\n', '<\\br>');
			break;
		case "array":
			let __v = "";
			for(let __i = 0; __i < op.length; __i++) __v += sca(op[__i], innerToSeg) + "\n";
			document.getElementById('output').innerHTML += __v;
			break;
		default:
			document.getElementById('output').innerHTML += "Unknown output format!\n" + op;
			break;
		}
	}

function clearoutput()
	{
	if (mode != 1) return;
	document.getElementById('output').innerHTML = '';
	}
	
function stringToArray(s) {return s.split('');}

function declareSegments(s, g, r) 
	{
	s = s.replace(/\t/g, ' ').replaceAll(/  /, ' ').trim();
	r = r.replace(/\t/g, ' ').replaceAll(/  /, ' ').trim();
	let res = '';
	let segs = s.split(' ');
	let nums = r.split(' ');
	dolog('declaring segments: ' + g + ' = ' + s + ' / ' + r);
	if (g != '' && nums[0].trim() != '')
		{
		groupRatios[g] = [];
		let totalChance = 0;
		for(let i = 0; i < nums.length; i++)
			{
			try
				{
				groupRatios[g][i] = totalChance + Number(nums[i]);
				totalChance += Number(nums[i]);
				}
			catch (e)
				{
				groupRatios[g][i] = totalChance + 1;
				totalChance++;
				}
			}
		for(let i = nums.length; i < segs.length; i++)
			groupRatios[g][i] = totalChance + 1;
			totalChance++;
		}
	for(let i = 0; i < segs.length; i++) 
		if (!res.includes(segs[i]))
			{
			let hexchar = '';
			if (groups[segs[i]] !== undefined && groups[segs[i]] !== null) 
				hexchar = groups[segs[i]];
			else if (segToInner[segs[i]] === undefined)
				{
				hexchar = String.fromCharCode(hexcounter);
				hexcounter++;
				maxSegLength = Math.max(maxSegLength, segs[i].length);
				segToInner[segs[i]] = hexchar;
				innerToSeg[hexchar] = segs[i];
				}
			else 
				hexchar = segToInner[segs[i]];
			res += hexchar;
			}
	if (g != '')
		{
		groups[g] = res;
		maxSegLength = Math.max(maxSegLength, g.length);
		}
	//dolog('segments: ' + JSON.stringify(segToInner).replaceAll('"',''));
	//dolog('groups: ' + JSON.stringify(groups).replaceAll('"',''));
	//dolog('group chances: ' + JSON.stringify(groupRatios).replaceAll('"',''));
	return res;
	}

function dolog(l)
	{
	if (typeOf(l) == 'string' && recordCommandsInLog)
		{
		let time = new Date(); 
		let timestr = time.getDate() + "/" + (time.getMonth()+1)  + "/" + time.getFullYear() + " " + 
				time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + " " +
				time.getMilliseconds() + ": ";
		if (logArray.push(timestr+l) > maxLinesInLog)
			logArray.shift();
		if (mode == 4)
			updateui();
		}
	}

function wordToInner(w)
	{
	w = w.trim();
	let res = '';
	let i = 0, j = 0;
	let wlength = w.length;
	let found = false;
	let sequence = '';
	for(i = 0; i < wlength; )
		{
		found = false;
		for(j = Math.min(maxSegLength, wlength-i); j > 0; j--) //give priority to longer sequences first
			{//otherwise digraphs and combining diacritics won't ever get parsed
			sequence = w.substring(i, i + j);
			if (groups[sequence] !== undefined)
				{
				found = true;
				res += '[' + groups[sequence] + ']';
				i += j;
				break;
				}
			else if (segToInner[sequence] !== undefined)
				{
				found = true;
				res += segToInner[sequence];
				i += j;
				break;
				}
			}
		if (!found)
			{
			res += w[i];
			i++;
			}
		}
	return res;
	}

function wordToInnerLeaveGroups(w) //w should be a monolithic word and not contain any special or whitespace characters!
	{
	w = w.trim();
	let res = '';
	let i = 0, j = 0;
	let wlength = w.length;
	let found = false;
	let sequence = '';
	for(i = 0; i < wlength; )
		{
		found = false;
		for(j = Math.min(maxSegLength, wlength-i); j > 0; j--) //give priority to longer sequences first
			{//otherwise digraphs and combining diacritics won't ever get parsed
			sequence = w.substring(i, i+j);
			if (segToInner[sequence] !== undefined && groups[sequence] === undefined)
				{
				found = true;
				res += segToInner[sequence];
				i += j;
				break;
				}
			}
		if (!found)
			{
			res += w[i];
			i++;
			}
		}
	return res;
	}

function generateOutputSegments(fromSegs, toSegs, matchedString, order)
	{
	let result = '';
	//the arguments should already be in inner representation
	let toLength = toSegs.length;
	if (toLength == 0)
		return result;
	let fromGroupsNames = [];
	let fromGroupsIndices = [];
	fromGroupsNames[0] = '';
	fromGroupsIndices[0] = 0;
	let fromLength = fromSegs.length;
	let fromNoGroupsIndex = 0;
	if (fromLength > 0)
		for(let i = 0; i < fromLength; i++)
			{
			for(let j = Math.min(maxSegLength, fromLength - i); j > 0; j--) //give priority to longer sequences first
				{
				sequence = fromSegs.substring(i, i+j);
				if (groups[sequence] !== undefined)
					{
					found = true;
					fromGroupsNames[fromGroupsNames.length] = sequence;
					fromGroupsIndices[fromGroupsIndices.length] = fromNoGroupsIndex;
					i += j - 1;
					j = -10;//break from the inner for
					}
				}
			fromNoGroupsIndex++;
			}
	
	let useOrder = false;
	if (order.length + 1 >= fromGroupsNames.length)
		useOrder = true;
	let inputGroupIndex = 1;
	let inputGroupIndexOrder = 0;
	for(let i = 0; i < toLength; i++)
		{
		let found = false;
		let outputGroup = '';
		for(let j = Math.min(maxSegLength, toLength - i); j > 0; j--) //give priority to longer sequences first
			{
			sequence = toSegs.substring(i, i + j);
			if (groups[sequence] !== undefined)
				{
				found = true;
				outputGroup = sequence;
				i += j - 1;
				j = -10;//break from the inner for
				}
			}
		
		if (fromLength == 0 && found) // generating new segments
			{
			let groupString = groups[outputGroup];
			if (groupRatios[outputGroup] === undefined || groupRatios[outputGroup] === null)
				{
				let index = randInt0toNincl(groupString.length - 1);
				result += groupString[index];
				}
			else
				{
				let final = groupRatios[outputGroup].length - 1;
				let index = randInt0toNincl(groupRatios[outputGroup][final]);
				for (let q = 0; q <= final; q++)
					{
					if (index <= groupRatios[outputGroup][q])
						{
						result += groups[outputGroup][q];
						q = final + 20;//break from innermost for
						}
					}
				}
			}
		else if (found && fromGroupsNames.length > 1)//changing segments
			{
			let inputChar = '';
			let targetIndex = '';
			if (!useOrder)
				{
				inputChar = matchedString[fromGroupsIndices[inputGroupIndex]];
				targetIndex = (groups[fromGroupsNames[inputGroupIndex]]).search(inputChar);
				}
			else
				{
				if (isNaN(order[inputGroupIndexOrder]))
					{
					dolog("Error: order of metathesis includes non numerical characters: " + order);
					return result;
					}
				let newOrder = Number(order[inputGroupIndexOrder]);
				inputChar = matchedString[fromGroupsIndices[newOrder]];
				targetIndex = (groups[fromGroupsNames[newOrder]]).search(inputChar);
				}
			if (targetIndex == -1)
				{
				dolog("Error: Logic error in group replacement - couldn't find " + inputChar + " in " + groups[fromGroupsNames[inputGroupIndex]]);
				dolog("i.e. " + scop(inputChar) + " in " + scop(groups[fromGroupsNames[inputGroupIndex]]));
				}
			else
				{
				targetIndex = Math.min(targetIndex, (groups[outputGroup]).length - 1);
				result += groups[outputGroup][targetIndex];
				}
			inputGroupIndex++;
			inputGroupIndexOrder++;
			inputGroupIndex = Math.min(inputGroupIndex, fromGroupsNames.length - 1);
			inputGroupIndexOrder = Math.min(inputGroupIndexOrder, order.length - 1);
			}
			
		if (!found) //no group found - so just adding the segment
			result += toSegs[i];
		}
	return result.replaceAll(sca('0', segToInner), '').replaceAll(sca('_', segToInner), ' ');
	}

function scop(str) {return sca(str, innerToSeg);}

function randInt0toNincl(n)
	{
	return Math.floor(Math.random() * Math.floor(n + 1));
	}
