function stoutput() 
	{
	if (mode == 1)
		return ;
	let prevOutput = '';
	if (outputWindowContent !== undefined && outputWindowContent !== null)
		prevOutput = outputWindowContent;
	mode = 1;
	let t = 
	'<div class="col-sm-6" style="width:100%;height:100%;padding:0px">' +
	'	<div style="padding:1px" class="all" id="cmdtop1">' +
	'		<input id="commandName" ' +
	'			type="text"  ' +
	'			value="New command" ' +
	'			placeholder="Command name" ' +
	'			style="width:100%"' +
	'			oninput="changeTabName(this.value)"></textarea>' +
	'	</div>' +
	'	<div id="cmddiv" style="position:absolute;width=100%;"><textarea id="command" ' +
	'		placeholder="Command" ' +
	'		style="width:100%;height:100%;resize:none;"' +
	'		oninput="setCommands(this.value)"></textarea></div>' +
	'</div>' +
	'<div class="col-sm-3" style="width:100%;height:100%;padding:0px">' +
	'	<div id="txtdiv" style="position:absolute;width=100%;"><textarea id="wordInput" placeholder="Word input" class="all" style="width:100%;height:100%;resize:none;" oninput="setWordInput(this.value)"></textarea></div>' +
	'</div>' +
	'<div class="col-sm-3" style="width:100%;height:100%">' +
	'	<div id="output" class="all" style="position:absolute;border:1px solid gray;width:99.5%;overflow-y:auto;">' + prevOutput + '</div>' +
	'</div>';
	document.getElementById("outputrow").innerHTML = t;
	updateui();
	document.getElementById("m1").classList.add("bld");
	document.getElementById("m2").classList.remove("bld");
	//document.getElementById("m3").classList.remove("bld");
	document.getElementById("m4").classList.remove("bld");
	
	let offheight = document.getElementById('cmdtop1').offsetHeight;
	let cmddiv = document.getElementById("cmddiv");
	let txtdiv = document.getElementById("txtdiv");
	let op = document.getElementById("output");
	cmddiv.style.top = offheight + 'px';
	cmddiv.style.bottom = '2px';
	cmddiv.style.left = '2px';
	cmddiv.style.right = '2px';
	txtdiv.style.bottom = '2px';
	txtdiv.style.top = '2px';
	txtdiv.style.left = '2px';
	txtdiv.style.right = '2px';
	op.style.bottom = '2px';
	op.style.top = '2px';
	op.style.left = '2px';
	
	if (window.executeButton === undefined)
		executeButton = "Execute";
	
	t = 
	interfacebutton('📝 ' + executeButton, 'executeCommand(getWordInput(), document.getElementById(\'command\').value)') +
	interfacebutton('🗋 Clear output', 'clearoutput()') +
	interfacebutton('📝 Clear & execute', 'clearoutput();executeCommand(getWordInput(), document.getElementById(\'command\').value);') +
	interfacebutton('💾 Save project', 'saveCurrentProject()') +
	interfacebutton('🔤 Rename project', 'renameProject()') +
	interfacebutton('📂 Open project', 'openProject()') +
	interfacebutton('🗙 Close project', 'closeProject()') +
	interfacebutton('🗑 Delete command', 'deleteCurrentTab()') +
	interfacebutton('📋 Copy output', 'copyOutputToClipboard()') +
	interfacebutton('💾 Save output', 'saveOutput()') +
	interfacebutton('📂 Load input', 'loadInput()') +
	interfacebutton('💾 Temporary save', 'storeProjectsToLocalStorage()');
	document.getElementById("buttonsid").innerHTML = t;
	}
