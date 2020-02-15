function updatetemplatesif(a)
	{
	if (mode != 2)
		return;
	switch(a)
		{
		case 0:
			document.getElementById("template").value = projects[currentProject].templates[projects[currentProject].currentTemplate].template;
			parsetemplateinput();
			updater('');
			document.getElementById("templateName").value = projects[currentProject].templates[projects[currentProject].currentTemplate].name;
			break;
		case 1:
			document.getElementById("templateName").style.background = '#ffaaaa';
			break;
		case 2:
			document.getElementById("templateName").style.background = 'white';
			break;
		}
	}

function switchToTemplate(target)
	{
	parsetemplateinput();
	fixTemplates();
	projects[currentProject].currentTemplate = Math.min(target, projects[currentProject].templates.length - 1);
	updatetemplatesif(0);
	updateTemplates();
	}

function updateTemplates()
	{
	fixTemplates();
	let i = 0;
	let code = "";
	for (i = 0; i < projects[currentProject].templates.length; i++)
		{
		if (i == projects[currentProject].currentTemplate)
			code += interfacebuttonbold(projects[currentProject].templates[i].name, 'switchToTemplate(' + i + ')');
		else
			code += interfacebutton(projects[currentProject].templates[i].name, 'switchToTemplate(' + i + ')');
		}
	code += interfacebutton('+', 'addANewTemplate()');
	if (mode == 2)
		document.getElementById("tab2").innerHTML = code;
	projects[currentProject].currentTemplate = Math.min(projects[currentProject].currentTemplate, projects[currentProject].templates.length - 1);
	updatetemplatesif(0);
	}

function addANewTemplate()
	{
	fixTemplates();
	let __newTemplate = projects[currentProject].templates.length;
	projects[currentProject].templates[__newTemplate] = JSON.parse(newTemplate);
	updateTemplates();
	switchToTemplate(__newTemplate);
	}

function deleteCurrentTemplate()
	{
	fixTemplates();
	if (confirm("Are you sure you want to delete the current template?\nThis action cannot be undone!"))
		{
		projects[currentProject].templates.splice(projects[currentProject].currentTemplate, 1);
		updateTemplates();
		}
	}

function changeTemplateName(newName)
	{
	if (newName === undefined)
		return 1;
	if (newName === null)
		return 2;
	fixTemplates();
	let i = 0;
	for (i = 0; i < projects[currentProject].templates.length; i++) 
	if (projects[currentProject].templates[i] !== null && projects[currentProject].templates[i] !== undefined)
		if (i != projects[currentProject].currentTemplate)
			if (projects[currentProject].templates[i].name == newName) 
				{
				updatetemplatesif(1);
				return 3;
				}
	projects[currentProject].templates[projects[currentProject].currentTemplate].name = newName;
	updatetemplatesif(2);
	updateTemplates();
	}
	
function setTemplates(_newTemplate)
	{
	if (_newTemplate === undefined)
		return 1;
	if (_newTemplate === null)
		return 2;
	fixTemplates();
	projects[currentProject].templates[projects[currentProject].currentTemplate].template = _newTemplate;
	}
	
function fixTemplates()
	{
	fixProjects();
	if (projects[currentProject].templates === undefined)
		projects[currentProject].templates = [JSON.parse(newTemplate)];
	if (projects[currentProject].templates === null)
		projects[currentProject].templates = [JSON.parse(newTemplate)];
	if (projects[currentProject].currentTemplate === undefined || projects[currentProject].currentTemplate === null)
		projects[currentProject].currentTemplate = 0;
	if (projects[currentProject].templates[projects[currentProject].currentTemplate] === undefined
	||  projects[currentProject].templates[projects[currentProject].currentTemplate] === null)
		projects[currentProject].currentTemplate = 0;
	if (projects[currentProject].templates[projects[currentProject].currentTemplate] === undefined
	||  projects[currentProject].templates[projects[currentProject].currentTemplate] === null) 
		projects[currentProject].templates[projects[currentProject].currentTemplate] = JSON.parse(newTemplate);
	}



var clock;
var sanitizer = 
	{
	'"':"&quot;",
	'#':"&num;",
	'$':"&dollar;",
	'%':"&percnt;",
	'&':"&amp;",
	"'":"&apos;",
	'(':"&lpar;",
	')':"&rpar;",
	'+':"&plus;",
	',':"&comma;",
	'-':"&minus;",
	'.':"&period;",
	'/':"&sol;",
	':':"&colon;",
	';':"&semi;",
	'<':"&lt;",
	'=':"&equals;",
	'>':"&gt;",
	'?':"&quest;",
	'@':"&commat;",
	'\\':"&bsol;",
	'^':"&Hat;",
	'_':"&lowbar;",
	'`':"&grave;",
	'|':"&verbar;",
	'~':"&#126;"
	};
