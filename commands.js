String.prototype.replaceAll = function(search, replacement)
	{
	let r = this.replace(search, replacement);
	return r == this ? r : r.replaceAll(search, replacement);
	};

function updatetabsif(a)
	{
	if (mode != 1)
		return;
	switch(a)
		{
		case 0:
			let majdzad = projects[currentProject].commands[projects[currentProject].currentCommand].command;
			majdzad = majdzad.replaceAll('</br>', '\n');
			document.getElementById("command").value = majdzad;
			document.getElementById("commandName").value = projects[currentProject].commands[projects[currentProject].currentCommand].name;
			document.getElementById("wordInput").value = projects[currentProject].commands[projects[currentProject].currentCommand].input;
			break;
		case 1:
			document.getElementById("commandName").style.background = '#ffaaaa';
			break;
		case 2:
			document.getElementById("commandName").style.background = 'white';
			break;
		}
	}

function switchToTab(target)
	{
	fixTabs();
	projects[currentProject].currentCommand = Math.min(target, projects[currentProject].commands.length - 1);
	updatetabsif(0);
	updateTabs();
	}

function updateTabs()
	{
	fixTabs();
	let i = 0;
	let code = "";
	for (i = 0; i < projects[currentProject].commands.length; i++)
		{
		if (i == projects[currentProject].currentCommand)
			code += interfacebuttonbold(projects[currentProject].commands[i].name, 'switchToTab(' + i + ')');
		else
			code += interfacebutton(projects[currentProject].commands[i].name, 'switchToTab(' + i + ')');
		}
	code += interfacebutton('+', 'addANewTab()');
	if (mode == 1)
		document.getElementById("tab2").innerHTML = code;
	projects[currentProject].currentCommand = Math.min(projects[currentProject].currentCommand, projects[currentProject].commands.length - 1);
	updatetabsif(0);
	}

function addANewTab()
	{
	fixTabs();
	newTab = projects[currentProject].commands.length;
	projects[currentProject].commands[newTab] = JSON.parse(newCommand);
	updateTabs();
	switchToTab(newTab);
	}

function deleteCurrentTab()
	{
	fixTabs();
	if (confirm("Are you sure you want to delete the current command?\nThis action cannot be undone!"))
		{
		projects[currentProject].commands.splice(projects[currentProject].currentCommand, 1);
		updateTabs();
		}
	}

function changeTabName(newName)
	{
	if (newName === undefined)
		return 1;
	if (newName === null)
		return 2;
	fixTabs();
	let i = 0;
	for (i = 0; i < projects[currentProject].commands.length; i++) 
		if (projects[currentProject].commands[i] !== null && projects[currentProject].commands[i] !== undefined)
			if (i != projects[currentProject].currentCommand)
				if (projects[currentProject].commands[i].name == newName) 
					{
					updatetabsif(1);
					return 3;
					}
	projects[currentProject].commands[projects[currentProject].currentCommand].name = newName;
	updatetabsif(2);
	updateTabs();
	}
	
function setCommands(_newCommand)
	{
	if (_newCommand === undefined)
		return 1;
	if (_newCommand === null)
		return 2;
	fixTabs();
	projects[currentProject].commands[projects[currentProject].currentCommand].command = _newCommand;
	
	if (_newCommand === "clj")
		{
		executeButton = "Conlangjugate!";
		windowTitle = "The Conlangjugator!";
		document.title = windowTitle;
		stoutput();
		}
	}

function getWordInput () 
	{
	if (mode != 1) return '';
	return document.getElementById('wordInput').value.split('\n');
	}

function setWordInput(input)
	{
	if (input === undefined)
		return 1;
	if (input === null)
		return 2;
	fixTabs();
	projects[currentProject].commands[projects[currentProject].currentCommand].input = input;
	}

function copyOutputToClipboard()
	{
	window.getSelection().selectAllChildren(document.getElementById('output'));
	document.execCommand('copy');
	window.getSelection().removeAllRanges();
	}

function saveOutput()
	{
	var saveText = document.getElementById('output').innerHTML.replaceAll('<br>','\n');
	saveText = saveText
			.replaceAll('<table>','')
			.replaceAll('<tbody>','')
			.replaceAll('<tr>','')
			.replaceAll('<td>','')
			.replaceAll('</tbody>','')
			.replaceAll('</table>','')
			.replaceAll('</td>','\t')
			.replaceAll('</tr>','\n');
	var blob = new Blob([saveText], {type: "text/plain;charset=utf-8"});
	saveAs(blob, 
			projects[currentProject].name
			+ " "
			+ projects[currentProject].commands[projects[currentProject].currentCommand].name
			+ " output.txt"
			);
	}

function loadInput()
	{
	let input = document.createElement("input");
        input.setAttribute("type", "file");
        input.onchange = function(e)
        	{
		let files = e.target.files;
		if (files.length < 1)
			{
			alert('select a file...');
			return;
			}
		let reader = new FileReader();
		reader.onload = function(e)
			{
			let match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
			if (match == null)
				{
				throw 'Could not parse result'; // should not happen
				}
			document.getElementById('wordInput').value = base64Decode(match[2]);
			};
		reader.readAsDataURL(files[0]);
		}
        input.click();
        input.outerHTML = "";
	}
	
function fixTabs()
	{
	fixProjects();
	if (projects[currentProject].commands === undefined)
		projects[currentProject].commands = [JSON.parse(newCommand)];
	if (projects[currentProject].commands === null)
		projects[currentProject].commands = [JSON.parse(newCommand)];
	if (projects[currentProject].currentCommand === undefined || projects[currentProject].currentCommand === null)
		projects[currentProject].currentCommand = 0;
	if (projects[currentProject].commands[projects[currentProject].currentCommand] === undefined
	||  projects[currentProject].commands[projects[currentProject].currentCommand] === null)
		projects[currentProject].currentCommand = 0;
	if (projects[currentProject].commands[projects[currentProject].currentCommand] === undefined
	||  projects[currentProject].commands[projects[currentProject].currentCommand] === null) 
		projects[currentProject].commands[projects[currentProject].currentCommand] = JSON.parse(newCommand);
	}

