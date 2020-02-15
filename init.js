hexcounterinit = 9472;

hexcounter = hexcounterinit;
segToInner = {};
innerToSeg = {};
groups = {};
groupRatios = {};
maxSegLength = 0;

workedOnWord = '';

logg = '';

mode = 0;

outputWindowContent = '';

function interfacebutton(text, action, id)
	{
	return '<li class="tabs__item"><a href="#"' + 
		( (action != '') ? ' onClick="' + action + '"' : '' ) + 
		( (id !== null && id !== undefined) ? ' id="' + id + '"' : '' ) +
		' class="tabs__link">' + text + '</a></li>\n';
	}
function interfacebuttonbold(text, action, id)
	{
	return '<li class="tabs__item"><a href="#"' + 
		( (action != '') ? ' onClick="' + action + '"' : '' ) + 
		( (id !== null && id !== undefined) ? ' id="' + id + '"' : '' ) +
		' class="tabs__link bld">' + text + '</a></li>\n';
	}

newCommand = 
	'{' +
	'"name": "New command",' +
	'"command": "' +
		'>>clear groups</br>' +
		'>>add group: V = a y o u e i</br>' +
		'>>add group: C = p t k b d g m n r l s h j w</br>' +
		'>>add group: R = r l j w</br>' +
		'>>add group: N = m n</br>' +
		'//type your sound changes in here:</br>' +
		'</br>' +
		'>>add to output",' +
	'"input": ""' +
	'}';

newTemplate = 
	'{' +
	'"name": "New template",' +
	'"template": "",' +
	'"fields": {}' +
	'}';

newProject = 
	'{' +
	'"name": "New project",' +
	'"commands" : [' + newCommand + '],' +
	'"templates" : [' + newTemplate + '],' +
	'"log" : "",' +
	'"input" : "",' +
	'"arguments" : "",' +
	'"currentCommand" : 0,' +
	'"currentTemplate" : 0' +
	'}';

newField =  
	'{' +
	'"name": "",' +
	'"command": ""' +
	'}';

templateoutputfields = {};

initinterface();
updateTabs();
updateTemplates();
updateProjects();
stoutput();
initheight();

windowTitle = "The Conlangjugator";
executeButton = "Execute";

setInterval(storeProjectsToLocalStorage , autoSaveIntervalInMinutes*60*1000);

logArray = [];