var htmls=
	{
	'[':"<td>",
	']':"</td>",
	'{':"<table>",
	'}':"</table>",
	'\n':"</br>"
	};

	
function resetclock()
	{
	clearTimeout(clock);
	clock = setTimeout(parsetemplateinput, 1000);
	}
	
function parsetemplateinput()
	{
	let t = document.getElementById('template').value;
	setTemplates(t);
	t = sca(sca(t,sanitizer),htmls);
	t = t.replaceAll(/[\t ]+<td>/mg,'<td>').replaceAll(/<\/td>[\t ]+/mg,'</td>');
	t = t.replaceAll(/<\/br><td>/mg,'<tr><td>').replaceAll(/<\/td><\/br>/mg,'</td></tr>');
	let tw = document.getElementById('testWord').value;
	tw = sca(tw, segToInner);
	if (tw !== undefined) 
		if (tw !== null && tw != '')
			{
			t = t.split('*');
			let tl = t.length;
			let ttt = t[0];
			for(let i = 1; i < tl; i++)
				{
				if (i % 2 == 1) 
					ttt += 
						'<a href=\"#\" onClick=&#59;updater(&#39;' + t[i] + '&#39;)&#59;>'+
						sca(executeCommand([tw], gettemplatefield(t[i]))[0], innerToSeg).toLowerCase();
				else ttt += '</a>' + t[i];
				}
			t = ttt;
			}
	t = t.replace2(/\*/m,/\*/m,'<a href=\"#\" onClick=\'updater(this.innerHTML)\'>','</a>');
	document.getElementById("preview").innerHTML = t;
	}

function filltemplate(n, tw, afterExecCommand = '')
	{
	let te = null;
	for(let i = 0; i < projects[currentProject].templates.length; i++)
		if (projects[currentProject].templates[i].name.trim() == n.trim()) 
			{
			te = projects[currentProject].templates[i];
			break;
			}
	if (te === null)
		return;
	let t = '';
	t = te.template;
	t = sca(sca(t, sanitizer), htmls);
	t = t.replaceAll(/[\t ]+<td>/mg, '<td>').replaceAll(/<\/td>[\t ]+/mg, '</td>');
	t = t.replaceAll(/<\/br><td>/mg, '<tr><td>').replaceAll(/<\/td><\/br>/mg, '</td></tr>');
	if (tw !== undefined)
		if (tw !== null && tw != '')
			{
			t = t.split('*');
			let tl = t.length;
			let ttt = t[0];
			for(let i = 1; i < tl; i++)
				{
				if (i % 2 == 1)
					{
					let intermediate = executeCommand([tw], gettemplatefield2(te, t[i]))[0];
					if (afterExecCommand != '')
						{
						for(let q = 0; q < projects[currentProject].commands.length; q++)
							if (projects[currentProject].commands[q].name.trim() == afterExecCommand.trim())
								{
								intermediate = executeCommand([intermediate], projects[currentProject].commands[q].command)[0];
								q = projects[currentProject].commands.length + 20;
								}
						}
					ttt += scop(intermediate);
					}
				else
					ttt += t[i];
				}
			t = ttt;
			}
	if (document.getElementById('output').innerHTML != '')
		document.getElementById('output').innerHTML += '<br>';
	document.getElementById("output").innerHTML += t;
	}
	
function updater(ttt)
	{
	if (ttt === undefined || ttt === null || ttt == "")
		{
		document.getElementById('templateField').value = "No template field selected";
		document.getElementById('inflexion').value = 'Select a template field first';
		document.getElementById('inflexion').disabled = true;
		return;
		}
	document.getElementById('templateField').value = ttt;
	document.getElementById('inflexion').value = gettemplatefield(ttt);
	document.getElementById('inflexion').disabled = false;
	}

function gettemplatefield(fname)
	{
	fixTemplates();
	let ffields = projects[currentProject].templates[projects[currentProject].currentTemplate].fields;
	if (ffields[fname] === undefined) return '';
	if (ffields[fname] === null) return '';
	
	return ffields[fname];
	}

function gettemplatefield2(_te,fname)
	{
	fixTemplates();
	let ffields = _te.fields;
	if (ffields[fname] === undefined) return '';
	if (ffields[fname] === null) return '';
	
	return ffields[fname];
	}

function settemplatefield(fname, fvalue)
	{
	fixTemplates();
	if (projects[currentProject].templates[projects[currentProject].currentTemplate].fields.length == 0)
		projects[currentProject].templates[projects[currentProject].currentTemplate].fields = {};
	projects[currentProject].templates[projects[currentProject].currentTemplate].fields[fname] = fvalue;
	}