function sttempaltes() 
	{
	if (mode == 2)
		return ;
	if (mode == 1)
		{
		outputWindowContent = document.getElementById('output').innerHTML;
		}
	mode = 2;
	let t = 
	'<div class="col-sm-3" style="width:100%;height:100%;padding:0px">' +
	'	<div style="padding:1px" class="all" id="cmdtop1">' +
	'		<input id="templateName" ' +
	'			type="text"  ' +
	'			value="New command" ' +
	'			placeholder="Command name" ' +
	'			style="width:100%"' +
	'			oninput="changeTemplateName(this.value)"></textarea>' +
	'		<input id="testWord" ' +
	'			type="text"  ' +
	'			value="" ' +
	'			placeholder="Template test word" ' +
	'			style="width:100%"' +
	'			oninput="parsetemplateinput()"></textarea>' +
	'		<input id="templateField" ' +
	'			type="text"  ' +
	'			value="No template field selected" ' +
	'			style="width:100%;font-weight: bold;text-align: center;"' +
	'			disabled></textarea>' +
	'	</div>' +
	'	<div id="cmddiv" style="position:absolute;width=100%;"><textarea id="inflexion" ' +
	'		placeholder="Inflexion rules" ' +
	'		type="text"  ' +
	'		value="Select a template field first" ' +
	'		class="all" ' +
	'		rows="15" style="width:100%;height:100%;resize:none;"' +
	'		oninput="settemplatefield(document.getElementById(\'templateField\').value, this.value)" disabled></textarea></div>' +
	'</div>' +
	'<div class="col-sm-9" style="width:100%;height:100%;padding:0px">' +
	'	<textarea id="template" ' +
	'		placeholder="Templates" ' +
	'		class="all" ' +
	'		rows="15" style="width:100%;height:50%;"' +
	'		oninput="resetclock()"></textarea>' +
	'	<div id="preview" style="border:1px solid gray;width:100%;height:49%;"></div>' +
	'</div>';
	document.getElementById("outputrow").innerHTML = t;
	updateui();
	document.getElementById("m2").classList.add("bld");
	document.getElementById("m1").classList.remove("bld");
	//document.getElementById("m3").classList.remove("bld");
	document.getElementById("m4").classList.remove("bld");
	
	let offheight = document.getElementById('cmdtop1').offsetHeight;
	let cmddiv = document.getElementById("cmddiv");
	cmddiv.style.top = offheight + 'px';
	cmddiv.style.bottom = '2px';
	cmddiv.style.left = '2px';
	cmddiv.style.right = '2px';
	
	t = 
	interfacebutton('💾 Save project', 'saveCurrentProject()') +
	interfacebutton('🔤 Rename project', 'renameProject()') +
	interfacebutton('📂 Open project', 'openProject()') +
	interfacebutton('🗙 Close project', 'closeProject()') +
	interfacebutton('🗑 Delete current template', 'deleteCurrentTemplate()') +
	interfacebutton('💾 Temporary save', 'storeProjectsToLocalStorage()');
	document.getElementById("buttonsid").innerHTML = t;
	}
function stci() 
	{
	if (mode == 1)
		{
		outputWindowContent = document.getElementById('output').innerHTML;
		}
	mode = 3;
	//document.getElementById("m3").classList.add("bld");
	document.getElementById("m2").classList.remove("bld");
	document.getElementById("m1").classList.remove("bld");
	document.getElementById("m4").classList.remove("bld");
	}
function stlog() 
	{
	if (mode == 4)
		return ;
	if (mode == 1)
		{
		outputWindowContent = document.getElementById('output').innerHTML;
		}
	mode = 4;
	let t = 
	'<div class="col-sm-12">'+
	'	<div id="logdiv" class="all" style="border:1px solid gray;width:100%;height:100%;"><textarea id="logfield" '+
	'		placeholder="Log" '+
	'		style="width:100%;height:100%;resize:none;">'+
	'		</textarea></div>'+
	'</div>';
	document.getElementById("outputrow").innerHTML = t;
	updateui();
	document.getElementById("m4").classList.add("bld");
	document.getElementById("m2").classList.remove("bld");
	//document.getElementById("m3").classList.remove("bld");
	document.getElementById("m1").classList.remove("bld");
	
	t = 
	interfacebutton('💾 Save project','saveCurrentProject()')+
	interfacebutton('🔤 Rename project','renameProject()')+
	interfacebutton('📂 Open project','openProject()')+
	interfacebutton('🗙 Close project','closeProject()')+
	interfacebutton('📋 Copy log to clipboard','')+
	interfacebutton('🗋 Clear log','logg=\'\'; logArray = []; updateui();');
	document.getElementById("buttonsid").innerHTML = t;
	document.getElementById("tab2").innerHTML = '';
	scrolltobottom();
	}

function scrolltobottom()
	{
	let logfield = document.getElementById('logfield');
	logfield.scrollTop = logfield.scrollHeight;
	}

function updateui()
	{
	switch(mode)
		{
		case 1:
			updateTabs();
			break;
		case 2:
			updateTemplates();
			break;
		case 3:
			break;
		case 4:
			document.getElementById('logfield').value = logArray.join("\n");
			break;
		}
	}

function initinterface()
	{
	let t = 
	interfacebutton('🔨 Commands & output', 'stoutput()', 'm1') +
	interfacebutton('📏 Templates', 'sttempaltes()', 'm2') +
	interfacebutton('📒 Log', 'stlog()', 'm4');
	document.getElementById("modesid").innerHTML = t;
	
	t = 
	interfacebutton('Execute', 'executeCommand(getWordInput(), document.getElementById(\'command\').value)') +
	interfacebutton('Save', 'saveCommand()') +
	interfacebutton('Save all', 'saveAllCommands()') +
	interfacebutton('Open', 'openCommand()') +
	interfacebutton('Delete current command', 'deleteCurrentTab()') +
	interfacebutton('Copy output to clipboard', 'copyOutputToClipboard()') +
	interfacebutton('Save output', 'saveOutput()') +
	interfacebutton('Load input', 'loadInput()') +
	interfacebutton('Clear log', 'logg=\'\';dolog(\'\');');
	document.getElementById("buttonsid").innerHTML = t;
	}


function initheight()
	{
	let topheight = 
	document.getElementById('projectsbar').offsetHeight
	+ document.getElementById('modes').offsetHeight
	+ document.getElementById('buttons').offsetHeight
	+ document.getElementById('subtabs').offsetHeight;
	document.getElementById("outputrow").style.top = topheight + 'px';
	}
